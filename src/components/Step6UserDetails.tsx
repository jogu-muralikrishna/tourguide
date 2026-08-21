import React from 'react';
import { Calendar, Clock, Users, ArrowRight, CheckCircle2, User, Phone, Mail, FileText } from 'lucide-react';
import { UserProfile } from '../types';

interface Step6UserDetailsProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onContinue: () => void;
  onGoBack: () => void;
}

export const Step6UserDetails: React.FC<Step6UserDetailsProps> = ({
  userProfile,
  onUpdateProfile,
  onContinue,
  onGoBack,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const peopleCount = Math.max(1, userProfile.numberOfPeople || userProfile.travelersCount || 1);

  const isValid =
    userProfile.fullName.trim().length > 1 &&
    userProfile.phone.trim().length > 5 &&
    userProfile.startDate &&
    userProfile.startTime &&
    peopleCount >= 1;

  const handlePeopleChange = (num: number) => {
    onUpdateProfile({
      numberOfPeople: num,
      travelersCount: num,
    });
  };

  return (
    <section id="step-6-details" className="py-12 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-tech text-xs uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Step 6 of 7</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-2">
            Step 6: <span className="gold-gradient-text">Schedule & Passenger Details</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Confirm your journey departure date, pickup time, number of people traveling, and primary traveler contact details.
          </p>
        </div>

        {/* Schedule & Travelers Form Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/25 max-w-2xl mx-auto shadow-[0_0_40px_rgba(0,0,0,0.8)] mb-8">
          
          <div className="space-y-5">
            
            {/* Primary Passenger Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-zinc-800">
              <div>
                <label className="block text-xs font-mono-tech text-[#D4AF37] mb-1.5 uppercase font-semibold">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={userProfile.fullName}
                    onChange={(e) => onUpdateProfile({ fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono-tech text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-[#D4AF37] mb-1.5 uppercase font-semibold">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={userProfile.phone}
                    onChange={(e) => onUpdateProfile({ phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono-tech text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="pb-4 border-b border-zinc-800">
              <label className="block text-xs font-mono-tech text-[#D4AF37] mb-1.5 uppercase font-semibold">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="e.g. traveler@example.com"
                  value={userProfile.email || ''}
                  onChange={(e) => onUpdateProfile({ email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono-tech text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Start Date & Start Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-zinc-800">
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

            {/* Number of People */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono-tech text-[#D4AF37] uppercase font-semibold">
                  Number of People *
                </label>
                <span className="text-xs font-mono-tech text-zinc-400">
                  Currently: <strong className="text-white">{peopleCount === 1 ? '1 Person' : `${peopleCount} People`}</strong>
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePeopleChange(num)}
                    className={`py-2.5 px-2 rounded-xl font-mono-tech text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                      peopleCount === num
                        ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.6)] font-bold'
                        : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    <span>{num}</span>
                    <span className="text-[10px] font-normal opacity-80">
                      {num === 1 ? 'Person' : 'People'}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500 font-mono-tech mt-2">
                All food item calculations, reservations, and boarding tokens automatically scale according to this number.
              </p>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1.5 font-semibold">
                Special Requests / Landmark Pickup Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={userProfile.specialRequests || ''}
                onChange={(e) => onUpdateProfile({ specialRequests: e.target.value })}
                placeholder="e.g. Airport terminal 3 gate 4 pickup, extra luggage space, child seat..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#D4AF37] resize-none"
              />
            </div>

          </div>

        </div>

        {/* Step Completion & Action Bar */}
        <div className="glass-panel p-5 rounded-2xl border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={onGoBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono-tech uppercase tracking-wider cursor-pointer"
          >
            ← Back to Step 5: Route Map
          </button>

          {isValid ? (
            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              <div className="hidden sm:flex items-center gap-2 text-emerald-400 text-xs font-mono-tech font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Step 6 completed</span>
              </div>
              <button
                type="button"
                id="step-6-next-btn"
                onClick={onContinue}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono-tech uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 gold-gradient-bg text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02] cursor-pointer"
              >
                <span>Review & Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-xs font-mono-tech text-amber-400">
              Please enter your Name, Phone, and Journey Schedule
            </span>
          )}
        </div>

      </div>
    </section>
  );
};
