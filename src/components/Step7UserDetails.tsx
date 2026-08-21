import React from 'react';
import { Calendar, Clock, Users, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface Step7UserDetailsProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onContinue: () => void;
  onGoBack: () => void;
}

export const Step7UserDetails: React.FC<Step7UserDetailsProps> = ({
  userProfile,
  onUpdateProfile,
  onContinue,
  onGoBack,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const isValid = userProfile.startDate && userProfile.startTime && userProfile.travelersCount >= 1;

  return (
    <section id="step-7-details" className="py-12 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-tech text-xs uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Step 7 of 9</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-2">
            Step 7: <span className="gold-gradient-text">Journey Schedule & Travelers</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Choose your journey date, pickup time, number of passengers, and any special requests.
          </p>
        </div>

        {/* Schedule & Travelers Form Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/25 max-w-2xl mx-auto shadow-[0_0_40px_rgba(0,0,0,0.8)] mb-8">
          
          <div className="space-y-5">
            
            {/* Start Date & Start Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-tech text-[#D4AF37] mb-1.5 uppercase font-semibold">
                  Journey Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={today}
                    value={userProfile.startDate}
                    onChange={(e) => onUpdateProfile({ startDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono-tech text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-[#D4AF37] mb-1.5 uppercase font-semibold">
                  Pickup Time *
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={userProfile.startTime}
                    onChange={(e) => onUpdateProfile({ startTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono-tech text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Travelers Count */}
            <div>
              <label className="block text-xs font-mono-tech text-[#D4AF37] mb-1.5 uppercase font-semibold">
                Number of Travelers *
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onUpdateProfile({ travelersCount: num })}
                    className={`w-12 h-11 rounded-xl font-mono-tech text-xs font-bold transition-all cursor-pointer ${
                      userProfile.travelersCount === num
                        ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.6)]'
                        : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    {num} {num === 1 ? 'Person' : 'People'}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1.5 font-semibold">
                Special Requests / Pickup Instructions (Optional)
              </label>
              <textarea
                rows={3}
                value={userProfile.specialRequests || ''}
                onChange={(e) => onUpdateProfile({ specialRequests: e.target.value })}
                placeholder="e.g. Need baby car seat, Hindi-speaking driver, specific landmark pickup point..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#D4AF37] resize-none"
              />
            </div>

          </div>

        </div>

        {/* Navigation Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#09090D] border border-[#D4AF37]/30 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={onGoBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono-tech uppercase tracking-wider cursor-pointer"
          >
            ← Back to Step 6: Account
          </button>

          <button
            type="button"
            id="continue-to-review-btn"
            disabled={!isValid}
            onClick={onContinue}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono-tech uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              isValid
                ? 'gold-gradient-bg text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] cursor-pointer'
                : 'bg-zinc-800/50 text-zinc-500 border border-zinc-800 cursor-not-allowed'
            }`}
          >
            <span>Continue to Step 8: Review & Edit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
