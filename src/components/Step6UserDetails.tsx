import React from 'react';
import { Calendar, User, Phone, Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
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
    <section id="step-6-details" className="py-6 sm:py-10 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Top Back Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onGoBack}
            className="ui-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Step 5 (Route Map)</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Step 6 of 7</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Step 6 of 7</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
            Traveler Details & Schedule
          </h2>
          <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-xl mx-auto">
            Confirm departure date, pickup time, group size, and primary traveler contact info.
          </p>
        </div>

        {/* Form Card */}
        <div className="ui-card p-6 sm:p-8 max-w-2xl mx-auto mb-8">
          <div className="space-y-5">
            
            {/* Passenger Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[var(--border-color)]">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={userProfile.fullName}
                    onChange={(e) => onUpdateProfile({ fullName: e.target.value })}
                    className="ui-input w-full pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={userProfile.phone}
                    onChange={(e) => onUpdateProfile({ phone: e.target.value })}
                    className="ui-input w-full pl-9"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="pb-4 border-b border-[var(--border-color)]">
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="e.g. traveler@example.com"
                  value={userProfile.email || ''}
                  onChange={(e) => onUpdateProfile({ email: e.target.value })}
                  className="ui-input w-full pl-9"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[var(--border-color)]">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">
                  Journey Date *
                </label>
                <input
                  type="date"
                  min={today}
                  value={userProfile.startDate}
                  onChange={(e) => onUpdateProfile({ startDate: e.target.value })}
                  className="ui-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">
                  Pickup Time *
                </label>
                <input
                  type="time"
                  value={userProfile.startTime}
                  onChange={(e) => onUpdateProfile({ startTime: e.target.value })}
                  className="ui-input w-full"
                />
              </div>
            </div>

            {/* Number of People */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Number of People *
                </label>
                <span className="text-xs text-[var(--text-muted)]">
                  Selected: <strong className="text-[var(--text-primary)]">{peopleCount === 1 ? '1 Person' : `${peopleCount} People`}</strong>
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePeopleChange(num)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                      peopleCount === num
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-sky-500/30'
                    }`}
                  >
                    <span>{num}</span>
                    <span className="text-[10px] font-normal opacity-80">
                      {num === 1 ? 'Person' : 'People'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">
                Special Requests / Pickup Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={userProfile.specialRequests || ''}
                onChange={(e) => onUpdateProfile({ specialRequests: e.target.value })}
                placeholder="e.g. Airport terminal 3 pickup, child seat..."
                className="ui-input w-full resize-none"
              />
            </div>

          </div>
        </div>

        {/* Action Bar */}
        <div className="ui-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={onGoBack}
            className="ui-btn-secondary w-full sm:w-auto"
          >
            ← Back to Step 5
          </button>

          {isValid ? (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="hidden sm:flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Details Confirmed</span>
              </div>
              <button
                type="button"
                id="step-6-next-btn"
                onClick={onContinue}
                className="ui-btn-primary w-full sm:w-auto"
              >
                <span>Review & Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-xs text-amber-500 font-medium">
              Please enter your Name, Phone, and Schedule
            </span>
          )}
        </div>

      </div>
    </section>
  );
};
