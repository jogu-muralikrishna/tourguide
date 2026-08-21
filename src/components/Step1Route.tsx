import React, { useState } from 'react';
import { MapPin, ArrowRightLeft, Sparkles, ArrowRight, Gauge, Clock, CheckCircle2 } from 'lucide-react';
import { POPULAR_ROUTES } from '../data/mockData';
import { RouteSuggestion } from '../types';

interface Step1RouteProps {
  fromLocation: string;
  toLocation: string;
  distanceKm: number;
  travelTime: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  onSelectRouteSuggestion: (route: RouteSuggestion) => void;
  onContinue: () => void;
}

export const Step1Route: React.FC<Step1RouteProps> = ({
  fromLocation,
  toLocation,
  distanceKm,
  travelTime,
  onFromChange,
  onToChange,
  onSelectRouteSuggestion,
  onContinue,
}) => {
  const isComplete = fromLocation.trim().length >= 2 && toLocation.trim().length >= 2;

  const handleSwap = () => {
    const temp = fromLocation;
    onFromChange(toLocation);
    onToChange(temp);
  };

  return (
    <section id="step-1-route" className="py-12 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-tech text-xs uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Step 1 of 7</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-2">
            Step 1: <span className="gold-gradient-text">Where Are You Going?</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Enter your starting city and your destination. We will calculate the real highway distance and travel time.
          </p>
        </div>

        {/* Route Input Glass Container */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 relative shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-[#D4AF37]/25">
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-4">
            
            {/* FROM Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="route-from-input" className="text-xs uppercase font-mono-tech tracking-wider text-[#D4AF37] flex items-center gap-1.5 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Starting From (Departure City)</span>
              </label>
              <div className="relative group">
                <input
                  id="route-from-input"
                  type="text"
                  placeholder="e.g. Hyderabad, Mumbai, Delhi..."
                  value={fromLocation}
                  onChange={(e) => onFromChange(e.target.value)}
                  className="w-full bg-[#09090C]/90 text-white placeholder-zinc-600 px-4 py-4 rounded-xl border border-zinc-800 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-base sm:text-lg font-mono-tech transition-all shadow-inner"
                />
                {fromLocation && (
                  <button
                    onClick={() => onFromChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs px-2 py-1 rounded"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center md:pt-6">
              <button
                type="button"
                id="route-swap-btn"
                onClick={handleSwap}
                title="Swap Starting & Destination City"
                className="w-12 h-12 rounded-xl bg-[#14141A] hover:bg-[#202028] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:rotate-180 cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* TO Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="route-to-input" className="text-xs uppercase font-mono-tech tracking-wider text-[#D4AF37] flex items-center gap-1.5 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#F3E5AB]" />
                <span>Going To (Destination City)</span>
              </label>
              <div className="relative group">
                <input
                  id="route-to-input"
                  type="text"
                  placeholder="e.g. Delhi, Bangalore, Jaipur..."
                  value={toLocation}
                  onChange={(e) => onToChange(e.target.value)}
                  className="w-full bg-[#09090C]/90 text-white placeholder-zinc-600 px-4 py-4 rounded-xl border border-zinc-800 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-base sm:text-lg font-mono-tech transition-all shadow-inner"
                />
                {toLocation && (
                  <button
                    onClick={() => onToChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs px-2 py-1 rounded"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Real Calculated Route Metrics if entered */}
          {isComplete && (
            <div className="mt-6 p-4 rounded-xl bg-[#121218] border border-[#D4AF37]/30 flex flex-wrap items-center justify-around gap-4 text-white animate-fade-in">
              <div className="flex items-center gap-2.5">
                <Gauge className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <div className="text-[10px] uppercase font-mono-tech text-zinc-400">Highway Road Distance</div>
                  <div className="text-lg font-bold text-[#F3E5AB]">{distanceKm} km</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <div className="text-[10px] uppercase font-mono-tech text-zinc-400">Estimated Driving Time</div>
                  <div className="text-lg font-bold text-white">{travelTime}</div>
                </div>
              </div>
            </div>
          )}

          {/* Popular Route Suggestions */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-xs uppercase font-mono-tech tracking-wider text-zinc-400">
                Popular Highway Routes:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_ROUTES.map((route, idx) => {
                const isSelected = fromLocation.toLowerCase() === route.from.toLowerCase() && toLocation.toLowerCase() === route.to.toLowerCase();
                return (
                  <button
                    key={idx}
                    type="button"
                    id={`route-suggestion-${idx}`}
                    onClick={() => onSelectRouteSuggestion(route)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech border transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                        : 'bg-[#0E0E12] border-zinc-800/90 text-zinc-300 hover:border-[#D4AF37]/50 hover:text-white'
                    }`}
                  >
                    <span className="font-semibold text-white">{route.from}</span>
                    <span className="text-[#D4AF37]">→</span>
                    <span className="font-semibold text-white">{route.to}</span>
                    <span className="text-[10px] text-zinc-400">({route.distanceKm} km)</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Completion & Continue */}
          {isComplete && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/50 flex items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono-tech font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Step 1 completed: Route confirmed</span>
              </div>
              <button
                type="button"
                id="continue-to-fleet-btn"
                onClick={onContinue}
                className="px-6 py-2.5 rounded-xl gold-gradient-bg text-black font-mono-tech uppercase tracking-wider text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02] cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {!isComplete && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                disabled
                className="w-full sm:w-auto min-w-[260px] px-8 py-4 rounded-xl font-mono-tech uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-3 bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"
              >
                <span>Please enter starting & destination place</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
