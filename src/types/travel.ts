export type DataStatus = 'LIVE' | 'VERIFIED' | 'ESTIMATED' | 'SAMPLE';

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationDetail {
  name: string;
  formattedAddress: string;
  coordinates: GeoCoordinates;
  dataStatus: DataStatus;
  source: string;
  lastUpdated?: string;
}

export interface TravelPlace {
  id: string;
  name: string;
  type: string;
  category: string;
  location: GeoCoordinates;
  address?: string;
  rating?: number;
  reviewCount?: number;
  priceLevel?: number;
  openingHours?: string[];
  website?: string;
  phone?: string;
  imageUrl?: string;
  approximateVisitDuration?: string;
  source: string;
  sourceUrl?: string;
  dataStatus: DataStatus;
  lastUpdated?: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  pricePerNight?: number;
  currency?: string;
  roomType?: string;
  amenities?: string[];
  cancellationPolicy?: string;
  availability?: boolean;
  bookingUrl?: string;
  source: string;
  dataStatus: DataStatus;
  lastUpdated?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  cuisine: string;
  specialty: string;
  priceLevel?: number;
  estimatedCost?: number;
  openingHours?: string[];
  phone?: string;
  bookingUrl?: string;
  source: string;
  dataStatus: DataStatus;
  lastUpdated?: string;
}

export interface TransportOption {
  id: string;
  provider: string;
  category: 'flights' | 'trains' | 'buses' | 'chariots';
  origin: string;
  destination: string;
  departureTime?: string;
  arrivalTime?: string;
  duration: string;
  price: number;
  currency: string;
  availability?: string;
  bookingUrl?: string;
  distanceKm: number;
  source: string;
  dataStatus: DataStatus;
  lastUpdated?: string;
}

export interface WeatherData {
  city: string;
  latitude: number;
  longitude: number;
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  condition: string;
  iconType: 'sun' | 'cloud' | 'rain' | 'snow' | 'wind';
  humidity: number;
  windSpeed: string;
  visibilityKm: number;
  rainProbability: number;
  forecast: Array<{
    day: string;
    date: string;
    tempC: number;
    condition: string;
    rainProbability: number;
  }>;
  dataStatus: DataStatus;
  source: string;
  lastUpdated: string;
}

export interface RouteCalculation {
  origin: LocationDetail;
  destination: LocationDetail;
  distanceKm: number;
  distanceMiles: number;
  durationHours: number;
  durationFormatted: string;
  transportModes: Array<{
    mode: 'AIR' | 'RAIL' | 'ROAD_CHARIOT';
    duration: string;
    estimatedCost: number;
    provider: string;
    dataStatus: DataStatus;
  }>;
  dataStatus: DataStatus;
  source: string;
  lastUpdated: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  endpoint: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'FALLBACK';
  latencyMs: number;
  source: string;
  details: string;
}

export interface ProviderHealth {
  maps: { status: 'ONLINE' | 'DEGRADED' | 'FALLBACK'; latencyMs: number; provider: string };
  weather: { status: 'ONLINE' | 'DEGRADED' | 'FALLBACK'; latencyMs: number; provider: string };
  places: { status: 'ONLINE' | 'DEGRADED' | 'FALLBACK'; latencyMs: number; provider: string };
  gemini: { status: 'ONLINE' | 'DEGRADED' | 'FALLBACK'; latencyMs: number; provider: string };
  cacheStats: { hits: number; misses: number; size: number };
}
