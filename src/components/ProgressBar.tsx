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
  // Percentage for the moving car position
  const progressPercent = Math.min(100, Math.max(0, ((currentStep - 1) / (JOURNEY_STEPS.length - 1)) * 100));

  return (
    <div id="journey-progress-container" className="w-full max-w-5xl mx-auto px-4 py-4 no-print">
      <div className="bg-[#09090D] border border-[#D4AF37]/25 rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden">
        
        {/* Step Track Container with Moving Small Car */}
        <div className="relative mb-4 mt-2 px-3 sm:px-6">
          {/* Background Track */}
          <div className="w-full h-2 bg-zinc-800/80 rounded-full relative">
            {/* Active Gold Progress Bar */}
            <div 
              className="h-full bg-gradient-to-r from-[#8C6D1F] via-[#D4AF37] to-[#F3E5AB] rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(212,175,55,0.6)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Smooth Moving Small Car Icon */}
          <div 
            id="moving-progress-car"
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out z-20 pointer-events-none"
            style={{ left: `calc(${progressPercent}% + 12px)` }}
          >
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-[#18160E] border-2 border-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.9)] flex items-center justify-center text-base transform hover:scale-110 transition-transform">
                🚗
              </div>
            </div>
          </div>
        </div>

        {/* 7 Step Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
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
                className={`flex flex-col items-center text-center p-2 rounded-xl transition-all duration-200 ${
                  isCurrent
                    ? 'bg-[#D4AF37]/20 border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-102'
                    : isCompleted
                    ? 'bg-zinc-900/60 border border-zinc-700/60 hover:border-[#D4AF37]/50 cursor-pointer'
                    : isUnlocked
                    ? 'bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 cursor-pointer'
                    : 'bg-zinc-950/40 border border-zinc-900 opacity-40 cursor-not-allowed'
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono-tech font-bold mb-1 transition-colors ${
                    isCurrent
                      ? 'bg-[#D4AF37] text-black shadow-[0_0_8px_rgba(212,175,55,0.7)]'
                      : isCompleted
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50'
                      : isUnlocked
                      ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : !isUnlocked ? (
                    <Lock className="w-3 h-3 text-zinc-600" />
                  ) : (
                    step.num
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`text-xs font-semibold font-serif-luxury truncate w-full ${
                    isCurrent
                      ? 'text-[#F3E5AB]'
                      : isCompleted
                      ? 'text-zinc-200'
                      : isUnlocked
                      ? 'text-zinc-400'
                      : 'text-zinc-600'
                  }`}
                >
                  {step.label}
                </span>

                {/* Short Subtitle */}
                <span className="text-[9px] text-zinc-400 font-mono-tech hidden sm:block truncate w-full">
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
