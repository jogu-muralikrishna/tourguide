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
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Step 1 (Locations)</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Car className="w-3.5 h-3.5" />
            <span>Step 2 of 7</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
            Choose Your Transport
          </h2>
          <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-xl mx-auto">
            Select a vehicle for your route from <strong className="text-[var(--text-primary)]">{fromLocation}</strong> to{' '}
            <strong className="text-[var(--text-primary)]">{toLocation}</strong> ({distanceKm} km).
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
                className={`ui-card group relative overflow-hidden transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected ? 'ui-card-selected' : 'ui-card-hover'
                }`}
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-[var(--bg-surface-elevated)]">
                  <img
                    src={imgUrl}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {isSelected && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-sky-500 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selected</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-semibold">
                    {car.category || car.carType || 'Car'}
                  </div>
                </div>

                {/* Specs */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">{car.name}</h3>
                      <div className="text-xs font-bold text-sky-600 dark:text-sky-400">
                        ₹{pricePerKm}/km
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mb-4 line-clamp-2">{car.subtitle || car.carType || 'Comfortable air-conditioned highway car'}</p>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-[var(--border-color)] text-xs">
                      <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <Users className="w-3.5 h-3.5 text-sky-500" />
                        <span>{car.seats || 4} Seats</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <Briefcase className="w-3.5 h-3.5 text-sky-500" />
                        <span>{car.luggage || '3 Bags'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <Gauge className="w-3.5 h-3.5 text-sky-500" />
                        <span>{car.specs?.fuelType || 'Petrol'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">Car Fare ({distanceKm} km):</span>
                    <span className="text-base font-bold text-sky-600 dark:text-sky-400">
                      {formatINR(car.price)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="ui-card p-4 flex items-center justify-between gap-4">
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
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
