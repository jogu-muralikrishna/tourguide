import React from 'react';
import { Mail, Phone, ShieldCheck, Compass, History, LogOut, ArrowRight, Sparkles, Building2, Sun, Moon, Laptop } from 'lucide-react';
import { AuthRoleUser } from '../services/api';
import { Booking } from '../types';
import { formatINR } from '../utils/pricing';
import { useTheme } from '../context/ThemeContext';

interface UserProfileScreenProps {
  currentUser: AuthRoleUser;
  bookings: Booking[];
  onStartJourney: () => void;
  onOpenMyTrips: () => void;
  onOpenWeather: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
  onSelectBookingTicket: (booking: Booking) => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  currentUser,
  bookings,
  onStartJourney,
  onOpenMyTrips,
  onOpenWeather,
  onOpenAdmin,
  onLogout,
  onSelectBookingTicket,
}) => {
  const { theme, setTheme } = useTheme();
  const isSpecialAdmin = currentUser.role !== 'USER';
  const displayUserId = currentUser.id || currentUser.userId || 'TG-USER-82F4K91';

  const userBookings = bookings.filter((b) => {
    if (currentUser.role === 'MAIN_ADMIN') return true;
    if (currentUser.role === 'HOTEL_ADMIN') return b.hotel?.id === currentUser.hotelId;
    if (currentUser.role === 'TRAVEL_ADMIN') return true;
    return b.user.email?.toLowerCase() === currentUser.email.toLowerCase() || b.userId === displayUserId;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-between py-8 px-4 sm:px-6 relative overflow-hidden transition-colors">
      
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between z-10 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            TG
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">TourGuide AI</h1>
            <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] tracking-wider">Smart Travel Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher */}
          <div className="flex items-center bg-[var(--bg-surface-elevated)] p-0.5 rounded-xl border border-[var(--border-color)]">
            <button
              onClick={() => setTheme('light')}
              title="Light Mode"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                theme === 'light' ? 'bg-[var(--bg-surface)] text-amber-500 shadow-xs' : 'text-[var(--text-muted)]'
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Dark Mode"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-[var(--bg-surface)] text-sky-400 shadow-xs' : 'text-[var(--text-muted)]'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('system')}
              title="System Mode"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                theme === 'system' ? 'bg-[var(--bg-surface)] text-indigo-500 shadow-xs' : 'text-[var(--text-muted)]'
              }`}
            >
              <Laptop className="w-4 h-4" />
            </button>
          </div>

          {isSpecialAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenWeather}
            className="ui-btn-secondary py-1.5 px-3 text-xs"
          >
            <span>☀️ Weather</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="ui-btn-secondary py-1.5 px-3 text-xs text-rose-500 hover:text-rose-600"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Profile Hub */}
      <div className="max-w-4xl w-full mx-auto my-auto z-10 space-y-6">
        
        {/* User Card */}
        <div className="ui-card p-6 sm:p-8 shadow-xl relative">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-[var(--border-color)]">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-18 h-18 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-3xl font-bold shadow-md">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                    {currentUser.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>

                <div className="text-[var(--text-muted)] text-xs sm:text-sm space-y-0.5">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{currentUser.email}</span>
                  </div>
                  {currentUser.phone && (
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{currentUser.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Permanent User ID Box */}
            <div className="bg-[var(--bg-surface-elevated)] p-4 rounded-2xl border border-[var(--border-color)] text-center sm:text-right min-w-[200px]">
              <div className="text-[10px] uppercase tracking-wider text-sky-500 font-semibold mb-1">
                Permanent User ID
              </div>
              <div className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-wider">
                {displayUserId}
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              id="start-journey-btn"
              onClick={onStartJourney}
              className="ui-btn-primary py-4 text-sm font-bold uppercase tracking-wider shadow-md"
            >
              <Compass className="w-5 h-5" />
              <span>✨ Plan My Trip</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              id="user-my-trips-btn"
              onClick={onOpenMyTrips}
              className="ui-btn-secondary py-4 text-sm font-bold uppercase tracking-wider"
            >
              <History className="w-5 h-5 text-sky-500" />
              <span>My Trips ({userBookings.length})</span>
            </button>
          </div>

        </div>

        {/* Recent Bookings */}
        {userBookings.length > 0 && (
          <div className="ui-card p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>Recent Bookings</span>
              </h3>
              <button
                type="button"
                onClick={onOpenMyTrips}
                className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline cursor-pointer"
              >
                View all ({userBookings.length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userBookings.slice(0, 2).map((b) => (
                <div
                  key={b.id}
                  onClick={() => onSelectBookingTicket(b)}
                  className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] hover:border-sky-500 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-sky-500 font-bold">{b.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {b.status}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-[var(--text-primary)] mb-1">
                      {b.from} <span className="text-sky-500">→</span> {b.to}
                    </div>

                    <div className="text-xs text-[var(--text-muted)]">
                      <span>{b.travelDate} at {b.travelTime || '08:00'}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">{b.vehicle.name}</span>
                    <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
                      {formatINR(b.pricing.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="text-center text-[11px] text-[var(--text-muted)] z-10">
        © 2026 TourGuide AI — Smart Travel Platform
      </div>
    </div>
  );
};
