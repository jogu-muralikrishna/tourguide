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
  Receipt,
  Info,
} from 'lucide-react';
import { motion } from 'motion/react';
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
      className="py-8 sm:py-12 max-w-7xl mx-auto relative scroll-mt-20 text-left"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Generated Schedule & Budget</span>
        </div>
        <h2 className="font-bold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
          Your Personal <span className="text-sky-600 dark:text-sky-400">Itinerary</span>
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          {tripSummary}
        </p>
      </div>

      {/* Optimization Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 ui-card p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
          <Zap className="w-4 h-4 text-sky-500" />
          <span className="uppercase tracking-wider">Plan Optimization:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            id="opt-cheapest-btn"
            type="button"
            onClick={() => onSelectOptimizationMode('CHEAPEST')}
            disabled={isOptimizing}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              optimizationMode === 'CHEAPEST'
                ? 'bg-sky-500 text-white font-bold shadow-xs'
                : 'bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[var(--text-secondary)]'
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              optimizationMode === 'FASTEST'
                ? 'bg-sky-500 text-white font-bold shadow-xs'
                : 'bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[var(--text-secondary)]'
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              optimizationMode === 'BEST_EXPERIENCE'
                ? 'bg-sky-500 text-white font-bold shadow-xs'
                : 'bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[var(--text-secondary)]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Best Experience</span>
          </button>
        </div>
      </div>

      {/* Over Budget Notice */}
      {isOverBudget && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-500 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-red-600 dark:text-red-400 uppercase tracking-wider">
                Current estimate exceeds target budget
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Target: <strong>{currency}{targetBudget.toLocaleString()}</strong></span>
                <span>•</span>
                <span>Estimate: <strong className="text-red-500">{currency}{budgetBreakdown.total.toLocaleString()}</strong></span>
                <span>•</span>
                <span className="text-red-500 font-bold">Over: +{currency}{overBudgetAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            id="optimize-trip-alert-btn"
            type="button"
            onClick={() => onSelectOptimizationMode('CHEAPEST')}
            className="ui-btn-primary bg-red-500 hover:bg-red-600 text-xs py-2 px-4 whitespace-nowrap"
          >
            Adjust to Budget
          </button>
        </motion.div>
      )}

      {/* Main Grid: Daily Cards (Left) & Budget Breakdown Engine (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Daily Itinerary Cards */}
        <div className="lg:col-span-8 space-y-4">
          {(Array.isArray(days) ? days : []).map((day: DailyItineraryItem) => (
            <div
              key={day.dayNumber}
              className="ui-card p-5 transition-all"
            >
              {/* Day Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)] mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs">
                    Day {day.dayNumber}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] font-medium">
                    {day.date}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    <span>{day.travelTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" />
                    <span>{day.approxDistance}</span>
                  </div>
                  <div className="font-bold text-sky-600 dark:text-sky-400">
                    Est: {currency}{day.estimatedCost.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Day Timeline */}
              <div className="space-y-3 text-xs">
                {/* Morning */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold block mb-0.5">
                      Morning Plan
                    </span>
                    <p className="text-[var(--text-primary)] leading-relaxed">{day.morningActivity}</p>
                  </div>
                </div>

                {/* Afternoon */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
                    <Sunset className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold block mb-0.5">
                      Afternoon Activities
                    </span>
                    <p className="text-[var(--text-primary)] leading-relaxed">{day.afternoonActivity}</p>
                  </div>
                </div>

                {/* Evening */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0 mt-0.5">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold block mb-0.5">
                      Evening Highlights
                    </span>
                    <p className="text-[var(--text-primary)] leading-relaxed">{day.eveningActivity}</p>
                  </div>
                </div>

                {/* Food */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold block mb-0.5">
                      Recommended Dining
                    </span>
                    <p className="text-[var(--text-primary)] leading-relaxed font-medium">
                      {day.recommendedFood}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Budget Breakdown Sidebar */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <div className="ui-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-sky-500" />
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  Estimated Trip Expenses
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                CALCULATED
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Intercity Transport:</span>
                <span className="text-[var(--text-primary)] font-semibold">{currency}{budgetBreakdown.transportation.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Hotels & Stays:</span>
                <span className="text-[var(--text-primary)] font-semibold">{currency}{budgetBreakdown.accommodation.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Food & Dining:</span>
                <span className="text-[var(--text-primary)] font-semibold">{currency}{budgetBreakdown.food.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Activities & Passes:</span>
                <span className="text-[var(--text-primary)] font-semibold">{currency}{budgetBreakdown.activities.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Local Cabs:</span>
                <span className="text-[var(--text-primary)] font-semibold">{currency}{budgetBreakdown.localTransport.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Contingency Buffer:</span>
                <span className="text-[var(--text-primary)] font-semibold">{currency}{budgetBreakdown.emergencyBuffer.toLocaleString()}</span>
              </div>

              <div className="pt-3 mt-3 border-t border-[var(--border-color)] flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-semibold">
                    Total Estimated Cost
                  </span>
                </div>
                <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                  {currency}{budgetBreakdown.total.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[11px] text-[var(--text-muted)] space-y-1">
              <div className="flex items-center gap-1.5 text-sky-500 font-semibold uppercase text-[10px]">
                <Info className="w-3.5 h-3.5" />
                <span>Price Transparency Note</span>
              </div>
              <p className="leading-tight">
                All pricing and rates are estimated. Real-time rates are confirmed upon checkout.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
              <button
                id="advance-itinerary-btn"
                type="button"
                onClick={onContinue}
                className="ui-btn-primary w-full"
              >
                <span>Continue to Select Transport</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Tips Card */}
          {tips && tips.length > 0 && (
            <div className="ui-card p-4 text-xs space-y-2">
              <span className="text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider block text-[11px]">
                💡 Local Travel Tips
              </span>
              <ul className="space-y-1 text-[var(--text-secondary)] list-disc list-inside">
                {tips.map((tip, i) => (
                  <li key={i} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
