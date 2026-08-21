import React, { useState } from 'react';
import { Sun, CloudSun, Cloud, Wind, Eye, Droplets, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  weather: WeatherData | null;
  destination: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, destination }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!weather || !destination) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-6 h-6 text-amber-400 animate-spin-slow" />;
      case 'CloudSun':
        return <CloudSun className="w-6 h-6 text-[#F3E5AB]" />;
      case 'Cloud':
        return <Cloud className="w-6 h-6 text-zinc-300" />;
      default:
        return <Wind className="w-6 h-6 text-[#D4AF37]" />;
    }
  };

  return (
    <div 
      id="floating-weather-widget"
      className="fixed top-22 right-4 sm:right-6 z-30 max-w-[280px] w-full no-print transition-all duration-300"
    >
      <div className="glass-panel rounded-2xl p-4 border border-[#D4AF37]/35 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        
        {/* Widget Top Title */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-800/80">
          <div className="flex items-center gap-1.5 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="text-[10px] uppercase font-mono-tech tracking-wider text-[#D4AF37] font-bold truncate">
              Telemetry: {weather.city || destination}
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            id="toggle-weather-btn"
            className="w-6 h-6 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            title="Toggle Weather Panel"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Primary Row */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#09090D] border border-zinc-800 shadow-inner">
              {renderIcon(weather.icon)}
            </div>
            <div>
              <div className="font-serif-luxury text-2xl font-bold text-white tracking-tight">
                {weather.temp}°C
              </div>
              <div className="text-[11px] font-mono-tech text-zinc-400 capitalize">
                {weather.condition}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Atmospheric Detail Matrix */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-zinc-800/60 grid grid-cols-2 gap-2 text-[10px] font-mono-tech text-zinc-400 animate-fade-in">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-[#D4AF37]" />
              <span>Vis: {weather.visibility}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3 h-3 text-[#D4AF37]" />
              <span>Wind: {weather.windSpeed}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3 h-3 text-[#D4AF37]" />
              <span>Humidity: {weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#D4AF37] font-bold">H/L:</span>
              <span>{weather.high}° / {weather.low}°</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
