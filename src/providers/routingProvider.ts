import { GeoCoordinates, RouteCalculation, LocationDetail } from '../types/travel';

export interface RoutingProvider {
  getRoute(origin: LocationDetail, destination: LocationDetail): Promise<RouteCalculation>;
}

export class OSRMRoutingProvider implements RoutingProvider {
  private cache = new Map<string, RouteCalculation>();

  static haversineDistanceKm(c1: GeoCoordinates, c2: GeoCoordinates): number {
    const R = 6371; // Earth radius in km
    const dLat = ((c2.latitude - c1.latitude) * Math.PI) / 180;
    const dLon = ((c2.longitude - c1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((c1.latitude * Math.PI) / 180) *
        Math.cos((c2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  async getRoute(origin: LocationDetail, destination: LocationDetail): Promise<RouteCalculation> {
    const cacheKey = `${origin.coordinates.latitude},${origin.coordinates.longitude}->${destination.coordinates.latitude},${destination.coordinates.longitude}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const url = `/api/route?fromLat=${origin.coordinates.latitude}&fromLon=${origin.coordinates.longitude}&toLat=${destination.coordinates.latitude}&toLon=${destination.coordinates.longitude}&fromName=${encodeURIComponent(origin.name)}&toName=${encodeURIComponent(destination.name)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data: RouteCalculation = await res.json();
        this.cache.set(cacheKey, data);
        return data;
      }
    } catch (e) {
      console.warn('OSRM routing fetch failed, computing geometric fallback:', e);
    }

    // Haversine fallback computation
    const straightLineKm = OSRMRoutingProvider.haversineDistanceKm(origin.coordinates, destination.coordinates);
    const roadKm = Math.round(straightLineKm * 1.25);
    const distanceMiles = Math.round(roadKm * 0.621371);
    const durationHours = Math.round((roadKm / 65) * 10) / 10;
    const hrs = Math.floor(durationHours);
    const mins = Math.round((durationHours - hrs) * 60);
    const durationFormatted = `${hrs} hr ${mins} min (Estimated Road Vector)`;

    const fallback: RouteCalculation = {
      origin,
      destination,
      distanceKm: roadKm,
      distanceMiles,
      durationHours,
      durationFormatted,
      transportModes: [
        {
          mode: 'AIR',
          duration: '1 hr 15 min',
          estimatedCost: 6500,
          provider: 'Indigo / Air India Express Vector',
          dataStatus: 'ESTIMATED',
        },
        {
          mode: 'ROAD_CHARIOT',
          duration: durationFormatted,
          estimatedCost: Math.round(roadKm * 18),
          provider: 'TourGuide Luxury Chariot Fleet',
          dataStatus: 'ESTIMATED',
        },
        {
          mode: 'RAIL',
          duration: `${Math.round(durationHours * 1.1)} hrs`,
          estimatedCost: 1850,
          provider: 'Vande Bharat / Express Rail',
          dataStatus: 'ESTIMATED',
        },
      ],
      dataStatus: 'ESTIMATED',
      source: 'Haversine Geodesic Corridor Model',
      lastUpdated: new Date().toISOString(),
    };

    this.cache.set(cacheKey, fallback);
    return fallback;
  }
}
