import { WeatherData } from '../src/types';
import { getCityCoordinates } from './geoService';

export async function fetchLiveWeather(cityNameOrCoords: { city?: string; lat?: number; lng?: number } | string): Promise<WeatherData | null> {
  let lat: number;
  let lng: number;
  let displayName: string;

  if (typeof cityNameOrCoords === 'object') {
    if (cityNameOrCoords.lat !== undefined && cityNameOrCoords.lng !== undefined) {
      lat = cityNameOrCoords.lat;
      lng = cityNameOrCoords.lng;
      displayName = cityNameOrCoords.city || 'Current Location';
    } else {
      const coords = getCityCoordinates(cityNameOrCoords.city || 'Delhi');
      lat = coords.lat;
      lng = coords.lng;
      displayName = coords.name;
    }
  } else {
    const coords = getCityCoordinates(cityNameOrCoords);
    lat = coords.lat;
    lng = coords.lng;
    displayName = coords.name;
  }

  try {
    // Open-Meteo live API for real-time weather data
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const current = data.current;
      const daily = data.daily;

      const code = current?.weather_code || 0;
      let condition = 'Clear Sky';
      let icon = 'Sun';

      if (code === 0) {
        condition = 'Clear Sky';
        icon = 'Sun';
      } else if (code >= 1 && code <= 3) {
        condition = 'Partly Cloudy';
        icon = 'CloudSun';
      } else if (code >= 45 && code <= 48) {
        condition = 'Foggy';
        icon = 'Cloud';
      } else if (code >= 51 && code <= 67) {
        condition = 'Rain Showers';
        icon = 'CloudRain';
      } else if (code >= 71) {
        condition = 'Cool Breeze';
        icon = 'Wind';
      }

      const temp = Math.round(current?.temperature_2m ?? 28);
      const humidity = Math.round(current?.relative_humidity_2m ?? 45);
      const windSpeed = `${Math.round(current?.wind_speed_10m ?? 12)} km/h`;
      const high = Math.round(daily?.temperature_2m_max?.[0] ?? temp + 3);
      const low = Math.round(daily?.temperature_2m_min?.[0] ?? temp - 5);
      const uvIndex = Math.round(daily?.uv_index_max?.[0] ?? 5);

      return {
        city: displayName,
        temp,
        condition,
        icon,
        visibility: '10 km',
        humidity,
        windSpeed,
        high,
        low,
        uvIndex,
      };
    }
  } catch (err) {
    console.warn(`Weather service error:`, err);
  }

  return null;
}
