import React from 'react';
import { Sun, CloudSun, Cloud, CloudRain, Wind, Droplets, X, RefreshCw, AlertCircle } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination?: string;
  city?: string;
  weather: WeatherData | null;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRefresh?: () => void;
}

export const WeatherModal: React.FC<WeatherModalProps> = ({
  isOpen,
  onClose,
  destination,
  city,
  weather,
  isLoading = false,
  errorMessage = null,
  onRefresh = () => {},
}) => {
  if (!isOpen) return null;
  const activeCity = destination || city || weather?.city || 'Destination';

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-10 h-10 text-amber-400 animate-pulse" />;
      case 'CloudSun':
        return <CloudSun className="w-10 h-10 text-amber-300" />;
      case 'Cloud':
        return <Cloud className="w-10 h-10 text-zinc-300" />;
      case 'CloudRain':
        return <CloudRain className="w-10 h-10 text-blue-400" />;
      default:
        return <Wind className="w-10 h-10 text-[#D4AF37]" />;
    }
  };

  return (
    <div 
      id="weather-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="weather-modal-card"
        className="w-full max-w-md bg-[#0D0D12] border border-[#D4AF37]/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(212,175,55,0.2)] text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                Live Destination Weather
              </h3>
              <p className="text-xs text-zinc-400 font-mono-tech">
                {destination ? `Location: ${destination}` : 'No destination chosen'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-mono-tech flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>← Back to Previous Page</span>
            </button>
            <button
              onClick={onClose}
              id="close-weather-modal-btn"
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
              <p className="text-sm font-mono-tech text-zinc-400">
                Checking live weather for {destination}...
              </p>
            </div>
          ) : !destination ? (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-base font-medium text-amber-200">
                Please select your destination first.
              </p>
              <p className="text-xs text-zinc-400 max-w-xs">
                Enter your starting city and destination in Step 1 to check the current weather.
              </p>
            </div>
          ) : errorMessage ? (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-base font-medium text-red-300">
                {errorMessage}
              </p>
              <button
                onClick={onRefresh}
                className="mt-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-xs font-mono-tech text-white flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          ) : weather ? (
            <div className="space-y-5 animate-fade-in">
              {/* Big Temp Box */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#15151B] to-[#1E1E26] border border-[#D4AF37]/30">
                <div className="flex items-center gap-4">
                  {renderIcon(weather.icon)}
                  <div>
                    <div className="text-4xl font-bold font-serif-luxury text-white">
                      {weather.temp}°C
                    </div>
                    <div className="text-sm text-[#F3E5AB] font-medium">
                      {weather.condition}
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono-tech text-xs text-zinc-400">
                  <div className="text-zinc-300">High: {weather.high}°C</div>
                  <div className="text-zinc-400">Low: {weather.low}°C</div>
                </div>
              </div>

              {/* Weather Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
                  <Wind className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase font-mono-tech">Wind Speed</div>
                    <div className="text-sm font-semibold text-white">{weather.windSpeed}</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase font-mono-tech">Humidity</div>
                    <div className="text-sm font-semibold text-white">{weather.humidity}%</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <span className="text-[11px] text-zinc-400 font-mono-tech">
            Real-time weather data
          </span>
          <button
            onClick={onClose}
            id="weather-done-btn"
            className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#B89628] text-black font-semibold text-xs font-mono-tech transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
