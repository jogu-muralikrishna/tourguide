import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Zap,
  TrendingDown,
  Award,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TripPlanResponse,
  OptimizationMode,
  DailyItineraryItem,
} from '../types';

interface StepAiItineraryProps {
  plan: TripPlanResponse | null;
  targetBudget: number;
  currency: string;
  isOptimizing: boolean;
  onSelectOptimizationMode: (mode: OptimizationMode) => void;
  onContinue: () => void;
}

export const StepAiItinerary: React.FC<StepAiItineraryProps> = ({
  plan,
  targetBudget,
  currency,
  isOptimizing,
  onSelectOptimizationMode,
  onContinue,
}) => {
  if (!plan) return null;

  const {
    tripSummary,
    destination,
    days,
    budgetBreakdown,
    optimizationMode,
    isOverBudget,
    overBudgetAmount,
    tips,
  } = plan;

  return (
    <section
      id="itinerary"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative scroll-mt-20 text-left"
    >
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Day-by-Day Schedule & Budget Estimation</span>
        </div>
        <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-zinc-100 uppercase tracking-tight">
          Your Customized <span className="text-amber-400">Itinerary</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
          {tripSummary}
        </p>
      </div>

      {/* Optimization Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-[#0a0a12] border border-amber-500/30 p-4 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs text-zinc-300 font-semibold">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="uppercase tracking-wider">Plan Optimization:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            id="opt-cheapest-btn"
            type="button"
            onClick={() => onSelectOptimizationMode('CHEAPEST')}
            disabled={isOptimizing}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              optimizationMode === 'CHEAPEST'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Budget Friendly</span>
          </button>

          <button
            id="opt-fastest-btn"
            type="button"
            onClick={() => onSelectOptimizationMode('FASTEST')}
            disabled={isOptimizing}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              optimizationMode === 'FASTEST'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Fastest Route</span>
          </button>

          <button
            id="opt-best-btn"
            type="button"
            onClick={() => onSelectOptimizationMode('BEST_EXPERIENCE')}
            disabled={isOptimizing}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              optimizationMode === 'BEST_EXPERIENCE'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Best Experience</span>
          </button>
        </div>
      </div>

      {/* Over Budget Alert Notice if applicable */}
      {isOverBudget && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 rounded-2xl bg-red-950/40 border border-red-500/50 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base text-red-200 uppercase tracking-wider">
                Current estimate exceeds your target budget
              </div>
              <div className="text-xs text-zinc-300 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>
                  Target Budget: <strong className="text-zinc-100">{currency}{targetBudget.toLocaleString()}</strong>
                </span>
                <span>•</span>
                <span>
                  Estimated Total: <strong className="text-red-400">{currency}{budgetBreakdown.total.toLocaleString()}</strong>
                </span>
                <span>•</span>
                <span className="text-red-300 font-bold">
                  Difference: +{currency}{overBudgetAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            id="optimize-trip-alert-btn"
            type="button"
            onClick={() => onSelectOptimizationMode('CHEAPEST')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-zinc-950 font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer whitespace-nowrap"
          >
            Adjust to Budget
          </button>
        </motion.div>
      )}

      {/* Main Grid: Daily Cards (Left) & Budget Breakdown Engine (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Daily Itinerary Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {(Array.isArray(days) ? days : []).map((day: DailyItineraryItem) => (
            <motion.div
              key={day.dayNumber}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: day.dayNumber * 0.05 }}
              className="bg-[#0b0b12] border border-amber-500/20 hover:border-amber-400/50 rounded-2xl p-6 backdrop-blur-xl shadow-xl transition-all relative overflow-hidden"
            >
              {/* Day Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800/80 mb-5">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs tracking-wider uppercase">
                    Day {day.dayNumber}
                  </span>
                  <span className="text-xs text-zinc-300 font-medium">
                    {day.date}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <div className="flex items-center gap-1 text-zinc-300">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{day.travelTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{day.approxDistance}</span>
                  </div>
                  <div className="font-bold text-amber-300">
                    Est: {currency}{day.estimatedCost.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Day Timeline Sections */}
              <div className="space-y-4 text-xs font-sans">
                {/* Morning */}
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-400/90 font-bold block mb-0.5">
                      Morning Plan
                    </span>
                    <p className="text-zinc-200 leading-relaxed">{day.morningActivity}</p>
                  </div>
                </div>

                {/* Afternoon */}
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                    <Sunset className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-400/90 font-bold block mb-0.5">
                      Afternoon Activities
                    </span>
                    <p className="text-zinc-200 leading-relaxed">{day.afternoonActivity}</p>
                  </div>
                </div>

                {/* Evening */}
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-400/90 font-bold block mb-0.5">
                      Evening Highlights
                    </span>
                    <p className="text-zinc-200 leading-relaxed">{day.eveningActivity}</p>
                  </div>
                </div>

                {/* Recommended Food */}
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block mb-0.5">
                      Recommended Dining & Cuisine
                    </span>
                    <p className="text-zinc-200 leading-relaxed font-medium">
                      {day.recommendedFood}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Budget Engine & Mathematical Breakdown (4 cols) */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-[#0b0b14] border border-amber-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-zinc-100 uppercase tracking-wide">
                  Estimated Trip Expenses
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                CALCULATED
              </span>
            </div>

            {/* Calculated Breakdown Line Items */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400">Intercity Transport:</span>
                </div>
                <span className="text-zinc-100 font-semibold">
                  {currency}{budgetBreakdown.transportation.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400">Hotels & Stays:</span>
                </div>
                <span className="text-zinc-100 font-semibold">
                  {currency}{budgetBreakdown.accommodation.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400">Food & Dining:</span>
                </div>
                <span className="text-zinc-100 font-semibold">
                  {currency}{budgetBreakdown.food.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400">Activities & Passes:</span>
                </div>
                <span className="text-zinc-100 font-semibold">
                  {currency}{budgetBreakdown.activities.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400">Local Cab & Travel:</span>
                </div>
                <span className="text-zinc-100 font-semibold">
                  {currency}{budgetBreakdown.localTransport.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400">Contingency Buffer:</span>
                </div>
                <span className="text-zinc-100 font-semibold">
                  {currency}{budgetBreakdown.emergencyBuffer.toLocaleString()}
                </span>
              </div>

              {/* Total */}
              <div className="pt-4 mt-4 border-t border-amber-500/30 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                    Total Estimated Cost
                  </span>
                  <span className="text-[11px] text-amber-400/80">
                    Mode: {optimizationMode.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-300">
                  {currency}{budgetBreakdown.total.toLocaleString()}
                </div>
              </div>
            </div>

            {/* AI Disclaimer Box */}
            <div className="mt-6 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[10px]">
                <Info className="w-3.5 h-3.5" />
                <span>Price Transparency Note</span>
              </div>
              <p className="leading-tight text-zinc-400">
                All travel pricing, hotel rates, and timings are estimated. Real-time rates are confirmed upon checkout.
              </p>
            </div>

            {/* Advance Button */}
            <div className="mt-6 pt-4 border-t border-zinc-800">
              <button
                id="advance-itinerary-btn"
                type="button"
                onClick={onContinue}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs tracking-wider uppercase shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Continue to Select Transport</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* AI Tips Card */}
          {tips && tips.length > 0 && (
            <div className="bg-[#0b0b12] border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-xl text-xs space-y-2.5">
              <span className="text-amber-400 font-bold uppercase tracking-wider block text-[11px]">
                💡 Local Travel Tips & Suggestions
              </span>
              <ul className="space-y-1.5 text-zinc-300 list-disc list-inside">
                {tips.map((tip, i) => (
                  <li key={i} className="leading-relaxed">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
