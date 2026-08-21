import { TravelPlace, Hotel, Restaurant } from '../types/travel';
import { OverpassPlacesProvider } from '../providers/placesProvider';

const provider = new OverpassPlacesProvider();

export class PlacesService {
  static async getPlaces(
    destinationName: string,
    latitude: number,
    longitude: number
  ): Promise<{
    attractions: TravelPlace[];
    restaurants: Restaurant[];
    hotels: Hotel[];
  }> {
    return provider.searchPlaces(destinationName, latitude, longitude);
  }

  static async getAttractions(
    destinationName: string,
    coords: { latitude: number; longitude: number },
    _interests?: string[]
  ): Promise<TravelPlace[]> {
    const data = await provider.searchPlaces(destinationName, coords.latitude, coords.longitude);
    return data.attractions;
  }

  static async getRestaurants(
    destinationName: string,
    coords: { latitude: number; longitude: number },
    _budgetPerMeal?: number
  ): Promise<Restaurant[]> {
    const data = await provider.searchPlaces(destinationName, coords.latitude, coords.longitude);
    return data.restaurants;
  }
}
