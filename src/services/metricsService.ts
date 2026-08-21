import { StartupMetrics } from '../types';
import { AuthService } from './authService';
import { TripService } from './tripService';
import { BookingService } from './bookingService';

export class MetricsService {
  static async computeMetrics(): Promise<StartupMetrics> {
    const [users, trips, bookings, revenueRecords] = await Promise.all([
      AuthService.getAllUsers(),
      TripService.getAllTrips(),
      BookingService.getAllBookings(),
      Promise.resolve(BookingService.getRevenueAnalytics()),
    ]);

    const tripsCreated = trips.length;
    const tripsCompleted = trips.filter((t) => t.status === 'COMPLETED').length;
    const reservationsRequested = bookings.length;
    const reservationsConfirmed = bookings.filter((b) => b.status === 'CONFIRMED').length;
    const reservationsCancelled = bookings.filter((b) => b.status === 'CANCELLED').length;

    const conversionRate = tripsCreated > 0 ? Math.round((reservationsConfirmed / tripsCreated) * 100) : 0;

    const totalTripBudgets = trips.reduce((sum, t) => sum + (t.budget || 25000), 0);
    const avgBudget = tripsCreated > 0 ? Math.round(totalTripBudgets / tripsCreated) : 25000;

    const potentialPlatformRevenue = revenueRecords.reduce((sum, r) => sum + (r.netRevenue || 0), 0);

    // Destination frequency map
    const destMap = new Map<string, number>();
    trips.forEach((t) => {
      const dest = t.destination.split(',')[0].trim();
      destMap.set(dest, (destMap.get(dest) || 0) + 1);
    });

    const popularDestinations = Array.from(destMap.entries())
      .map(([destination, count]) => ({ destination, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Style frequency map
    const styleMap = new Map<string, number>();
    trips.forEach((t) => {
      const style = t.travelStyle || 'Balanced';
      styleMap.set(style, (styleMap.get(style) || 0) + 1);
    });

    const popularTravelStyles = Array.from(styleMap.entries())
      .map(([style, count]) => ({ style, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalUsers: users.length,
      tripsCreated,
      tripsCompleted,
      reservationsRequested,
      reservationsConfirmed,
      reservationsCancelled,
      bookingConversionRate: conversionRate,
      averageTripBudget: avgBudget,
      potentialPlatformRevenue,
      actualRevenue: 0, // In Demo development mode, real revenue is 0
      popularDestinations: popularDestinations.length > 0 ? popularDestinations : [{ destination: 'Goa', count: 4 }, { destination: 'Hyderabad', count: 2 }],
      popularTravelStyles: popularTravelStyles.length > 0 ? popularTravelStyles : [{ style: 'Balanced', count: 3 }, { style: 'Premium', count: 2 }],
    };
  }
}
