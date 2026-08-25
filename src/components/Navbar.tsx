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
            <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md group-hover:bg-sky-600 transition-all duration-300">
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-[var(--text-primary)] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  TourGuide
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">
                Smart Travel Platform
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--bg-surface-elevated)] p-1 rounded-xl border border-[var(--border-color)]">
          <button
            onClick={() => onSelectNavTab?.('home')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all cursor-pointer"
          >
            Explore
          </button>
          <button
            onClick={() => onSelectNavTab?.('planner')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-sky-600 dark:text-sky-400 hover:bg-[var(--bg-surface)] transition-all flex items-center gap-1 cursor-pointer font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Plan Trip
          </button>
          <button
            onClick={onOpenMyTrips}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all flex items-center gap-1 cursor-pointer"
          >
            <Luggage className="w-3.5 h-3.5" />
            My Trips
            {confirmedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-sky-500 text-white text-[10px] font-bold">
                {confirmedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right: Actions & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Theme Selector Dropdown / Button Toggle */}
          <div className="flex items-center bg-[var(--bg-surface-elevated)] p-0.5 rounded-xl border border-[var(--border-color)]">
            <button
              onClick={() => setTheme('light')}
              title="Light Mode"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                theme === 'light' ? 'bg-[var(--bg-surface)] text-amber-500 shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Dark Mode"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-[var(--bg-surface)] text-sky-400 shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('system')}
              title="System Auto Mode"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                theme === 'system' ? 'bg-[var(--bg-surface)] text-indigo-500 shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Laptop className="w-4 h-4" />
            </button>
          </div>

          {/* Weather Button */}
          <button
            onClick={onOpenWeather}
            id="nav-weather-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-hover)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-medium transition-all cursor-pointer"
            title="Check live destination weather"
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Weather</span>
          </button>

          {/* Admin Panel Button if admin */}
          {isSpecialAdmin && (
            <button
              onClick={onOpenAdmin}
              id="nav-admin-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-medium transition-all cursor-pointer"
              title="Admin Dashboard"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* User Profile Avatar / Tag */}
          {currentUser && (
            <div 
              onClick={onGoToProfile}
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-xs cursor-pointer hover:border-sky-500 transition-colors"
              title="View Profile"
            >
              <div className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-xs">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden lg:inline text-[var(--text-primary)] font-medium max-w-[100px] truncate">
                {currentUser.name}
              </span>
            </div>
          )}

          {/* Live Bill Pill */}
          {isJourneyActive && (
            <div 
              id="navbar-live-bill-pill"
              className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span className="font-semibold">{formatINR(totalPrice)}</span>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
