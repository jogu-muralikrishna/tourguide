import { WeatherData } from '../types/travel';
import { OpenMeteoWeatherProvider } from '../providers/weatherProvider';

const provider = new OpenMeteoWeatherProvider();

export class WeatherService {
  static async getWeather(latitude: number, longitude: number, cityName?: string): Promise<WeatherData> {
    return provider.getWeather(latitude, longitude, cityName);
  }
}
