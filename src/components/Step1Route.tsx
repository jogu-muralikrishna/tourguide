import React from 'react';
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
    <section id="step-1-route" className="py-8 sm:py-12 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Step 1 of 7</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
            Where do you want to go?
          </h2>
          <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Let AI build a personalized trip around your budget, interests and time. Enter departure and destination.
          </p>
        </div>

        {/* Route Input Card */}
        <div className="ui-card p-6 sm:p-8 relative shadow-lg">
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-4">
            
            {/* FROM Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="route-from-input" className="text-xs uppercase font-semibold text-[var(--text-muted)] tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-500" />
                <span>Starting From</span>
              </label>
              <div className="relative">
                <input
                  id="route-from-input"
                  type="text"
                  placeholder="e.g. Hyderabad, Mumbai, Delhi..."
                  value={fromLocation}
                  onChange={(e) => onFromChange(e.target.value)}
                  className="ui-input w-full text-base sm:text-lg font-medium"
                />
                {fromLocation && (
                  <button
                    onClick={() => onFromChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs px-2 py-1"
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
                className="w-10 h-10 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-color)] hover:border-sky-500 text-[var(--text-primary)] flex items-center justify-center transition-all cursor-pointer shadow-xs"
              >
                <ArrowRightLeft className="w-4 h-4 text-sky-500" />
              </button>
            </div>

            {/* TO Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="route-to-input" className="text-xs uppercase font-semibold text-[var(--text-muted)] tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-500" />
                <span>Destination City</span>
              </label>
              <div className="relative">
                <input
                  id="route-to-input"
                  type="text"
                  placeholder="e.g. Goa, Delhi, Jaipur..."
                  value={toLocation}
                  onChange={(e) => onToChange(e.target.value)}
                  className="ui-input w-full text-base sm:text-lg font-medium"
                />
                {toLocation && (
                  <button
                    onClick={() => onToChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs px-2 py-1"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Calculated Route Metrics */}
          {isComplete && (
            <div className="mt-6 p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] flex flex-wrap items-center justify-around gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">Distance</div>
                  <div className="text-lg font-bold text-[var(--text-primary)]">{distanceKm} km</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">Est. Drive Time</div>
                  <div className="text-lg font-bold text-[var(--text-primary)]">{travelTime}</div>
                </div>
              </div>
            </div>
          )}

          {/* Popular Routes */}
          <div className="mt-6 pt-5 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span className="text-xs uppercase font-semibold tracking-wider text-[var(--text-muted)]">
                Popular Destinations & Routes:
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-400 font-semibold'
                        : 'bg-[var(--bg-surface-elevated)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-sky-500/50 hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{route.from}</span>
                    <span className="text-sky-500">→</span>
                    <span>{route.to}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">({route.distanceKm} km)</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          {isComplete ? (
            <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Route selected: {fromLocation} to {toLocation}</span>
              </div>
              <button
                type="button"
                id="continue-to-fleet-btn"
                onClick={onContinue}
                className="ui-btn-primary w-full sm:w-auto"
              >
                <span>✨ Plan My Trip</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                disabled
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--bg-surface-hover)] text-[var(--text-muted)] text-xs font-semibold cursor-not-allowed border border-[var(--border-color)]"
              >
                Enter departure and destination to continue
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
