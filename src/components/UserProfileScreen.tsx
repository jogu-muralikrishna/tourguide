import React, { useState } from 'react';
import { Mail, Phone, ShieldCheck, Compass, History, LogOut, ArrowRight, Sparkles, Building2, ArrowLeft, Star } from 'lucide-react';
import { AuthRoleUser } from '../services/api';
import { Booking } from '../types';
import { formatINR } from '../utils/pricing';
import { CustomerRatingModal } from './CustomerRatingModal';

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
  const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);
  const isSpecialAdmin = currentUser.role !== 'USER';
  const displayUserId = currentUser.id || currentUser.userId || 'TG-USER-82F4K91';

  const userBookings = bookings.filter((b) => {
    if (currentUser.role === 'MAIN_ADMIN') return true;
    if (currentUser.role === 'HOTEL_ADMIN') return b.hotel?.id === currentUser.hotelId;
    if (currentUser.role === 'TRAVEL_ADMIN') return true;
    return b.user.email?.toLowerCase() === currentUser.email.toLowerCase() || b.userId === displayUserId;
  });

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col justify-between py-8 px-4 sm:px-6 relative overflow-hidden transition-colors">
      
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between z-10 mb-8">
        <div className="flex items-center gap-3">
          {/* Back to Previous Page Option */}
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#14141B] hover:bg-[#20202A] border border-[#D4AF37]/40 text-xs font-mono-tech font-bold text-[#F3E5AB] transition-colors cursor-pointer mr-2"
            title="Go to Previous Page (Login Screen)"
          >
            <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
            <span>← Back to Previous Page</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl gold-gradient-bg text-black flex items-center justify-center font-extrabold text-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#D4AF37]">
              <Compass className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white font-serif-luxury">
                TourGuide <span className="gold-gradient-text font-black">AI</span>
              </h1>
              <span className="text-[10px] uppercase font-mono-tech text-[#F3E5AB]">Luxury Travel Hub</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isSpecialAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#F3E5AB] border border-[#D4AF37]/40 text-xs font-semibold cursor-pointer shadow-sm"
            >
              <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Admin Panel</span>
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
            className="ui-btn-secondary py-1.5 px-3 text-xs text-rose-400 hover:text-rose-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Profile Hub */}
      <div className="max-w-4xl w-full mx-auto my-auto z-10 space-y-6">
        
        {/* User Card */}
        <div className="ui-card-luxury p-6 relative overflow-hidden shadow-2xl border border-[#D4AF37]/35">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl gold-gradient-bg text-black font-extrabold text-2xl flex items-center justify-center border-2 border-[#D4AF37] shadow-lg">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white font-serif-luxury">{currentUser.name}</h2>
                  <span className="px-2 py-0.5 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-[10px] font-mono-tech font-bold uppercase">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 font-mono-tech flex flex-wrap items-center gap-3 pt-1">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#D4AF37]" />{currentUser.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#D4AF37]" />{currentUser.phone || '+91 98765 43210'}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono-tech text-zinc-500 block">User Account ID</span>
              <span className="text-xs font-mono-tech font-bold text-[#F3E5AB]">{displayUserId}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              id="start-journey-btn"
              onClick={onStartJourney}
              className="ui-btn-primary py-4 text-sm font-extrabold uppercase tracking-wider shadow-[0_0_25px_rgba(212,175,55,0.4)]"
            >
              <Compass className="w-5 h-5 text-black" />
              <span>✨ Plan My Trip</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </button>

            <button
              type="button"
              id="user-my-trips-btn"
              onClick={onOpenMyTrips}
              className="ui-btn-secondary py-4 text-sm font-bold uppercase tracking-wider"
            >
              <History className="w-5 h-5 text-[#D4AF37]" />
              <span>My Trips ({userBookings.length})</span>
            </button>
          </div>
        </div>

        {/* Recent Bookings */}
        {userBookings.length > 0 && (
          <div className="ui-card-luxury p-6 shadow-md border border-[#D4AF37]/25">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-serif-luxury">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Recent Bookings</span>
              </h3>
              <button
                type="button"
                onClick={onOpenMyTrips}
                className="text-xs text-[#F3E5AB] hover:underline font-semibold cursor-pointer"
              >
                View all ({userBookings.length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userBookings.slice(0, 2).map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl bg-[#0e0e15] border border-[#D4AF37]/25 hover:border-[#D4AF37] transition-all flex flex-col justify-between shadow-sm space-y-3"
                >
                  <div onClick={() => onSelectBookingTicket(b)} className="cursor-pointer">
                    <div className="flex items-center justify-between text-xs mb-2 font-mono-tech">
                      <span className="text-[#F3E5AB] font-bold">{b.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                        {b.status}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-white mb-1 font-serif-luxury">
                      {b.from} <span className="text-[#D4AF37]">→</span> {b.to}
                    </div>

                    <div className="text-xs text-zinc-400 font-mono-tech">
                      <span>{b.travelDate} at {b.travelTime || '08:00'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-zinc-400">{b.vehicle.name}</span>
                    <span className="text-sm font-bold text-[#F3E5AB]">
                      {formatINR(b.pricing.total)}
                    </span>
                  </div>

                  {(b.status === 'COMPLETED' || b.status === 'Completed') && (
                    <div className="pt-1">
                      {!b.reviewSubmitted ? (
                        <button
                          onClick={() => setRatingBooking(b)}
                          className="w-full py-2 rounded-xl gold-gradient-bg text-black font-bold text-xs flex items-center justify-center gap-1 shadow-md cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-black" />
                          <span>Rate Completed Trip</span>
                        </button>
                      ) : (
                        <div className="text-center text-[10px] font-mono-tech font-bold text-amber-400">
                          ✓ Rating Submitted
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <CustomerRatingModal
        isOpen={Boolean(ratingBooking)}
        booking={ratingBooking}
        onClose={() => setRatingBooking(null)}
        onSubmitSuccess={() => setRatingBooking(null)}
      />

      <div className="text-center text-[11px] text-zinc-400 z-10">
        © 2026 TourGuide AI — Luxury Travel Platform
      </div>
    </div>
  );
};
