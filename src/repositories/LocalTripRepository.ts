import { Trip, TripStatus } from '../types';
import { TripRepository } from './TripRepository';

const TRIPS_KEY = 'tourguide_trips_repository';

export class LocalTripRepository implements TripRepository {
  private loadTrips(): Trip[] {
    try {
      const data = localStorage.getItem(TRIPS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveTrips(trips: Trip[]): void {
    try {
      localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
    } catch (e) {
      console.error('Failed to write to LocalTripRepository', e);
    }
  }

  async createTrip(tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip> {
    const trips = this.loadTrips();
    const now = new Date().toISOString();
    const id = `TRIP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const newTrip: Trip = {
      ...tripData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    trips.unshift(newTrip);
    this.saveTrips(trips);
    return newTrip;
  }

  async getTrips(userId?: string): Promise<Trip[]> {
    const trips = this.loadTrips();
    if (!userId || userId === 'all') {
      return trips;
    }
    // Filter trips belonging to this user or guest session
    return trips.filter((t) => t.userId === userId || (!t.userId && userId === 'guest-session'));
  }

  async getTripById(id: string): Promise<Trip | null> {
    const trips = this.loadTrips();
    return trips.find((t) => t.id === id) || null;
  }

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    const trips = this.loadTrips();
    const idx = trips.findIndex((t) => t.id === id);
    if (idx === -1) {
      throw new Error(`Trip with ID ${id} does not exist in repository.`);
    }

    const updatedTrip: Trip = {
      ...trips[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    trips[idx] = updatedTrip;
    this.saveTrips(trips);
    return updatedTrip;
  }

  async updateTripStatus(id: string, status: TripStatus): Promise<Trip> {
    return this.updateTrip(id, { status });
  }

  async deleteTrip(id: string): Promise<boolean> {
    const trips = this.loadTrips();
    const filtered = trips.filter((t) => t.id !== id);
    this.saveTrips(filtered);
    return filtered.length < trips.length;
  }

  async duplicateTrip(id: string, newUserId?: string): Promise<Trip> {
    const original = await this.getTripById(id);
    if (!original) {
      throw new Error(`Cannot duplicate nonexistent trip ${id}`);
    }

    const now = new Date().toISOString();
    const newId = `TRIP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const duplicated: Trip = {
      ...original,
      id: newId,
      userId: newUserId || original.userId,
      title: `${original.title || original.destination} (Copy)`,
      status: 'DRAFT',
      bookingStatus: 'DRAFT',
      activeBookingId: undefined,
      createdAt: now,
      updatedAt: now,
    };

    const trips = this.loadTrips();
    trips.unshift(duplicated);
    this.saveTrips(trips);
    return duplicated;
  }
}
