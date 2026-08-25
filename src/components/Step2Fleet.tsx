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
    <section id="step-2-fleet" className="py-8 sm:py-12 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Car className="w-3.5 h-3.5" />
            <span>Step 2 of 7</span>
          </div>
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
                <div className="relative h-44 w-full overflow-hidden bg-[var(--bg-surface-elevated)]">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Category Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)]/90 backdrop-blur-xs text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-wider border border-[var(--border-color)]">
                      {car.carType}
                    </span>
                  </div>

                  {car.tag && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-full bg-sky-500 text-white text-[9px] font-bold uppercase">
                        {car.tag}
                      </span>
                    </div>
                  )}

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">
                      {car.name}
                    </h3>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                        <Users className="w-3.5 h-3.5 text-sky-500" />
                        <span>{car.seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                        <Briefcase className="w-3.5 h-3.5 text-sky-500" />
                        <span className="truncate">{car.luggage}</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                        <Clock className="w-3.5 h-3.5 text-sky-500" />
                        <span>{car.travelTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                        <Gauge className="w-3.5 h-3.5 text-sky-500" />
                        <span>{distanceKm} km</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-1 mb-4">
                      {car.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">Travel Cost</div>
                      <div className="text-xl font-bold text-sky-600 dark:text-sky-400">
                        {formatINR(car.price)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVehicle(car);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500 text-white font-bold'
                          : 'ui-btn-secondary'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="ui-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onGoBack}
            className="ui-btn-secondary w-full sm:w-auto"
          >
            ← Back to Step 1
          </button>

          {selectedVehicle ? (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="hidden md:flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Selected: {selectedVehicle.name}</span>
              </div>
              <button
                type="button"
                id="step-2-next-btn"
                onClick={onContinue}
                className="ui-btn-primary w-full sm:w-auto"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-xs text-amber-500 font-medium">
              Please select a transport option above
            </span>
          )}
        </div>

      </div>
    </section>
  );
};
