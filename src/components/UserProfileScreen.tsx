import React from 'react';
import { User, Mail, Phone, ShieldCheck, MapPin, Compass, History, LogOut, ArrowRight, Sparkles, Building2, Car, Calendar } from 'lucide-react';
import { AuthRoleUser } from '../services/api';
import { Booking } from '../types';
import { formatINR } from '../utils/pricing';

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
  const isSpecialAdmin = currentUser.role !== 'USER';
  const displayUserId = currentUser.id || currentUser.userId || 'TGAI-USER-82F4K91';

  const userBookings = bookings.filter((b) => {
    if (currentUser.role === 'MAIN_ADMIN') return true;
    if (currentUser.role === 'HOTEL_ADMIN') return b.hotel?.id === currentUser.hotelId;
    if (currentUser.role === 'TRAVEL_ADMIN') return true;
    return b.user.email?.toLowerCase() === currentUser.email.toLowerCase() || b.userId === displayUserId;
  });

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col justify-between py-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Brand Bar */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between z-10 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F3E5AB] to-[#8C6D1F] p-[1px] shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <div className="w-full h-full bg-[#09090C] rounded-[11px] flex items-center justify-center">
              <span className="font-serif-luxury font-bold text-[#D4AF37] text-lg">TG</span>
            </div>
          </div>
          <div>
            <h1 className="font-serif-luxury text-xl font-bold tracking-wider gold-gradient-text">TOURGUIDE AI</h1>
            <span className="text-[10px] uppercase font-mono-tech tracking-widest text-zinc-500">Real-Time Travel System</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isSpecialAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] text-xs font-mono-tech text-[#F3E5AB] hover:bg-[#D4AF37]/30 transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenWeather}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono-tech text-zinc-300 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <span>☀️ Weather</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono-tech text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Profile & Hub Dashboard */}
      <div className="max-w-4xl w-full mx-auto my-auto z-10 space-y-6">
        
        {/* User Identity Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/35 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl relative">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-zinc-800">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1A1812] to-[#0A0A0E] border-2 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center text-3xl font-serif-luxury font-bold shadow-[0_0_25px_rgba(212,175,55,0.3)]">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
                    {currentUser.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-400 text-[10px] font-mono-tech font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>

                <div className="text-zinc-400 text-xs sm:text-sm font-mono-tech space-y-0.5">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{currentUser.email}</span>
                  </div>
                  {currentUser.phone && (
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{currentUser.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Permanent User ID Box */}
            <div className="bg-[#0A0A0E] p-4 rounded-2xl border border-[#D4AF37]/40 text-center sm:text-right shadow-inner min-w-[200px]">
              <div className="text-[10px] uppercase font-mono-tech tracking-widest text-[#D4AF37] font-semibold mb-1">
                Permanent User ID
              </div>
              <div className="font-mono-tech text-base sm:text-lg font-bold text-white tracking-wider">
                {displayUserId}
              </div>
              <div className="text-[10px] text-zinc-400 mt-1">
                Linked across all your journeys
              </div>
            </div>
          </div>

          {/* Action Buttons Hub */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              id="start-journey-btn"
              onClick={onStartJourney}
              className="py-4 px-6 rounded-2xl gold-gradient-bg text-black font-bold font-mono-tech text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(212,175,55,0.45)] hover:shadow-[0_0_50px_rgba(212,175,55,0.7)] hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Compass className="w-5 h-5 stroke-[2.5]" />
              <span>Start Journey</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              id="user-my-trips-btn"
              onClick={onOpenMyTrips}
              className="py-4 px-6 rounded-2xl bg-[#121218] hover:bg-[#1A1A24] border border-zinc-700 hover:border-[#D4AF37] text-white font-mono-tech text-sm uppercase tracking-wider font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg"
            >
              <History className="w-5 h-5 text-[#D4AF37]" />
              <span>My Trips ({userBookings.length})</span>
            </button>
          </div>

        </div>

        {/* Recent Active Bookings Preview */}
        {userBookings.length > 0 && (
          <div className="glass-panel rounded-3xl p-6 border border-zinc-800 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-luxury text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Your Active & Recent Bookings</span>
              </h3>
              <button
                type="button"
                onClick={onOpenMyTrips}
                className="text-xs text-[#D4AF37] hover:text-[#F3E5AB] font-mono-tech underline cursor-pointer"
              >
                View all ({userBookings.length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userBookings.slice(0, 2).map((b) => (
                <div
                  key={b.id}
                  onClick={() => onSelectBookingTicket(b)}
                  className="p-4 rounded-2xl bg-[#09090D] border border-zinc-800 hover:border-[#D4AF37]/50 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono-tech mb-2">
                      <span className="text-[#D4AF37] font-bold">{b.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 text-[10px] border border-emerald-800">
                        {b.status}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-white mb-1">
                      {b.from} <span className="text-[#D4AF37]">→</span> {b.to}
                    </div>

                    <div className="text-xs text-zinc-400 font-mono-tech flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      <span>{b.travelDate} at {b.travelTime || '08:00 AM'}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-zinc-400">{b.vehicle.name}</span>
                    <span className="text-sm font-bold text-[#F3E5AB]">
                      {formatINR(b.pricing.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="text-center text-[11px] font-mono-tech text-zinc-400 z-10">
        © 2026 TOURGUIDE AI — Real-Time Highway & Travel System
      </div>
    </div>
  );
};
