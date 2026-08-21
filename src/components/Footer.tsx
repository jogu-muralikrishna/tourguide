import React from 'react';
import { Compass, Shield, Lock, Activity, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#050508] border-t border-amber-500/20 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-left relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-800">
          {/* Brand & Purpose */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/40 p-2 flex items-center justify-center text-amber-400">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-wider text-zinc-100">
                TRAVEL<span className="text-amber-400">SYNC</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
              The next-generation luxury travel platform. Seamlessly planning, chauffeuring, and booking bespoke journeys with 5-star hotels, verified drivers, and curated itineraries worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational • 24/7 Concierge Support</span>
            </div>
          </div>

          {/* Core Services */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Luxury Services
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li className="hover:text-amber-300 transition-colors cursor-pointer">Luxury Sedans & SUVs</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">Private Chauffeurs</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">First-Class Rail Suites</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">VIP Group Coaches</li>
            </ul>
          </div>

          {/* Accommodations & Experiences */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Curated Stays
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li className="hover:text-amber-300 transition-colors cursor-pointer">5-Star Luxury Hotels</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">Fine Dining & Scenic Stops</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">Live Route & Weather Tracking</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">Instant Booking Vouchers</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Admin Portal Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} TravelSync Platform. All Rights Reserved.</span>
          </div>

          {/* Admin Portal Trigger */}
          <button
            id="open-admin-terminal-btn"
            onClick={onOpenAdmin}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 text-zinc-400 hover:text-amber-300 text-xs transition-all cursor-pointer group"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>Management & Admin Portal</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
