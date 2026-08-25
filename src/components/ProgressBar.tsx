import React from 'react';
import { Check, Lock } from 'lucide-react';

export interface StepItem {
  num: number;
  label: string;
  shortDesc: string;
}

export const JOURNEY_STEPS: StepItem[] = [
  { num: 1, label: 'Locations', shortDesc: 'From & To' },
  { num: 2, label: 'Car', shortDesc: 'Choose Car' },
  { num: 3, label: 'Hotel', shortDesc: 'Hotel Stay' },
  { num: 4, label: 'Food', shortDesc: 'Food Stops' },
  { num: 5, label: 'Route Map', shortDesc: 'Route Path' },
  { num: 6, label: 'Your Details', shortDesc: 'Date & Time' },
  { num: 7, label: 'Review', shortDesc: 'Edit & Confirm' },
];

interface ProgressBarProps {
  currentStep: number;
  maxUnlockedStep: number;
  onNavigateToStep: (stepNumber: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  maxUnlockedStep,
  onNavigateToStep,
}) => {
  const progressPercent = Math.min(100, Math.max(0, ((currentStep - 1) / (JOURNEY_STEPS.length - 1)) * 100));

  return (
    <div id="journey-progress-container" className="w-full max-w-5xl mx-auto px-4 py-3 no-print">
      <div className="ui-card p-3 sm:p-4 relative overflow-hidden backdrop-blur-md">
        
        {/* Step Track */}
        <div className="relative mb-3 mt-1 px-3 sm:px-6">
          <div className="w-full h-2 bg-[var(--bg-surface-hover)] rounded-full relative overflow-hidden">
            <div 
              className="h-full bg-sky-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div 
            id="moving-progress-car"
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out z-20 pointer-events-none"
            style={{ left: `calc(${progressPercent}% + 12px)` }}
          >
            <div className="w-8 h-8 rounded-full bg-sky-500 border-2 border-white dark:border-slate-900 shadow-md flex items-center justify-center text-xs text-white">
              🚗
            </div>
          </div>
        </div>

        {/* 7 Step Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 pt-1">
          {JOURNEY_STEPS.map((step) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            const isUnlocked = step.num <= maxUnlockedStep;

            return (
              <button
                key={step.num}
                id={`progress-step-btn-${step.num}`}
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) {
                    onNavigateToStep(step.num);
                  }
                }}
                className={`flex flex-col items-center text-center p-1.5 rounded-xl transition-all duration-150 ${
                  isCurrent
                    ? 'bg-sky-500/10 border border-sky-500/50 shadow-xs'
                    : isCompleted
                    ? 'bg-[var(--bg-surface-hover)] border border-[var(--border-color)] hover:border-sky-500/30 cursor-pointer'
                    : isUnlocked
                    ? 'bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] hover:border-[var(--border-hover)] cursor-pointer'
                    : 'opacity-40 border border-transparent cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-colors ${
                    isCurrent
                      ? 'bg-sky-500 text-white'
                      : isCompleted
                      ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400'
                      : isUnlocked
                      ? 'bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                      : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  ) : !isUnlocked ? (
                    <Lock className="w-2.5 h-2.5" />
                  ) : (
                    step.num
                  )}
                </div>

                <span
                  className={`text-xs font-semibold truncate w-full ${
                    isCurrent
                      ? 'text-sky-600 dark:text-sky-400'
                      : isCompleted
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {step.label}
                </span>

                <span className="text-[9px] text-[var(--text-muted)] hidden sm:block truncate w-full">
                  {step.shortDesc}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
