import React, { useState } from 'react';
import { Shield, Users, Gauge, Zap, CheckCircle2, RotateCw, Star, Award, ShieldCheck, ArrowRight, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Vehicle, VehicleCategory } from '../types';
import { VEHICLES_DATA } from '../data/mockData';

interface StepChariotProps {
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onContinue: () => void;
}

export const StepChariot: React.FC<StepChariotProps> = ({
  selectedVehicle,
  onSelectVehicle,
  onContinue,
}) => {
  const [activeCategory, setActiveCategory] = useState<VehicleCategory>('cars');
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFlippedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredVehicles = VEHICLES_DATA.filter((v) => v.category === activeCategory);

  return (
    <section
      id="chariot"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative scroll-mt-20"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Car className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 2 • Luxury Fleet & Private Chauffeurs</span>
        </div>
        <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-zinc-100 uppercase tracking-tight">
          Select Your <span className="text-amber-400">Transport</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
          Choose from our certified fleet of luxury sedans, executive SUVs, and VIP group shuttles. Every ride is driven by a professional, background-verified private chauffeur.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-xl backdrop-blur-md">
          <button
            id="tab-cars-btn"
            onClick={() => setActiveCategory('cars')}
            className={`px-5 sm:px-7 py-2.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
              activeCategory === 'cars'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            Luxury Sedans & SUVs
          </button>
          <button
            id="tab-trains-btn"
            onClick={() => setActiveCategory('trains')}
            className={`px-5 sm:px-7 py-2.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
              activeCategory === 'trains'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            First-Class Rail Suites
          </button>
          <button
            id="tab-buses-btn"
            onClick={() => setActiveCategory('buses')}
            className={`px-5 sm:px-7 py-2.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
              activeCategory === 'buses'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            VIP Shuttles & Coaches
          </button>
        </div>
      </div>

      {/* 3D Flip Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVehicles.map((vehicle) => {
          const isSelected = selectedVehicle?.id === vehicle.id;
          const isFlipped = !!flippedCardIds[vehicle.id];

          return (
            <div
              key={vehicle.id}
              className="perspective-1000 min-h-[580px] w-full"
            >
              <motion.div
                className={`relative w-full h-full transform-style-3d transition-transform duration-700 ease-in-out ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT FACE (Vehicle Specs) */}
                <div
                  className={`absolute inset-0 backface-hidden rounded-2xl bg-[#0b0b12] border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl ${
                    isSelected
                      ? 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-[0_0_30px_rgba(52,211,153,0.2)]'
                      : 'border-amber-500/20 hover:border-amber-400/50'
                  }`}
                >
                  {/* Top Image Banner */}
                  <div className="relative h-56 w-full overflow-hidden bg-zinc-950">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-transparent to-black/40" />

                    {/* Category Label & Flip Button */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-[10px] tracking-wider uppercase font-bold bg-black/70 border border-amber-500/30 text-amber-300 backdrop-blur-md">
                        {vehicle.categoryLabel}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => toggleFlip(vehicle.id, e)}
                        className="px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/40 text-amber-300 text-xs flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer"
                        title="Flip to view Chauffeur Profile"
                      >
                        <span>Chauffeur Bio</span>
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-emerald-500 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>SELECTED VEHICLE</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg sm:text-xl font-bold text-zinc-100 leading-snug">
                          {vehicle.name}
                        </h3>
                      </div>
                      <p className="text-xs text-amber-400/80 font-medium mt-1">
                        {vehicle.subtitle}
                      </p>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs">
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Users className="w-3.5 h-3.5 text-amber-400" />
                          <span>{vehicle.specs.passengers} Guests</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Gauge className="w-3.5 h-3.5 text-amber-400" />
                          <span>{vehicle.specs.topSpeed}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span className="truncate">{vehicle.specs.luxuryClass}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>{vehicle.specs.range}</span>
                        </div>
                      </div>

                      {/* Rating & Chauffeur Preview */}
                      <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-zinc-200">{vehicle.rating}</span>
                          <span>({vehicle.reviewsCount} trips)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={vehicle.driver.avatar}
                            alt={vehicle.driver.name}
                            className="w-5 h-5 rounded-full border border-amber-400/50 object-cover"
                          />
                          <span className="text-amber-300 text-[11px] truncate max-w-[120px]">
                            {vehicle.driver.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Selection CTA */}
                    <div className="pt-5 mt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-amber-300">
                          ${vehicle.price.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {vehicle.priceUnit}
                        </div>
                      </div>

                      <button
                        id={`select-chariot-${vehicle.id}`}
                        type="button"
                        onClick={() => onSelectVehicle(vehicle)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                            : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md'
                        }`}
                      >
                        {isSelected ? 'Selected ✓' : 'Select Vehicle'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* BACK FACE (Chauffeur Profile) */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-[#0d0d16] border p-6 text-left flex flex-col justify-between overflow-y-auto shadow-2xl ${
                    isSelected
                      ? 'border-emerald-400 ring-2 ring-emerald-400/30'
                      : 'border-amber-500/30'
                  }`}
                >
                  {/* Top Bar of Back */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold bg-amber-950/60 border border-amber-500/40 text-amber-300">
                        {vehicle.driver.clearanceLevel}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => toggleFlip(vehicle.id, e)}
                        className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1 cursor-pointer"
                        title="Flip back to Vehicle Specs"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Vehicle Specs</span>
                      </button>
                    </div>

                    {/* Driver Avatar & Name */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <img
                          src={vehicle.driver.avatar}
                          alt={vehicle.driver.name}
                          className="w-16 h-16 rounded-full border-2 border-amber-400 object-cover shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-full text-zinc-950">
                          <Award className="w-3 h-3" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-zinc-100">
                          {vehicle.driver.name}
                        </h4>
                        <p className="text-xs text-amber-400">
                          {vehicle.driver.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                          <div className="flex items-center text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span className="ml-1 font-bold text-zinc-200">{vehicle.driver.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{vehicle.driver.tripsCount} Completed Trips</span>
                        </div>
                      </div>
                    </div>

                    {/* Experience & Badges */}
                    <div className="space-y-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                        <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                          Experience & Certification
                        </span>
                        <span className="text-zinc-200 font-medium">
                          {vehicle.driver.experience}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                        <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                          Languages Spoken
                        </span>
                        <span className="text-zinc-200 font-medium">
                          {vehicle.driver.languages.join(' • ')}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                          Certifications
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {vehicle.driver.badges.map((b, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px]"
                            >
                              ★ {b}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-zinc-400 text-xs italic leading-relaxed pt-1">
                        "{vehicle.driver.bio}"
                      </p>
                    </div>
                  </div>

                  {/* Back CTA Button */}
                  <div className="pt-4 mt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => onSelectVehicle(vehicle)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-zinc-950'
                          : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md'
                      }`}
                    >
                      {isSelected ? 'Chauffeur & Vehicle Assigned ✓' : `Select ${vehicle.name.split(' ')[0]}`}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Bottom Advance Bar */}
      {selectedVehicle && (
        <div className="mt-12 p-5 rounded-2xl bg-[#0c0c14] border border-emerald-500/40 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto shadow-[0_0_30px_rgba(52,211,153,0.15)]">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                Step 2 Complete • Transport Selected
              </div>
              <div className="text-sm font-semibold text-zinc-100">
                {selectedVehicle.name} • Private Chauffeur: {selectedVehicle.driver.name} (${selectedVehicle.price})
              </div>
            </div>
          </div>

          <button
            id="advance-chariot-btn"
            type="button"
            onClick={onContinue}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs tracking-wider uppercase shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Continue to Scenic Stops</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </section>
  );
};
