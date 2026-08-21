import React from 'react';
import { Utensils, Clock, MapPin, Plus, Check, Star, ArrowRight, Sparkles, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Pitstop } from '../types';
import { PITSTOPS_DATA } from '../data/mockData';

interface StepPitstopsProps {
  selectedPitstops: Pitstop[];
  onTogglePitstop: (pitstop: Pitstop) => void;
  onContinue: () => void;
}

export const StepPitstops: React.FC<StepPitstopsProps> = ({
  selectedPitstops,
  onTogglePitstop,
  onContinue,
}) => {
  const isPitstopSelected = (id: string) => selectedPitstops.some((p) => p.id === id);
  const pitstopsSubtotal = selectedPitstops.reduce((sum, p) => sum + p.price, 0);

  return (
    <section
      id="pitstops"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative scroll-mt-20"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Coffee className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 3 • Scenic Stops & Fine Dining</span>
        </div>
        <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-zinc-100 uppercase tracking-tight">
          Curated <span className="text-amber-400">Scenic Stops</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
          Add memorable stops along your journey: renowned restaurants, scenic lookouts, heritage sites, and artisan lounges. Choose one or more stops to include in your trip.
        </p>
      </div>

      {/* Pitstops Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PITSTOPS_DATA.map((pitstop) => {
          const selected = isPitstopSelected(pitstop.id);

          return (
            <motion.div
              key={pitstop.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl bg-[#0a0a10] border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl text-left relative ${
                selected
                  ? 'border-amber-400 ring-1 ring-amber-400/50 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                  : 'border-zinc-800/80 hover:border-amber-500/40'
              }`}
            >
              {/* Card Image */}
              <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
                <img
                  src={pitstop.image}
                  alt={pitstop.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] via-transparent to-black/40" />

                {/* Category & Duration */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-black/70 border border-amber-500/30 text-amber-300 backdrop-blur-sm">
                    {pitstop.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900/80 border border-zinc-700 text-zinc-300 flex items-center gap-1 backdrop-blur-sm">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {pitstop.duration}
                  </span>
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-3 left-3 text-[11px] text-amber-300/90 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{pitstop.location}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-zinc-100 leading-snug">
                      {pitstop.name}
                    </h3>
                  </div>

                  <p className="text-xs text-amber-400 font-medium mt-1">
                    {pitstop.cuisineOrType}
                  </p>

                  <p className="text-xs text-zinc-400 mt-2.5 line-clamp-2 leading-relaxed">
                    {pitstop.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {pitstop.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & Toggle Button */}
                <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-lg font-bold text-amber-300">
                      ${pitstop.price}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Per Person
                    </div>
                  </div>

                  <button
                    id={`toggle-pitstop-${pitstop.id}`}
                    type="button"
                    onClick={() => onTogglePitstop(pitstop)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                      selected
                        ? 'bg-amber-400 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                        : 'bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-amber-300 hover:border-amber-400'
                    }`}
                  >
                    {selected ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Added ✓</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Trip</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Pitstops Summary Bar & Continue */}
      <div className="mt-12 p-5 rounded-2xl bg-[#0c0c14] border border-amber-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto shadow-xl">
        <div className="text-left">
          <div className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {selectedPitstops.length} Scenic Stop{selectedPitstops.length === 1 ? '' : 's'} Selected
            </span>
          </div>
          <div className="text-sm text-zinc-300 mt-0.5">
            {selectedPitstops.length === 0
              ? 'Optional: You can add stops now or skip to hotel selection.'
              : `Total Stops Cost: $${pitstopsSubtotal.toLocaleString()}`}
          </div>
        </div>

        <button
          id="advance-pitstops-btn"
          type="button"
          onClick={onContinue}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs tracking-wider uppercase shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Continue to Luxury Stays</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
