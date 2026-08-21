import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Calendar,
  Users,
  Wallet,
  Tag,
  Car,
  FileText,
  Loader2,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  RouteState,
  TripPlanRequest,
  TravelStyle,
  TransportPreference,
} from '../types';

interface StepRouteProps {
  route: RouteState;
  tripRequest: TripPlanRequest;
  isGeneratingPlan: boolean;
  onUpdateTripRequest: (req: TripPlanRequest) => void;
  onGeneratePlan: (req: TripPlanRequest) => void;
  onContinue: () => void;
}

const INTEREST_OPTIONS = [
  'Beaches',
  'Nature & Parks',
  'Fine Dining',
  'Heritage & Culture',
  'Adventure',
  'Shopping',
  'Nightlife',
  'Photography',
  'Wellness & Spa',
  'Spiritual',
  'Family Fun',
];

const PRESET_ROUTES = [
  {
    name: 'Hyderabad ➔ Goa Beach Getaway',
    origin: 'Hyderabad, India',
    destination: 'Goa, India',
    dates: 'September 10–14, 2026',
    travelers: 4,
    budget: 25000,
    currency: '₹',
    style: 'Balanced' as TravelStyle,
    interests: ['Beaches', 'Fine Dining', 'Heritage & Culture'],
    transport: 'Fastest' as TransportPreference,
    notes: 'Traveling with friends. Love authentic coastal cuisine, beach clubs, and water activities.',
  },
  {
    name: 'French Riviera Luxury Escape',
    origin: 'Monaco Port',
    destination: 'Saint-Jean-Cap-Ferrat, France',
    dates: 'October 12–16, 2026',
    travelers: 2,
    budget: 8500,
    currency: '$',
    style: 'Premium' as TravelStyle,
    interests: ['Nature & Parks', 'Fine Dining', 'Photography'],
    transport: 'Comfortable' as TransportPreference,
    notes: 'Private yacht cruise, seaside dining, and quiet sunset viewpoints.',
  },
  {
    name: 'Swiss Alpine Resort Retreat',
    origin: 'Geneva, Switzerland',
    destination: 'Courchevel, France',
    dates: 'December 20–25, 2026',
    travelers: 4,
    budget: 15000,
    currency: '$',
    style: 'Premium' as TravelStyle,
    interests: ['Adventure', 'Nature & Parks', 'Fine Dining'],
    transport: 'Comfortable' as TransportPreference,
    notes: 'Skiing, luxury chalets, and thermal spa relaxation.',
  },
  {
    name: 'Tokyo to Kyoto Cultural Tour',
    origin: 'Tokyo, Japan',
    destination: 'Kyoto, Japan',
    dates: 'November 4–9, 2026',
    travelers: 2,
    budget: 6500,
    currency: '$',
    style: 'Comfort' as TravelStyle,
    interests: ['Heritage & Culture', 'Fine Dining', 'Photography'],
    transport: 'Fastest' as TransportPreference,
    notes: 'Traditional tea ceremonies, temple tours, and Michelin-rated dining.',
  },
];

export const StepRoute: React.FC<StepRouteProps> = ({
  route,
  tripRequest,
  isGeneratingPlan,
  onUpdateTripRequest,
  onGeneratePlan,
  onContinue,
}) => {
  const [formData, setFormData] = useState<TripPlanRequest>(tripRequest);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      const updated = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
  };

  const handleApplyPreset = (preset: typeof PRESET_ROUTES[0]) => {
    const updated: TripPlanRequest = {
      origin: preset.origin,
      destination: preset.destination,
      travelDates: preset.dates,
      travelers: preset.travelers,
      budget: preset.budget,
      currency: preset.currency,
      travelStyle: preset.style,
      interests: preset.interests,
      transportPreference: preset.transport,
      personalNotes: preset.notes,
      optimizationMode: formData.optimizationMode || 'BEST_EXPERIENCE',
    };
    setFormData(updated);
    onUpdateTripRequest(updated);
    setErrorMsg('');
  };

  const handleSwap = () => {
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.origin.trim() || !formData.destination.trim()) {
      setErrorMsg('Please enter both your starting city and destination.');
      return;
    }

    if (!formData.budget || formData.budget <= 0) {
      setErrorMsg('Please specify a valid trip budget.');
      return;
    }

    setErrorMsg('');
    onUpdateTripRequest(formData);
    onGeneratePlan(formData);
  };

  return (
    <section
      id="route"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative scroll-mt-20"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 1 • Trip Planning & Custom Itinerary</span>
        </div>
        <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-zinc-100 uppercase tracking-tight">
          Smart Trip <span className="text-amber-400">Planner</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
          Enter your starting city, destination, dates, and budget. Our intelligent travel engine creates a customized daily itinerary, route timeline, and activity recommendations.
        </p>
      </div>

      {/* Main Route Card */}
      <div className="max-w-4xl mx-auto bg-[#0a0a10]/95 border border-amber-500/25 rounded-2xl p-6 sm:p-10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden text-left">
        {/* Subtle Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Origin & Destination Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Origin Input */}
            <div className="space-y-2">
              <label
                htmlFor="route-origin-input"
                className="block text-xs font-semibold text-amber-300 tracking-wide uppercase flex items-center gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Starting Location (City or Airport) *</span>
              </label>
              <div className="relative">
                <input
                  id="route-origin-input"
                  type="text"
                  value={formData.origin}
                  onChange={(e) => {
                    setFormData({ ...formData, origin: e.target.value });
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="e.g., Hyderabad, Mumbai, or New York"
                  className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500 text-sm sm:text-base focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all pl-11 shadow-inner font-sans"
                />
                <Navigation className="w-4 h-4 text-amber-400/70 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Swap Button for Desktop */}
            <div className="hidden md:flex absolute left-1/2 top-9 -translate-x-1/2 z-10">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap departure and arrival"
                className="p-2.5 rounded-full bg-zinc-900 border border-amber-500/40 text-amber-400 hover:text-amber-200 hover:border-amber-400 transition-all shadow-lg transform hover:rotate-180 duration-300 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Destination Input */}
            <div className="space-y-2">
              <label
                htmlFor="route-destination-input"
                className="block text-xs font-semibold text-amber-300 tracking-wide uppercase flex items-center gap-2"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Destination (City or Resort Area) *</span>
              </label>
              <div className="relative">
                <input
                  id="route-destination-input"
                  type="text"
                  value={formData.destination}
                  onChange={(e) => {
                    setFormData({ ...formData, destination: e.target.value });
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="e.g., Goa, Bali, or Paris"
                  className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500 text-sm sm:text-base focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all pl-11 shadow-inner font-sans"
                />
                <MapPin className="w-4 h-4 text-amber-400/70 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Dates, Travelers & Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Travel Dates */}
            <div className="space-y-2">
              <label
                htmlFor="route-dates-input"
                className="block text-xs font-semibold text-amber-300 tracking-wide uppercase flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Travel Dates</span>
              </label>
              <input
                id="route-dates-input"
                type="text"
                value={typeof formData.travelDates === 'string' ? formData.travelDates : typeof formData.travelDates === 'object' && formData.travelDates ? `${(formData.travelDates as any).start || ''} - ${(formData.travelDates as any).end || ''}` : ''}
                onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                placeholder="e.g., September 10–14, 2026"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500 text-sm focus:border-amber-400 focus:outline-none font-sans shadow-inner"
              />
            </div>

            {/* Number of Travelers */}
            <div className="space-y-2">
              <label
                htmlFor="route-travelers-input"
                className="block text-xs font-semibold text-amber-300 tracking-wide uppercase flex items-center gap-2"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Number of Guests</span>
              </label>
              <input
                id="route-travelers-input"
                type="number"
                min="1"
                max="50"
                value={formData.travelers}
                onChange={(e) => setFormData({ ...formData, travelers: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-zinc-100 text-sm focus:border-amber-400 focus:outline-none shadow-inner"
              />
            </div>

            {/* Total Budget */}
            <div className="space-y-2">
              <label
                htmlFor="route-budget-input"
                className="block text-xs font-semibold text-amber-300 tracking-wide uppercase flex items-center gap-2"
              >
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                <span>Total Budget ({formData.currency}) *</span>
              </label>
              <div className="flex gap-2">
                <select
                  aria-label="Currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="px-3 py-3 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-zinc-100 text-sm focus:border-amber-400 focus:outline-none"
                >
                  <option value="₹">₹ (INR)</option>
                  <option value="$">$ (USD)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="AED">AED</option>
                </select>
                <input
                  id="route-budget-input"
                  type="number"
                  min="1000"
                  step="500"
                  value={formData.budget || ''}
                  onChange={(e) => setFormData({ ...formData, budget: Math.max(0, parseInt(e.target.value) || 0) })}
                  placeholder="25000"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-zinc-100 text-sm focus:border-amber-400 focus:outline-none shadow-inner font-sans"
                />
              </div>
            </div>
          </div>

          {/* Travel Style & Transport Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Travel Style */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-amber-300 tracking-wide uppercase flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Travel Style</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Budget', 'Balanced', 'Comfort', 'Premium'] as TravelStyle[]).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setFormData({ ...formData, travelStyle: style })}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      formData.travelStyle === style
                        ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                        : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Transport Preference */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-amber-300 tracking-wide uppercase flex items-center gap-2">
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span>Transport Priority</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Fastest', 'Scenic', 'Comfortable', 'Economical'] as TransportPreference[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, transportPreference: t })}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      formData.transportPreference === t
                        ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                        : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interests Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-amber-300 tracking-wide uppercase">
              Trip Preferences & Activities
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const selected = formData.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      selected
                        ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                        : 'bg-zinc-900/80 text-zinc-300 hover:text-amber-200 border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Preferences / Notes */}
          <div className="space-y-2">
            <label
              htmlFor="route-notes-input"
              className="block text-xs font-semibold text-amber-300 tracking-wide uppercase flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Special Requests & Trip Notes</span>
            </label>
            <textarea
              id="route-notes-input"
              rows={2}
              value={formData.personalNotes || ''}
              onChange={(e) => setFormData({ ...formData, personalNotes: e.target.value })}
              placeholder="e.g., Interested in private beach access, child-friendly dining, or photography stops..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500 text-sm focus:border-amber-400 focus:outline-none font-sans shadow-inner resize-none"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Presets Section */}
          <div className="pt-1 text-left">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2.5">
              Popular Trip Templates:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_ROUTES.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-amber-950/40 border border-zinc-800 hover:border-amber-500/40 text-xs text-zinc-300 hover:text-amber-300 transition-all cursor-pointer font-medium"
                >
                  ✨ {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Route Readout */}
          {route?.isConfirmed && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                    Route & Itinerary Ready
                  </div>
                  <div className="text-sm font-medium text-zinc-200">
                    {formData.origin} ➔ {formData.destination} ({formData.travelers} Guests • {formData.currency}{formData.budget?.toLocaleString()})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-300">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Distance</span>
                  <span className="text-amber-300 font-bold">{route.distanceMiles || route.distanceKm} Miles</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Driving Time</span>
                  <span className="text-amber-300 font-bold">{route.eta || route.durationText}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800/80">
            <div className="text-xs text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Travel Concierge Active</span>
            </div>

            <button
              id="confirm-route-btn"
              type="submit"
              disabled={isGeneratingPlan}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-75"
            >
              {isGeneratingPlan ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Your Custom Itinerary...</span>
                </>
              ) : (
                <>
                  <span>{route?.isConfirmed ? 'Update Trip Itinerary' : 'Create Custom Trip Itinerary'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
