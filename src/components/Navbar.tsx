import React from 'react';
import { Compass, Sparkles, Luggage, ShieldAlert, Sun, Moon, Laptop, ArrowLeft, User } from 'lucide-react';
import { formatINR } from '../utils/pricing';
import { AuthRoleUser } from '../services/api';
import { useTheme } from '../context/ThemeContext';

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
  onSelectNavTab?: (tab: 'home' | 'explore' | 'planner' | 'trips' | 'profile') => void;
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
  onSelectNavTab,
}) => {
  const { theme, setTheme } = useTheme();
  const isSpecialAdmin = currentUser && currentUser.role !== 'USER';
  const displayUserId = currentUser?.id || currentUser?.userId || 'TG-USER-82F4K91';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/90 backdrop-blur-md border-b border-[var(--border-color)] no-print transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Logo & Back Button */}
        <div className="flex items-center gap-3">
          {isJourneyActive && (
            <button
              type="button"
              onClick={onGoToProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer mr-1"
              title="Return to User Profile & Hub"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          )}

          <div 
            onClick={onGoToProfile}
            id="navbar-brand-logo"
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl gold-gradient-bg text-black flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-all duration-300">
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500 text-black" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-[#F3E5AB] transition-colors font-serif-luxury">
                  TourGuide
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/40">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">
                Luxury Travel System
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0F0F17]/80 p-1 rounded-xl border border-[#D4AF37]/20 backdrop-blur-md">
          <button
            onClick={() => onSelectNavTab?.('home')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-300 hover:text-white hover:bg-[#181824] transition-all cursor-pointer"
          >
            Explore
          </button>
          <button
            onClick={() => onSelectNavTab?.('planner')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-[#F3E5AB] bg-[#D4AF37]/15 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/25 transition-all flex items-center gap-1 cursor-pointer font-semibold shadow-[0_0_10px_rgba(212,175,55,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Plan Trip
          </button>
          <button
            onClick={onOpenMyTrips}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-300 hover:text-white hover:bg-[#181824] transition-all flex items-center gap-1 cursor-pointer"
          >
            <Luggage className="w-3.5 h-3.5 text-[#D4AF37]" />
            My Trips
            {confirmedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full gold-gradient-bg text-black text-[10px] font-bold">
                {confirmedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Weather Button */}
          <button
            onClick={onOpenWeather}
            id="nav-weather-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111118] hover:bg-[#1A1A24] border border-[#D4AF37]/25 text-[#F3E5AB] text-xs font-medium transition-all cursor-pointer"
            title="Check live destination weather"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Weather</span>
          </button>

          {/* Admin Panel Button (Requires Password Security Verification) */}
          <button
            onClick={onOpenAdmin}
            id="nav-admin-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold transition-all cursor-pointer shadow-[0_0_10px_rgba(212,175,55,0.15)]"
            title="Admin Dashboard (Password Protected)"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Admin Panel</span>
          </button>

          {/* User Profile Avatar / Tag */}
          {currentUser && (
            <div 
              onClick={onGoToProfile}
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#111118] border border-[#D4AF37]/30 text-xs cursor-pointer hover:border-[#D4AF37] transition-colors"
              title="View Profile"
            >
              <div className="w-6 h-6 rounded-full gold-gradient-bg text-black font-bold flex items-center justify-center text-xs">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden lg:inline text-zinc-200 font-medium max-w-[100px] truncate">
                {currentUser.name}
              </span>
            </div>
          )}

          {/* Live Bill Pill */}
          {isJourneyActive && (
            <div 
              id="navbar-live-bill-pill"
              className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-medium shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-bold font-mono-tech text-white">{formatINR(totalPrice)}</span>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
