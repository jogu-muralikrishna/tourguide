import React from 'react';
import { Compass, Sparkles, Luggage, ShieldAlert, Sun, Building2, User, ArrowLeft } from 'lucide-react';
import { formatINR } from '../utils/pricing';
import { AuthRoleUser } from '../services/api';

interface NavbarProps {
  currentStep: number;
  totalPrice: number;
  confirmedCount: number;
  currentUser: AuthRoleUser | null;
  isJourneyActive: boolean;
  onOpenMyTrips: () => void;
  onOpenAdmin: () => void;
  onOpenRequestAdmin: () => void;
  onOpenWeather: () => void;
  onGoToProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  totalPrice,
  confirmedCount,
  currentUser,
  isJourneyActive,
  onOpenMyTrips,
  onOpenAdmin,
  onOpenRequestAdmin,
  onOpenWeather,
  onGoToProfile,
}) => {
  const isSpecialAdmin = currentUser && currentUser.role !== 'USER';
  const displayUserId = currentUser?.id || currentUser?.userId || 'TGAI-USER-82F4K91';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo & Back to Profile */}
        <div className="flex items-center gap-3">
          {isJourneyActive && (
            <button
              type="button"
              onClick={onGoToProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono-tech text-zinc-300 hover:text-white transition-colors cursor-pointer mr-1"
              title="Return to User Profile & Travel Hub"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          )}

          <div 
            onClick={onGoToProfile}
            id="navbar-brand-logo"
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#8C6D1F] p-[1px] shadow-[0_0_15px_rgba(212,175,55,0.35)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] transition-all duration-300">
              <div className="w-full h-full bg-[#08080A] rounded-[11px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-[#D4AF37] group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif-luxury text-lg tracking-wider font-bold text-white group-hover:text-[#F3E5AB] transition-colors">
                  TOURGUIDE
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono-tech font-bold rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 tracking-widest">
                  AI
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]/70 font-mono-tech">
                Real-Time Travel Booking
              </span>
            </div>
          </div>
        </div>

        {/* Right Navigation & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* User ID Tag */}
          {currentUser && (
            <div 
              onClick={onGoToProfile}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F0E14] border border-[#D4AF37]/30 text-xs font-mono-tech cursor-pointer hover:border-[#D4AF37]"
              title="Click to view User Profile"
            >
              <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center text-[10px]">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white font-semibold text-[11px]">{currentUser.name}</span>
                <span className="text-[#D4AF37] text-[9px]">{displayUserId}</span>
              </div>
            </div>
          )}

          {/* Weather Button */}
          <button
            onClick={onOpenWeather}
            id="nav-weather-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15151A] hover:bg-[#202028] border border-[#D4AF37]/35 text-[#F3E5AB] hover:text-white text-xs font-mono-tech transition-all cursor-pointer shadow-[0_0_10px_rgba(212,175,55,0.15)]"
            title="Check live destination weather"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Weather</span>
          </button>

          {/* My Trips Button */}
          <button
            onClick={onOpenMyTrips}
            id="nav-my-trips-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111115] hover:bg-[#1C1C24] border border-zinc-800 hover:border-[#D4AF37]/50 text-zinc-300 hover:text-white text-xs font-mono-tech transition-all relative cursor-pointer"
            title="View saved and confirmed trips"
          >
            <Luggage className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">My Trips</span>
            {confirmedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center ml-0.5">
                {confirmedCount}
              </span>
            )}
          </button>

          {/* Admin Panel Button if admin */}
          {isSpecialAdmin && (
            <button
              onClick={onOpenAdmin}
              id="nav-admin-btn"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#14120A] hover:bg-[#201D10] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] text-xs font-mono-tech transition-all cursor-pointer"
              title="Admin Login & Dashboards"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Live Bill Pill */}
          {isJourneyActive && (
            <div 
              id="navbar-live-bill-pill"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A1811] border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-mono-tech shadow-[0_0_15px_rgba(212,175,55,0.15)]"
            >
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span className="text-[10px] uppercase text-zinc-400">Total:</span>
              <span className="font-bold text-[#D4AF37]">{formatINR(totalPrice)}</span>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
