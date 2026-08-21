import { BookingRequest, BookingResult, CancellationResult } from '../providers/booking/BookingProvider';
import { DemoBookingProvider } from '../providers/booking/demoBookingProvider';
import { PaymentService } from './paymentService';
import { TripService } from './tripService';
import { AuthService } from './authService';
import { AdminService } from './adminService';
import { eventBus } from './eventBus';
import { Booking, BookingPricing, RevenueRecord, Vehicle, SanctuaryHotel, Pitstop, TravelerInfo } from '../types';

const bookingProvider = new DemoBookingProvider();
const REVENUE_STORAGE_KEY = 'tourguide_revenue_records';

export class BookingService {
  private static getRevenueRecords(): RevenueRecord[] {
    try {
      const data = localStorage.getItem(REVENUE_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static saveRevenueRecord(record: RevenueRecord): void {
    try {
      const current = this.getRevenueRecords();
      current.unshift(record);
      localStorage.setItem(REVENUE_STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.error('Failed to save revenue record', e);
    }
  }

  /**
   * Deterministic price calculator for transparency:
   * Base Cost = Vehicle + Hotel + Pitstops
   * Taxes = 12% of Base Cost
   * Concierge Service Fee = 5% of Base Cost
   * Total = Base + Taxes + Service Fee
   */
  static calculatePricing(vehicle: Vehicle | null, hotel: SanctuaryHotel | null, pitstops: Pitstop[]): BookingPricing {
    const vehicleCost = vehicle?.price || 0;
    const hotelCost = hotel?.pricePerNight || 0;
    const pitstopsCost = pitstops.reduce((sum, p) => sum + p.price, 0);

    const baseCost = vehicleCost + hotelCost + pitstopsCost;
    const taxes = Math.round(baseCost * 0.12);
    const serviceFee = Math.round(baseCost * 0.05);
    const total = baseCost + taxes + serviceFee;

    return {
      baseCost,
      taxes,
      serviceFee,
      total,
      currency: '₹',
      isEstimated: false,
    };
  }

  static async requestReservation(
    tripId: string,
    traveler: TravelerInfo,
    route: { origin: string; destination: string; distanceMiles: number; eta: string },
    vehicle: Vehicle,
    hotel: SanctuaryHotel,
    pitstops: Pitstop[]
  ): Promise<BookingResult> {
    const user = AuthService.getEffectiveUser();
    const pricing = this.calculatePricing(vehicle, hotel, pitstops);

    eventBus.publish({
      type: 'BOOKING_REQUESTED',
      payload: { bookingId: `REQ-${Date.now()}`, tripId, total: pricing.total },
    });

    // 1. Process simulated payment authorization
    const payment = await PaymentService.processPayment({
      bookingId: `BK-PENDING-${Date.now()}`,
      tripId,
      amount: pricing.total,
      currency: pricing.currency,
      travelerEmail: traveler.email,
      description: `TourGuide Demo Reservation for ${route.origin} → ${route.destination}`,
    });

    if (!payment.success) {
      return {
        success: false,
        error: payment.error || 'Payment authorization failed.',
      };
    }

    // 2. Dispatch booking reservation
    const bookingResult = await bookingProvider.createReservation({
      tripId,
      userId: user.id,
      traveler,
      route,
      vehicle,
      hotel,
      pitstops,
      pricing,
    });

    if (bookingResult.success && bookingResult.booking) {
      const booking = bookingResult.booking;

      // 3. Update trip status if tripId exists
      if (tripId && tripId !== 'draft-session') {
        try {
          await TripService.updateTrip(tripId, {
            bookingStatus: 'CONFIRMED',
            activeBookingId: booking.id,
            status: 'ACTIVE',
          });
        } catch (e) {
          console.warn('Trip status synchronization notice:', e);
        }
      }

      // 4. Ingest booking into multi-tenant Admin/Partner Management System
      try {
        AdminService.ingestCustomerBooking(
          {
            name: traveler.fullName || user.name,
            email: traveler.email || user.email,
            phone: traveler.contactPhone || '+91 99887 76655',
          },
          {
            tripId,
            origin: route.origin,
            destination: route.destination,
            hotel,
            vehicle,
            pricing: {
              total: pricing.total,
              baseCost: pricing.baseCost || pricing.vehicleCost || pricing.total,
              taxes: pricing.taxes || pricing.tax || 0,
              serviceFee: pricing.serviceFee || 0,
              currency: pricing.currency || '₹',
            },
          }
        );
      } catch (err) {
        console.error('Failed to ingest booking into Admin system', err);
      }

      // 5. Record simulated platform revenue
      const gross = pricing.total;
      const platformComm = Math.round(gross * 0.1); // 10%
      const partnerComm = Math.round(gross * 0.85); // 85%
      const sFee = pricing.serviceFee; // 5%
      const net = platformComm + sFee;

      const revRecord: RevenueRecord = {
        id: `REV-${Date.now()}`,
        bookingId: booking.id,
        tripId,
        userId: user.id,
        grossValue: gross,
        platformCommission: platformComm,
        partnerCommission: partnerComm,
        serviceFee: sFee,
        refundAmount: 0,
        netRevenue: net,
        currency: pricing.currency,
        isSimulated: true,
        status: 'RECOGNIZED',
        timestamp: new Date().toISOString(),
      };
      this.saveRevenueRecord(revRecord);

      eventBus.publish({
        type: 'BOOKING_CONFIRMED',
        payload: { bookingId: booking.id, transitId: booking.transitId, total: pricing.total },
      });
    }

    return bookingResult;
  }

  static async cancelReservation(bookingId: string, reason: string = 'Passenger requested cancellation'): Promise<CancellationResult> {
    const result = await bookingProvider.cancelReservation(bookingId, reason);

    if (result.success) {
      eventBus.publish({
        type: 'BOOKING_CANCELLED',
        payload: { bookingId, reason },
      });
    }

    return result;
  }

  static async getAllBookings(): Promise<Booking[]> {
    try {
      const data = localStorage.getItem('tourguide_bookings');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static async getUserBookings(userId?: string): Promise<Booking[]> {
    const target = userId || AuthService.getEffectiveUser().id;
    const all = await this.getAllBookings();
    return all.filter((b) => b.userId === target || (!b.userId && target === 'guest-session'));
  }

  static getRevenueAnalytics(): RevenueRecord[] {
    return this.getRevenueRecords();
  }
}
