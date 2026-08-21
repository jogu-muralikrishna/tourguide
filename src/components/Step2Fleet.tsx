import React from 'react';
import { Car, Users, Briefcase, Clock, Gauge, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Vehicle } from '../types';
import { formatINR } from '../utils/pricing';

interface Step2FleetProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  fromLocation: string;
  toLocation: string;
  distanceKm: number;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onContinue: () => void;
  onGoBack: () => void;
}

export const Step2Fleet: React.FC<Step2FleetProps> = ({
  vehicles,
  selectedVehicle,
  fromLocation,
  toLocation,
  distanceKm,
  onSelectVehicle,
  onContinue,
  onGoBack,
}) => {
  return (
    <section id="step-2-fleet" className="py-12 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-tech text-xs uppercase tracking-wider mb-2">
            <Car className="w-3.5 h-3.5" />
            <span>Step 2 of 7</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-2">
            Step 2: <span className="gold-gradient-text">Choose Your Car</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Select a verified car for your journey from <span className="text-white font-semibold">{fromLocation}</span> to{' '}
            <span className="text-white font-semibold">{toLocation}</span> ({distanceKm} km).
          </p>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {vehicles.map((car) => {
            const isSelected = selectedVehicle?.id === car.id;

            return (
              <div
                key={car.id}
                id={`vehicle-card-${car.id}`}
                onClick={() => onSelectVehicle(car)}
                className={`group relative rounded-2xl overflow-hidden bg-[#0D0D12] border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.35)] scale-[1.02]'
                    : 'border-zinc-800 hover:border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.8)]'
                }`}
              >
                {/* Top Image & Badge */}
                <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-transparent to-black/40" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-[#09090D]/90 border border-[#D4AF37]/40 text-[#F3E5AB] text-[10px] font-bold font-mono-tech tracking-wider uppercase">
                      {car.carType}
                    </span>
                  </div>

                  {car.tag && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold font-mono-tech uppercase">
                        {car.tag}
                      </span>
                    </div>
                  )}

                  {/* Selected Indicator Checkmark */}
                  {isSelected && (
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.8)] animate-fade-in">
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  )}
                </div>

                {/* Car Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-serif-luxury text-white mb-2 group-hover:text-[#F3E5AB] transition-colors">
                      {car.name}
                    </h3>

                    {/* Capacity & Travel Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-mono-tech text-zinc-300">
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-900/80 border border-zinc-800">
                        <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{car.seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-900/80 border border-zinc-800">
                        <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="truncate">{car.luggage}</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-900/80 border border-zinc-800">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{car.travelTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-900/80 border border-zinc-800">
                        <Gauge className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{distanceKm} km</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-1 mb-4">
                      {car.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-zinc-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Selection Button */}
                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-mono-tech text-zinc-400">Total Travel Cost</div>
                      <div className="text-2xl font-bold font-serif-luxury text-[#D4AF37]">
                        {formatINR(car.price)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVehicle(car);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-mono-tech uppercase font-bold tracking-wider transition-all cursor-pointer ${
                        isSelected
                          ? 'gold-gradient-bg text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select Car'}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Step Completion & Action Bar */}
        <div className="glass-panel p-5 rounded-2xl border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onGoBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono-tech uppercase tracking-wider cursor-pointer"
          >
            ← Back to Step 1: Locations
          </button>

          {selectedVehicle ? (
            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              <div className="hidden md:flex items-center gap-2 text-emerald-400 text-xs font-mono-tech font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Step 2 completed: {selectedVehicle.name}</span>
              </div>
              <button
                type="button"
                id="step-2-next-btn"
                onClick={onContinue}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono-tech uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 gold-gradient-bg text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02] cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-xs font-mono-tech text-amber-400">
              Please click on a car above to select it
            </span>
          )}
        </div>

      </div>
    </section>
  );
};
