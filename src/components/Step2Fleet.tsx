import React from 'react';
import { Car, Users, Briefcase, Clock, Gauge, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
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
    <section id="step-2-fleet" className="py-6 sm:py-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Back Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onGoBack}
            className="ui-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Back to Step 1 (Locations)</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Car className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Step 2 of 7</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight font-serif-luxury">
            Choose Your Transport
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Select a car for your trip from <strong className="text-[#F3E5AB]">{fromLocation}</strong> to{' '}
            <strong className="text-[#F3E5AB]">{toLocation}</strong> ({distanceKm} km).
          </p>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {vehicles.map((car) => {
            const isSelected = selectedVehicle?.id === car.id;
            const imgUrl = car.image || (car as any).imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
            const pricePerKm = Math.round(car.price / Math.max(1, distanceKm)) || 14;

            return (
              <div
                key={car.id}
                id={`vehicle-card-${car.id}`}
                onClick={() => onSelectVehicle(car)}
                className={`ui-card group relative overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer rounded-2xl ${
                  isSelected 
                    ? 'bg-[#12121e] border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.3)]' 
                    : 'bg-[#0e0e15] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:bg-[#151520] hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)]'
                }`}
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-[#09090d]">
                  <img
                    src={imgUrl}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {isSelected && (
                    <div className="absolute top-3 right-3 px-3 py-1 gold-gradient-bg text-black text-xs font-bold rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                      <span>Selected</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[#F3E5AB] border border-[#D4AF37]/30 text-[10px] uppercase tracking-wider font-semibold font-mono-tech">
                    {car.category || car.carType || 'Car'}
                  </div>
                </div>

                {/* Specs */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white font-serif-luxury">{car.name}</h3>
                      <div className="text-xs font-bold text-[#F3E5AB] font-mono-tech">
                        ₹{pricePerKm}/km
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mb-4 line-clamp-2">{car.subtitle || car.carType || 'Comfortable air-conditioned highway car'}</p>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#D4AF37]/20 text-xs">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{car.seats || 4} Seats</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{car.luggage || '3 Bags'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <Gauge className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{car.specs?.fuelType || 'Petrol'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 flex items-center justify-between text-xs border-t border-[#D4AF37]/15">
                    <span className="text-zinc-400">Total Car Fare ({distanceKm} km):</span>
                    <span className="text-base font-bold text-[#F3E5AB] font-mono-tech">
                      {formatINR(car.price)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="ui-card-luxury p-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onGoBack}
            className="ui-btn-secondary"
          >
            ← Back to Step 1
          </button>

          <button
            type="button"
            id="step2-continue-btn"
            disabled={!selectedVehicle}
            onClick={onContinue}
            className="ui-btn-primary py-3 px-6 text-sm font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
          >
            <span>Hotel Stay (Step 3)</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>

      </div>
    </section>
  );
};
