import React from 'react';
import { Building2, Star, CheckCircle2, ShieldCheck, Phone, ArrowRight, Sparkles, MapPin, Hotel } from 'lucide-react';
import { motion } from 'motion/react';
import { SanctuaryHotel } from '../types';
import { SANCTUARIES_DATA } from '../data/mockData';

interface StepSanctuaryProps {
  selectedSanctuary: SanctuaryHotel | null;
  onSelectSanctuary: (hotel: SanctuaryHotel) => void;
  onContinue: () => void;
}

export const StepSanctuary: React.FC<StepSanctuaryProps> = ({
  selectedSanctuary,
  onSelectSanctuary,
  onContinue,
}) => {
  return (
    <section
      id="sanctuary"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative scroll-mt-20"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Hotel className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 4 • Handpicked 5-Star Luxury Stays</span>
        </div>
        <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-zinc-100 uppercase tracking-tight">
          Select Your <span className="text-amber-400">Luxury Hotel</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
          Curated 5-star hotels, beachfront villas, and luxury resorts with guaranteed best room rates, complimentary breakfast, spa credits, and flexible check-in.
        </p>
      </div>

      {/* Sanctuaries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {SANCTUARIES_DATA.map((sanctuary) => {
          const isSelected = selectedSanctuary?.id === sanctuary.id;

          return (
            <motion.div
              key={sanctuary.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl bg-[#0b0b12] border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl text-left ${
                isSelected
                  ? 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-[0_0_35px_rgba(52,211,153,0.25)]'
                  : 'border-amber-500/20 hover:border-amber-400/50'
              }`}
            >
              {/* Hotel Image Container */}
              <div className="relative h-64 w-full overflow-hidden bg-zinc-950">
                <img
                  src={sanctuary.image}
                  alt={sanctuary.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-transparent to-black/40" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  {sanctuary.architectVerified && (
                    <div className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-md shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>VERIFIED 5-STAR</span>
                    </div>
                  )}

                  <div className="px-2.5 py-1 rounded-md bg-red-950/70 border border-red-500/40 text-red-300 text-[10px] font-semibold backdrop-blur-md">
                    {sanctuary.availability}
                  </div>
                </div>

                {/* Selected Status Overlay */}
                {isSelected && (
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-emerald-500 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>HOTEL SELECTED</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Star Rating & Location */}
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(sanctuary.starRating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="ml-1 text-zinc-200 font-semibold">5.0 Star Luxury</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-100 leading-snug">
                    {sanctuary.name}
                  </h3>

                  <div className="text-xs text-amber-400/90 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{sanctuary.location}</span>
                  </div>

                  <div className="mt-3 p-2.5 rounded-lg bg-zinc-900/70 border border-zinc-800 text-xs text-zinc-300">
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Room Category</span>
                    <span className="text-amber-300 font-medium">{sanctuary.suiteType}</span>
                  </div>

                  <p className="text-xs text-zinc-400 mt-3 line-clamp-3 leading-relaxed">
                    {sanctuary.description}
                  </p>

                  {/* Amenities */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {sanctuary.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-zinc-900/80 border border-zinc-800 text-[10px] text-zinc-300"
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Contact Line */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>{sanctuary.contact}</span>
                  </div>
                </div>

                {/* Price & Selection */}
                <div className="pt-5 mt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-2xl font-bold text-amber-300">
                      ${sanctuary.pricePerNight.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Per Night • Breakfast Included
                    </div>
                  </div>

                  <button
                    id={`select-sanctuary-${sanctuary.id}`}
                    type="button"
                    onClick={() => onSelectSanctuary(sanctuary)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                        : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md'
                    }`}
                  >
                    {isSelected ? 'Selected ✓' : 'Select Hotel'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Advance Bar */}
      {selectedSanctuary && (
        <div className="mt-12 p-5 rounded-2xl bg-[#0c0c14] border border-emerald-500/40 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto shadow-[0_0_30px_rgba(52,211,153,0.15)]">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                Step 4 Complete • Hotel Selected
              </div>
              <div className="text-sm font-semibold text-zinc-100">
                {selectedSanctuary.name} • {selectedSanctuary.suiteType} (${selectedSanctuary.pricePerNight.toLocaleString()}/night)
              </div>
            </div>
          </div>

          <button
            id="advance-sanctuary-btn"
            type="button"
            onClick={onContinue}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs tracking-wider uppercase shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Continue to Route Map & Weather</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </section>
  );
};
