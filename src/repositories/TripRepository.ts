import { Trip, TripStatus } from '../types';

export interface TripRepository {
  createTrip(trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip>;
  getTrips(userId?: string): Promise<Trip[]>;
  getTripById(id: string): Promise<Trip | null>;
  updateTrip(id: string, updates: Partial<Trip>): Promise<Trip>;
  updateTripStatus(id: string, status: TripStatus): Promise<Trip>;
  deleteTrip(id: string): Promise<boolean>;
  duplicateTrip(id: string, newUserId?: string): Promise<Trip>;
}
