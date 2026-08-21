import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Car, Compass, MapPin } from 'lucide-react';

interface HeroProps {
  onStartPlanning: () => void;
  onExploreFleet: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartPlanning, onExploreFleet }) => {
  return (
    <section id="hero-section" className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-14 overflow-hidden">
      {/* Ambient background gold glow & subtle grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-br from-[#D4AF37]/15 via-[#8C6D1F]/8 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-[#D4AF37]/10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#222228_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Simple Eyebrow Badge */}
        <div 
          id="hero-eyebrow-badge"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111116]/90 border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.2)] mb-6"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          <span className="text-xs uppercase tracking-[0.2em] font-mono-tech text-[#F3E5AB]">
            Real-Time Travel Booking System
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
        </div>

        {/* Cinematic Headline */}
        <h1 
          id="hero-main-title"
          className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]"
        >
          PLAN YOUR TRIP & BOOK <br className="hidden sm:block" />
          <span className="gold-gradient-text">
            COMFORTABLE CARS & HOTELS
          </span>
        </h1>

        {/* Subtitle in Simple English */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-zinc-400 font-light mb-9 leading-relaxed">
          Calculate real road distances, pick your favorite car (Sedans, SUVs, Luxury cars), 
          choose hotel stays, add verified highway food stops, and confirm your booking instantly.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <button
            onClick={onStartPlanning}
            id="hero-cta-start-btn"
            className="w-full sm:w-auto px-8 py-4 rounded-xl gold-gradient-bg text-black font-bold text-sm tracking-wider uppercase font-mono-tech flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(212,175,55,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group cursor-pointer"
          >
            <span>Start Step-by-Step Booking</span>
            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreFleet}
            id="hero-cta-explore-btn"
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#111115]/90 hover:bg-[#1A1A22] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#F3E5AB] font-mono-tech text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#D4AF37]" />
            <span>View Available Cars</span>
          </button>
        </div>

        {/* 4 Value Pillars in Simple English */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl pt-8 border-t border-[#D4AF37]/15">
          <div className="p-4 rounded-xl bg-[#0D0D11]/70 border border-[#D4AF37]/15 text-left">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[10px] uppercase tracking-wider font-mono-tech text-zinc-400">Accurate Distance</span>
            </div>
            <div className="text-xl font-bold font-serif-luxury text-white">Real-Time</div>
            <div className="text-xs text-zinc-400">Kilometers & travel time</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0D11]/70 border border-[#D4AF37]/15 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Car className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[10px] uppercase tracking-wider font-mono-tech text-zinc-400">Car Fleet</span>
            </div>
            <div className="text-xl font-bold font-serif-luxury text-[#D4AF37]">Sedans & SUVs</div>
            <div className="text-xs text-zinc-400">Comfortable, clean cars</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0D11]/70 border border-[#D4AF37]/15 text-left">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[10px] uppercase tracking-wider font-mono-tech text-zinc-400">Total Price</span>
            </div>
            <div className="text-xl font-bold font-serif-luxury text-white">Starts at ₹0</div>
            <div className="text-xs text-zinc-400">Zero hidden extra charges</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0D11]/70 border border-[#D4AF37]/15 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[10px] uppercase tracking-wider font-mono-tech text-zinc-400">Token ID</span>
            </div>
            <div className="text-xl font-bold font-serif-luxury text-[#F3E5AB]">Instant Ticket</div>
            <div className="text-xs text-zinc-400">Secure booking verification</div>
          </div>
        </div>

      </div>
    </section>
  );
};
