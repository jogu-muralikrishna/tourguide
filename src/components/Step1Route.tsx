import React from 'react';
import { MapPin, ArrowRightLeft, Sparkles, ArrowRight, Gauge, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
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
  onGoBack?: () => void;
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
  onGoBack,
}) => {
  const isComplete = fromLocation.trim().length >= 2 && toLocation.trim().length >= 2;

  const handleSwap = () => {
    const temp = fromLocation;
    onFromChange(toLocation);
    onToChange(temp);
  };

  return (
    <section id="step-1-route" className="py-6 sm:py-10 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Top Back & Header */}
        <div className="flex items-center justify-between mb-6">
          {onGoBack ? (
            <button
              type="button"
              onClick={onGoBack}
              className="ui-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Profile</span>
            </button>
          ) : <div />}

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Step 1 of 7</span>
          </div>
        </div>

        <div className="text-center mb-8">
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
                <span>Starting Point (From)</span>
              </label>
              <input
                id="route-from-input"
                type="text"
                value={fromLocation}
                onChange={(e) => onFromChange(e.target.value)}
                placeholder="e.g. Hyderabad, Delhi, Mumbai..."
                className="ui-input py-3 text-sm font-semibold"
              />
            </div>

            {/* SWAP Button */}
            <div className="flex items-center justify-center pt-2 md:pt-6">
              <button
                type="button"
                id="swap-locations-btn"
                onClick={handleSwap}
                title="Swap Departure and Destination"
                className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-sky-500 hover:border-sky-500 transition-all cursor-pointer shadow-xs"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* TO Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="route-to-input" className="text-xs uppercase font-semibold text-[var(--text-muted)] tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>Destination (To)</span>
              </label>
              <input
                id="route-to-input"
                type="text"
                value={toLocation}
                onChange={(e) => onToChange(e.target.value)}
                placeholder="e.g. Bangalore, Goa, Jaipur..."
                className="ui-input py-3 text-sm font-semibold"
              />
            </div>

          </div>

          {/* Dynamic Metrics Preview */}
          {isComplete && (
            <div className="mt-6 pt-6 border-t border-[var(--border-color)] grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in">
              <div className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">Road Distance</div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">{distanceKm} km</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">Drive Time</div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">{travelTime}</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">Telemetry Status</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Live Calculated</div>
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <div className="mt-8 pt-4 border-t border-[var(--border-color)] flex items-center justify-between gap-4">
            {onGoBack ? (
              <button
                type="button"
                onClick={onGoBack}
                className="ui-btn-secondary py-3 px-4 text-xs font-semibold"
              >
                ← Back to Profile
              </button>
            ) : <div />}

            <button
              type="button"
              id="step1-continue-btn"
              disabled={!isComplete}
              onClick={onContinue}
              className="ui-btn-primary py-3.5 px-6 text-sm font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              <span>Choose Vehicle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Popular Route Suggestions */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Popular Highway Routes
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {POPULAR_ROUTES.map((r, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectRouteSuggestion(r)}
                className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-sky-500/50 hover:bg-[var(--bg-surface-elevated)] transition-all cursor-pointer text-left group"
              >
                <div className="text-xs font-bold text-[var(--text-primary)] group-hover:text-sky-500 transition-colors">
                  {r.from} → {r.to}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center justify-between">
                  <span>{r.distanceKm} km</span>
                  <span>{r.estimatedHours || '3h 30m'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
