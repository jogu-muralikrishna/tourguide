import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  Clock,
  CloudRain,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Compass,
  ArrowRight,
  Shield,
  Activity,
  Users,
  RotateCcw,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Trip, TripPlanResponse, Booking, DailyItineraryItem } from '../types';
import { CopilotService } from '../services/copilotService';
import { ExpenseService } from '../services/expenseService';
import { AlertService } from '../services/alertService';

interface LiveTravelModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTrip?: Trip | null;
  aiTripPlan?: TripPlanResponse | null;
  confirmedBookings?: Booking[];
  currentLocation?: { latitude: number; longitude: number };
  currentLocationName?: string;
  onOpenEmergency: () => void;
  onOpenExpenses: () => void;
  onOpenPostTrip: () => void;
  onOpenChatbotWithPrompt: (prompt: string) => void;
  onTripUpdated?: () => void;
}

export const LiveTravelModeModal: React.FC<LiveTravelModeModalProps> = ({
  isOpen,
  onClose,
  activeTrip,
  aiTripPlan,
  confirmedBookings = [],
  currentLocation,
  currentLocationName,
  onOpenEmergency,
  onOpenExpenses,
  onOpenPostTrip,
  onOpenChatbotWithPrompt,
  onTripUpdated,
}) => {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(
    currentLocation || null
  );

  const itinerary: DailyItineraryItem[] = activeTrip?.itinerary || aiTripPlan?.days || [];
  const destination = activeTrip?.destination || aiTripPlan?.destination || 'Goa';
  const currency = activeTrip?.currency || aiTripPlan?.currency || '₹';
  const weather = aiTripPlan?.weatherInfo;

  // Next activity calculation
  const { currentActivity, nextActivity, progressPercentage } =
    CopilotService.getNextActivityEngine(itinerary);

  // Budget calculations
  const totalBudget = activeTrip?.budget || aiTripPlan?.estimatedBudget || 25000;
  const expenses = activeTrip ? ExpenseService.getExpenses(activeTrip.id) : [];
  const recordedExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const bookingsCost = confirmedBookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + (b.pricing?.total || b.totalCost || 0), 0);
  const totalSpent = recordedExpenses + bookingsCost;
  const remainingBudget = Math.max(0, totalBudget - totalSpent);
  const isOverBudget = totalSpent > totalBudget;

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Browser geolocation not supported.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocationEnabled(true);
        setLocationError(null);
      },
      (err) => {
        setLocationError('Location access was denied. Continuing in manual mode.');
        setLocationEnabled(false);
      },
      { timeout: 10000 }
    );
  };

  if (!isOpen) return null;

  return (
    <div
      id="live-travel-mode-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl bg-[#090910] border border-amber-500/40 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh] text-left"
      >
        {/* Top Navbar */}
        <div className="bg-gradient-to-r from-zinc-900 via-[#10101c] to-zinc-900 px-5 sm:px-6 py-4 border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury font-bold text-base text-zinc-100 uppercase tracking-wide">
                  LIVE TRAVEL MODE • EXPEDITION COCKPIT
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono-tactical bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  REAL-TIME ACTIVE
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono-tactical">
                {destination} Enclave • AI Copilot Guidance & Geodesic Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cockpit Grid Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 text-xs font-mono-tactical">
          {/* Location & GPS Status Banner */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-zinc-400 text-[10px] uppercase block">Current Location Vector</span>
                <span className="font-bold text-zinc-100">
                  {locationEnabled && coords
                    ? `${destination} (${coords.latitude.toFixed(4)}°N, ${coords.longitude.toFixed(4)}°E)`
                    : `${destination} Prime Corridor (Manual Mode)`}
                </span>
              </div>
            </div>

            {!locationEnabled ? (
              <button
                onClick={handleRequestLocation}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Enable Live GPS</span>
              </button>
            ) : (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> GPS Active
              </span>
            )}
          </div>

          {locationError && (
            <div className="px-4 py-2 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 text-[10px]">
              {locationError}
            </div>
          )}

          {/* Activity Engine Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Activity */}
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-amber-500/30 relative overflow-hidden shadow-lg">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> CURRENT ACTIVITY (DAY {currentActivity?.day || 1})
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  IN PROGRESS
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <h4 className="font-serif-luxury text-base font-bold text-zinc-100">
                  {currentActivity?.title || 'Citadel & Heritage Exploration'}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-zinc-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" /> {currentActivity?.timeSlot}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {currentActivity?.distance}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-2">
                <button
                  onClick={() => onOpenChatbotWithPrompt('What is our current activity and next step?')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium cursor-pointer transition-colors"
                >
                  Ask Copilot
                </button>
              </div>
            </div>

            {/* Next Activity */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 relative overflow-hidden">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" /> NEXT ACTIVITY
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] bg-zinc-800 text-zinc-400">
                  UPCOMING
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <h4 className="font-serif-luxury text-base font-bold text-zinc-200">
                  {nextActivity?.title || 'Coastal Vista & Heritage Trail'}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-zinc-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" /> {nextActivity?.timeSlot}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" /> Distance: {nextActivity?.distance}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-2">
                <button
                  onClick={() => onOpenChatbotWithPrompt('How far is the next activity and what time should we leave?')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium cursor-pointer transition-colors"
                >
                  ETA & Navigation
                </button>
              </div>
            </div>
          </div>

          {/* Meteorological & Financial Telemetry Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Live Weather Card */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-sky-400" /> METEOROLOGICAL RADAR
                </span>
                <span className="text-[10px] text-zinc-500">{weather?.source || 'Open-Meteo Grid'}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-serif-luxury font-bold text-zinc-100">
                    {weather?.tempC ?? 28}°C
                  </span>
                  <span className="text-xs text-zinc-400 block mt-0.5">
                    {weather?.condition ?? 'Optimal Coastal Climate'} • Humidity {weather?.humidity ?? 62}%
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block uppercase">Precipitation Probability</span>
                  <span
                    className={`text-lg font-bold ${
                      (weather?.rainProbability ?? 15) > 50 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {weather?.rainProbability ?? 15}%
                  </span>
                </div>
              </div>

              {(weather?.rainProbability ?? 15) > 50 && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-[10px]">
                  <strong>Precipitation Advisory:</strong> Afternoon showers detected. Copilot recommends exploring covered museums during peak rain.
                </div>
              )}
            </div>

            {/* Remaining Budget & Spending Card */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> TREASURY & EXPENSES
                </span>
                <button
                  onClick={onOpenExpenses}
                  className="text-[10px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
                >
                  Manage Group Split
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Remaining Balance</span>
                  <span className={`text-3xl font-serif-luxury font-bold ${isOverBudget ? 'text-red-400' : 'text-emerald-400'}`}>
                    {currency}{remainingBudget.toLocaleString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 uppercase block">Allocated / Recorded Spend</span>
                  <span className="text-sm font-bold text-zinc-300">
                    {currency}{totalSpent.toLocaleString()} / {currency}{totalBudget.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-amber-400'}`}
                  style={{ width: `${Math.min(100, (totalSpent / (totalBudget || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => onOpenChatbotWithPrompt('Find top recommended authentic dinners near our hotel')}
              className="p-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-left transition-all cursor-pointer group"
            >
              <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">🍽️ Culinary</span>
              <span className="text-zinc-200 font-semibold block text-xs">Find Dinner Nearby</span>
            </button>

            <button
              onClick={onOpenEmergency}
              className="p-3.5 rounded-xl bg-red-950/30 hover:bg-red-950/50 border border-red-500/30 text-left transition-all cursor-pointer group"
            >
              <span className="text-[10px] text-red-400 uppercase font-bold block mb-1">🚨 Emergency SOS</span>
              <span className="text-red-200 font-semibold block text-xs">Hospitals & Police</span>
            </button>

            <button
              onClick={onOpenExpenses}
              className="p-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-left transition-all cursor-pointer group"
            >
              <span className="text-[10px] text-purple-400 uppercase font-bold block mb-1">👥 Group Split</span>
              <span className="text-zinc-200 font-semibold block text-xs">Log & Settle Bills</span>
            </button>

            <button
              onClick={onOpenPostTrip}
              className="p-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-left transition-all cursor-pointer group"
            >
              <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">🏁 Expedition Debrief</span>
              <span className="text-zinc-200 font-semibold block text-xs">Complete & Summary</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
