import { Booking, BookingPricing, SanctuaryHotel, Vehicle, Pitstop, TravelerInfo } from '../../types';

export interface BookingRequest {
  tripId: string;
  userId?: string;
  traveler: TravelerInfo;
  route: {
    origin: string;
    destination: string;
    distanceMiles: number;
    eta: string;
  };
  vehicle: Vehicle;
  hotel: SanctuaryHotel;
  pitstops: Pitstop[];
  pricing: BookingPricing;
}

export interface BookingResult {
  success: boolean;
  booking?: Booking;
  error?: string;
  message?: string;
}

export interface CancellationResult {
  success: boolean;
  bookingId: string;
  cancelledAt: string;
  refundSimulatedAmount: number;
  message: string;
}

export interface BookingProvider {
  createReservation(request: BookingRequest): Promise<BookingResult>;
  cancelReservation(bookingId: string, reason?: string): Promise<CancellationResult>;
  getReservation(bookingId: string): Promise<Booking | null>;
}
