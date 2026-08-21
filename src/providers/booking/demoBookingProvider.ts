import { Booking, BookingStatus } from '../../types';
import { BookingProvider, BookingRequest, BookingResult, CancellationResult } from './BookingProvider';

const STORAGE_KEY = 'tourguide_bookings';

export class DemoBookingProvider implements BookingProvider {
  private getStoredBookings(): Booking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveStoredBookings(bookings: Booking[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save demo bookings', e);
    }
  }

  async createReservation(request: BookingRequest): Promise<BookingResult> {
    // Simulate brief network / dispatch grid latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Validate inputs
    if (!request.traveler.fullName.trim() || !request.traveler.email.trim()) {
      return {
        success: false,
        error: 'Passenger manifest incomplete. Full name and email contact are required.',
      };
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const transitId = `TG-${randomSuffix}-VIP`;
    const bookingId = `BK-${Date.now()}-${randomSuffix}`;
    const now = new Date().toISOString();

    const newBooking: Booking = {
      id: bookingId,
      tripId: request.tripId,
      transitId,
      userId: request.userId || 'guest-session',
      timestamp: now,
      traveler: { ...request.traveler },
      route: { ...request.route },
      vehicle: { ...request.vehicle },
      pitstops: [...request.pitstops],
      hotel: { ...request.hotel },
      pricing: { ...request.pricing },
      totalCost: request.pricing.total,
      status: 'CONFIRMED',
      paymentStatus: 'PAID', // In demo mode, simulated payment confirmed
      reservationType: 'DEMO_BOOKING',
      isDemoReservation: true,
      provider: 'TourGuide Simulated Dispatch Grid',
      createdAt: now,
      updatedAt: now,
    };

    const current = this.getStoredBookings();
    this.saveStoredBookings([newBooking, ...current.filter((b) => b.id !== bookingId)]);

    return {
      success: true,
      booking: newBooking,
      message: 'Demo reservation successfully confirmed across luxury dispatch matrix.',
    };
  }

  async cancelReservation(bookingId: string, reason: string = 'User requested cancellation'): Promise<CancellationResult> {
    await new Promise((resolve) => setTimeout(resolve, 450));

    const current = this.getStoredBookings();
    const idx = current.findIndex((b) => b.id === bookingId || b.transitId === bookingId);

    if (idx === -1) {
      throw new Error(`Booking ${bookingId} not found in reservation registry.`);
    }

    const booking = current[idx];
    const now = new Date().toISOString();

    const updatedBooking: Booking = {
      ...booking,
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED',
      cancelledAt: now,
      cancellationReason: reason,
      updatedAt: now,
    };

    current[idx] = updatedBooking;
    this.saveStoredBookings(current);

    return {
      success: true,
      bookingId: booking.id,
      cancelledAt: now,
      refundSimulatedAmount: booking.pricing?.total || booking.totalCost || 0,
      message: 'Simulated reservation cancelled. Refund credited in development demo mode.',
    };
  }

  async getReservation(bookingId: string): Promise<Booking | null> {
    const current = this.getStoredBookings();
    return current.find((b) => b.id === bookingId || b.transitId === bookingId) || null;
  }
}
