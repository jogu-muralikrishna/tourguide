import { Trip, TripPlanRequest, TripPlanResponse, TripStatus, BookingStatus, Vehicle, SanctuaryHotel, Pitstop } from '../types';
import { LocalTripRepository } from '../repositories/LocalTripRepository';
import { AuthService } from './authService';
import { eventBus } from './eventBus';

const repository = new LocalTripRepository();

export class TripService {
  static async savePlanAsTrip(
    request: TripPlanRequest,
    plan: TripPlanResponse,
    vehicle?: Vehicle | null,
    hotel?: SanctuaryHotel | null,
    pitstops?: Pitstop[]
  ): Promise<Trip> {
    const user = AuthService.getEffectiveUser();

    const tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: user.id,
      title: `${request.origin.split(',')[0]} → ${request.destination.split(',')[0]} Expedition`,
      origin: request.origin,
      destination: request.destination,
      startDate: (typeof request.travelDates === 'string' ? request.travelDates : '').split('–')[0]?.trim() || 'Day 1',
      endDate: (typeof request.travelDates === 'string' ? request.travelDates : '').split('–')[1]?.trim() || 'Day 4',
      travelDates: request.travelDates,
      travelers: request.travelers,
      budget: request.budget,
      currency: request.currency,
      travelStyle: request.travelStyle,
      interests: request.interests,
      transportPreference: request.transportPreference,
      personalNotes: request.personalNotes,
      optimizationMode: request.optimizationMode || 'BEST_EXPERIENCE',
      itinerary: plan.days,
      transportation: plan.transportation,
      selectedVehicle: vehicle || null,
      selectedHotel: hotel || null,
      selectedPitstops: pitstops || [],
      budgetBreakdown: plan.budgetBreakdown,
      status: 'PLANNED',
      bookingStatus: 'DRAFT',
    };

    const createdTrip = await repository.createTrip(tripData);
    eventBus.publish({
      type: 'TRIP_SAVED',
      payload: { tripId: createdTrip.id, title: createdTrip.title },
    });

    return createdTrip;
  }

  static async getUserTrips(userId?: string): Promise<Trip[]> {
    const targetUserId = userId || AuthService.getEffectiveUser().id;
    return repository.getTrips(targetUserId);
  }

  static async getAllTrips(): Promise<Trip[]> {
    return repository.getTrips('all');
  }

  static async getTripById(id: string): Promise<Trip | null> {
    return repository.getTripById(id);
  }

  static async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    const updated = await repository.updateTrip(id, updates);
    if (updates.status) {
      eventBus.publish({
        type: 'TRIP_UPDATED',
        payload: { tripId: id, status: updates.status },
      });
    }
    return updated;
  }

  static async deleteTrip(id: string): Promise<boolean> {
    return repository.deleteTrip(id);
  }

  static async duplicateTrip(id: string): Promise<Trip> {
    const user = AuthService.getEffectiveUser();
    const duplicated = await repository.duplicateTrip(id, user.id);
    eventBus.publish({
      type: 'TRIP_CREATED',
      payload: { tripId: duplicated.id, destination: duplicated.destination, budget: duplicated.budget },
    });
    return duplicated;
  }
}
