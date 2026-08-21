import React from 'react';
import { Utensils, Plus, Check, Trash2, Star, Clock, MapPin, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { Pitstop } from '../types';
import { PITSTOPS_DATA } from '../data/mockData';
import { formatINR } from '../utils/pricing';

interface Step3PitstopsProps {
  selectedPitstops: Pitstop[];
  onTogglePitstop: (pitstop: Pitstop) => void;
  onProceedToStep4: () => void;
}

export const Step3Pitstops: React.FC<Step3PitstopsProps> = ({
  selectedPitstops,
  onTogglePitstop,
  onProceedToStep4,
}) => {
  const isSelected = (id: string) => selectedPitstops.some((p) => p.id === id);
  const totalPitstopCost = selectedPitstops.reduce((sum, p) => sum + p.price, 0);

  return (
    <section id="step-3-pitstops" className="py-16 scroll-mt-20 border-t border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-tech text-xs uppercase tracking-widest mb-3">
            <Utensils className="w-3.5 h-3.5" />
            <span>Highway Energy Sanctuaries</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-3">
            Step 3: <span className="gold-gradient-text">The Pitstop Route</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Select your energy sanctuaries along the path. Indulge in artisanal roadside feasts, clay-tandoor roasts, and tranquil recharge lounges. (Optional)
          </p>
        </div>

        {/* Multi-Select Floating Counter Banner */}
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-[#0F0E13] border border-[#D4AF37]/30 flex items-center justify-between shadow-[0_0_20px_rgba(212,175,55,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-mono-tech font-bold">
              {selectedPitstops.length}
            </div>
            <div>
              <div className="text-xs font-mono-tech uppercase tracking-wider text-zinc-300">
                Selected Waypoint Pitstops
              </div>
              <div className="text-xs text-[#D4AF37] font-semibold">
                {selectedPitstops.length === 0
                  ? 'No pitstops chosen yet (Stops are optional)'
                  : `${selectedPitstops.length} stop(s) scheduled (+${formatINR(totalPitstopCost)})`}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onProceedToStep4}
            className="px-4 py-2 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-mono-tech uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <span>Proceed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pitstops Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {PITSTOPS_DATA.map((pitstop) => {
            const active = isSelected(pitstop.id);

            return (
              <div
                key={pitstop.id}
                id={`pitstop-card-${pitstop.id}`}
                className={`rounded-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between relative group ${
                  active ? 'glass-card-selected' : 'glass-panel glass-panel-hover'
                }`}
              >
                {/* Image Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-[#0A0A0E]">
                  <img
                    src={pitstop.image}
                    alt={pitstop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090D] via-transparent to-black/40" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-xs font-mono-tech text-[#D4AF37] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    <span>{pitstop.rating}</span>
                  </div>

                  {/* Active Selected Badge */}
                  {active && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#D4AF37] text-black text-xs font-mono-tech font-bold flex items-center gap-1 shadow-[0_0_15px_rgba(212,175,55,0.8)] animate-pulse">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>ADDED TO ROUTE</span>
                    </div>
                  )}

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#D4AF37]/40 shadow-lg">
                    <span className="text-xs text-zinc-400 mr-1 font-mono-tech">Estimate:</span>
                    <span className="font-serif-luxury font-bold text-lg text-[#F3E5AB]">
                      {formatINR(pitstop.price)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-luxury text-lg font-bold text-white group-hover:text-[#F3E5AB] transition-colors mb-1">
                      {pitstop.name}
                    </h3>

                    <div className="text-xs text-[#D4AF37] font-mono-tech mb-2">
                      🍽️ {pitstop.cuisine}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono-tech mb-3">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{pitstop.location}</span>
                    </div>

                    <p className="text-xs text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
                      {pitstop.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] font-mono-tech text-zinc-400 mb-4 pb-3 border-b border-zinc-800">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      <span>Recommended Stop: {pitstop.estimatedStopover}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {pitstop.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-[#121216] text-zinc-300 border border-zinc-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    id={`toggle-pitstop-${pitstop.id}`}
                    onClick={() => onTogglePitstop(pitstop)}
                    className={`w-full py-3 px-4 rounded-xl font-mono-tech text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                      active
                        ? 'bg-[#2A1717] hover:bg-[#3D1E1E] text-rose-300 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                        : 'bg-[#15151C] hover:bg-[#1E1E28] text-[#F3E5AB] border border-[#D4AF37]/30 hover:border-[#D4AF37]'
                    }`}
                  >
                    {active ? (
                      <>
                        <Trash2 className="w-4 h-4 text-rose-400" />
                        <span>Remove From Route (-{formatINR(pitstop.price)})</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-[#D4AF37]" />
                        <span>Add Pitstop (+{formatINR(pitstop.price)})</span>
                      </>
                    )}
                  </button>

                </div>
              </div>
            );
          })}
        </div>

        {/* Step 4 Next Action */}
        <div className="flex justify-center">
          <button
            type="button"
            id="proceed-to-sanctuary-btn"
            onClick={onProceedToStep4}
            className="px-8 py-4 rounded-xl gold-gradient-bg text-black font-mono-tech text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.65)] hover:scale-[1.02] transition-all"
          >
            <span>Proceed to Sanctuary Stays (Step 4)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
