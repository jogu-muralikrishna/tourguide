import { LocationDetail } from '../types/travel';
import { NominatimGeocodingProvider } from '../providers/geocodingProvider';

const provider = new NominatimGeocodingProvider();

export class GeocodingService {
  static async geocode(query: string): Promise<LocationDetail> {
    return provider.searchLocation(query);
  }
}
