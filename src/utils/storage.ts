import { Booking } from '../types';
import { INITIAL_SAMPLE_BOOKINGS } from '../data/mockData';

const BOOKINGS_KEY = 'tgai_confirmed_bookings_v2';
const DRAFT_TRIP_KEY = 'tgai_draft_trip_v2';
const USER_KEY = 'tgai_cached_user_v2';

export function getBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      // Seed with initial realistic bookings
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_SAMPLE_BOOKINGS));
      return INITIAL_SAMPLE_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SAMPLE_BOOKINGS;
  } catch (err) {
    console.error('Failed to load bookings from localStorage:', err);
    return INITIAL_SAMPLE_BOOKINGS;
  }
}

export function saveBooking(booking: Booking): Booking {
  try {
    const existing = getBookings();
    // Prepend new booking
    const updated = [booking, ...existing.filter(b => b.id !== booking.id)];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    return booking;
  } catch (err) {
    console.error('Failed to save booking to localStorage:', err);
    return booking;
  }
}

export function getBookingById(id: string): Booking | undefined {
  const list = getBookings();
  return list.find(b => b.id.toLowerCase() === id.toLowerCase());
}

export function deleteBooking(id: string): boolean {
  try {
    const existing = getBookings();
    const updated = existing.filter(b => b.id !== id);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to delete booking:', err);
    return false;
  }
}

export function updateBookingStatus(id: string, status: 'Confirmed' | 'Pending' | 'Cancelled'): boolean {
  try {
    const existing = getBookings();
    const updated = existing.map(b => (b.id === id ? { ...b, status } : b));
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to update booking status:', err);
    return false;
  }
}

export function saveDraftTrip(draft: any): void {
  try {
    localStorage.setItem(DRAFT_TRIP_KEY, JSON.stringify(draft));
  } catch (err) {
    console.error('Failed to save draft:', err);
  }
}

export function getDraftTrip(): any | null {
  try {
    const raw = localStorage.getItem(DRAFT_TRIP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCachedUser(userData: any): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (err) {
    console.error('Failed to save cached user:', err);
  }
}

export function getCachedUser(): any | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
