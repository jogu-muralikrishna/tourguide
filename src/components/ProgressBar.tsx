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
      <div className="ui-card-luxury p-3 sm:p-4 relative overflow-hidden backdrop-blur-md">
        
        {/* Step Track */}
        <div className="relative mb-3 mt-1 px-3 sm:px-6">
          <div className="w-full h-2 bg-[#12121c] rounded-full relative overflow-hidden border border-[#D4AF37]/20">
            <div 
              className="h-full gold-gradient-bg rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(212,175,55,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div 
            id="moving-progress-car"
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out z-20 pointer-events-none"
            style={{ left: `calc(${progressPercent}% + 12px)` }}
          >
            <div className="w-8 h-8 rounded-full gold-gradient-bg border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.6)] flex items-center justify-center text-xs text-black font-bold">
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
                    ? 'bg-[#D4AF37]/15 border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    : isCompleted
                    ? 'bg-[#12121b] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 cursor-pointer'
                    : isUnlocked
                    ? 'bg-[#0e0e16] border border-white/10 hover:border-[#D4AF37]/30 cursor-pointer'
                    : 'opacity-40 border border-transparent cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-colors ${
                    isCurrent
                      ? 'gold-gradient-bg text-black shadow-[0_0_10px_rgba(212,175,55,0.5)]'
                      : isCompleted
                      ? 'bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/40'
                      : isUnlocked
                      ? 'bg-[#161622] text-zinc-300 border border-white/10'
                      : 'bg-[#0a0a0f] text-zinc-600'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 stroke-[2.5] text-[#F3E5AB]" />
                  ) : !isUnlocked ? (
                    <Lock className="w-2.5 h-2.5 text-zinc-500" />
                  ) : (
                    step.num
                  )}
                </div>

                <span
                  className={`text-xs font-semibold truncate w-full ${
                    isCurrent
                      ? 'text-[#F3E5AB] font-bold'
                      : isCompleted
                      ? 'text-white'
                      : 'text-zinc-400'
                  }`}
                >
                  {step.label}
                </span>

                <span className="text-[9px] text-zinc-500 hidden sm:block truncate w-full">
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
