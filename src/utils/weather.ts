import { WeatherData } from '../types';

export const CITY_WEATHER_MAP: Record<string, WeatherData> = {
  delhi: {
    city: 'Delhi',
    temp: 28,
    condition: 'Pleasant & Clear Skies',
    icon: 'Sun',
    visibility: '9.5 km',
    humidity: 45,
    windSpeed: '12 km/h',
    high: 32,
    low: 21,
    uvIndex: 4,
  },
  mumbai: {
    city: 'Mumbai',
    temp: 30,
    condition: 'Coastal Breeze & Sunny',
    icon: 'CloudSun',
    visibility: '10.0 km',
    humidity: 68,
    windSpeed: '18 km/h',
    high: 33,
    low: 26,
    uvIndex: 6,
  },
  bangalore: {
    city: 'Bangalore',
    temp: 24,
    condition: 'Mild & Breezy Weather',
    icon: 'CloudSun',
    visibility: '12.0 km',
    humidity: 55,
    windSpeed: '14 km/h',
    high: 28,
    low: 19,
    uvIndex: 5,
  },
  hyderabad: {
    city: 'Hyderabad',
    temp: 29,
    condition: 'Clear Horizon & Warm Sun',
    icon: 'Sun',
    visibility: '10.0 km',
    humidity: 48,
    windSpeed: '11 km/h',
    high: 33,
    low: 22,
    uvIndex: 5,
  },
  chennai: {
    city: 'Chennai',
    temp: 31,
    condition: 'Warm Sea Breeze',
    icon: 'Sun',
    visibility: '10.0 km',
    humidity: 72,
    windSpeed: '16 km/h',
    high: 34,
    low: 27,
    uvIndex: 6,
  },
  jaipur: {
    city: 'Jaipur',
    temp: 27,
    condition: 'Dry & Sunny Afternoon',
    icon: 'Sun',
    visibility: '10.0 km',
    humidity: 35,
    windSpeed: '10 km/h',
    high: 31,
    low: 18,
    uvIndex: 4,
  },
  goa: {
    city: 'Goa',
    temp: 29,
    condition: 'Tropical Coastal Sun',
    icon: 'Sun',
    visibility: '11.0 km',
    humidity: 70,
    windSpeed: '15 km/h',
    high: 32,
    low: 25,
    uvIndex: 6,
  },
};

export function getWeatherForCity(cityName: string): WeatherData {
  if (!cityName || !cityName.trim()) {
    return CITY_WEATHER_MAP['delhi'];
  }

  const normalized = cityName.trim().toLowerCase();

  for (const [key, data] of Object.entries(CITY_WEATHER_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return data;
    }
  }

  // Deterministic realistic weather for any custom city
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const positiveHash = Math.abs(hash);

  const temps = [22, 25, 27, 29, 31, 33];
  const conditions = [
    'Pleasant Clear Skies',
    'Warm Sun & Light Breeze',
    'Mild Atmosphere',
    'Clear Horizon & Gentle Wind',
    'Sunlit Afternoon',
  ];
  const icons = ['Sun', 'CloudSun', 'Cloud', 'Wind'];

  const temp = temps[positiveHash % temps.length];
  const condition = conditions[positiveHash % conditions.length];
  const icon = icons[positiveHash % icons.length];

  return {
    city: cityName.charAt(0).toUpperCase() + cityName.slice(1),
    temp,
    condition,
    icon,
    visibility: `${(8 + (positiveHash % 6)).toFixed(1)} km`,
    humidity: 40 + (positiveHash % 40),
    windSpeed: `${10 + (positiveHash % 15)} km/h`,
    high: temp + 4,
    low: temp - 6,
    uvIndex: 3 + (positiveHash % 5),
  };
}
