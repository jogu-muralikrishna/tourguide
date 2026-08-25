import React from 'react';
import { Building2, Star, Phone, Check, ArrowRight, Bed, MapPin, CheckCircle2 } from 'lucide-react';
import { Hotel } from '../types';
import { formatINR } from '../utils/pricing';

interface Step3HotelProps {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  hotelNights: number;
  wantsHotel: boolean | null;
  destinationCity: string;
  onChooseWantsHotel: (choice: boolean) => void;
  onSelectHotel: (hotel: Hotel | null) => void;
  onChangeNights: (nights: number) => void;
  onContinue: () => void;
  onGoBack: () => void;
}

export const Step3Hotel: React.FC<Step3HotelProps> = ({
  hotels,
  selectedHotel,
  hotelNights,
  wantsHotel,
  destinationCity,
  onChooseWantsHotel,
  onSelectHotel,
  onChangeNights,
  onContinue,
  onGoBack,
}) => {
  const isComplete = wantsHotel === false || (wantsHotel === true && selectedHotel !== null);

  return (
    <section id="step-3-hotel" className="py-8 sm:py-12 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Step 3 of 7</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
            Hotel Accommodation
          </h2>
          <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-xl mx-auto">
            Do you want to stay at a hotel in <strong className="text-[var(--text-primary)]">{destinationCity || 'your destination'}</strong>?
          </p>
        </div>

        {/* YES / NO Choice Card */}
        <div className="ui-card p-6 sm:p-8 mb-8 text-center max-w-xl mx-auto">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
            Book accommodation in {destinationCity}?
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              id="hotel-choice-yes-btn"
              onClick={() => {
                onChooseWantsHotel(true);
                if (!selectedHotel && hotels.length > 0) {
                  onSelectHotel(hotels[0]);
                }
              }}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                wantsHotel === true
                  ? 'bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 font-bold shadow-xs'
                  : 'bg-[var(--bg-surface-elevated)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-sky-500/30'
              }`}
            >
              <div className="text-2xl">🏨</div>
              <div className="text-sm font-bold">YES, Book Hotel</div>
              <div className="text-[11px] text-[var(--text-muted)]">Browse destination hotels</div>
            </button>

            <button
              type="button"
              id="hotel-choice-no-btn"
              onClick={() => {
                onChooseWantsHotel(false);
                onSelectHotel(null);
              }}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                wantsHotel === false
                  ? 'bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 font-bold shadow-xs'
                  : 'bg-[var(--bg-surface-elevated)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-sky-500/30'
              }`}
            >
              <div className="text-2xl">🚗</div>
              <div className="text-sm font-bold">NO Hotel Needed</div>
              <div className="text-[11px] text-[var(--text-muted)]">Day trip / transit only (₹0)</div>
            </button>
          </div>
        </div>

        {/* Hotel Catalog */}
        {wantsHotel === true && (
          <div className="space-y-6 animate-fade-in mb-8">
            {/* Nights Selector */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-sky-500" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Number of Nights:
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onChangeNights(n)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      hotelNights === n
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-sky-500/50'
                    }`}
                  >
                    {n}N
                  </button>
                ))}
              </div>
            </div>

            {/* Hotel Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => {
                const isSelected = selectedHotel?.id === hotel.id;
                const totalStayCost = hotel.pricePerNight * hotelNights;

                return (
                  <div
                    key={hotel.id}
                    id={`hotel-card-${hotel.id}`}
                    onClick={() => onSelectHotel(hotel)}
                    className={`ui-card group relative overflow-hidden transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected ? 'ui-card-selected' : 'ui-card-hover'
                    }`}
                  >
                    {/* Hotel Image & Rating */}
                    <div className="relative h-44 w-full overflow-hidden bg-[var(--bg-surface-elevated)]">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-400 text-xs font-semibold backdrop-blur-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{hotel.rating}</span>
                      </div>

                      {isSelected && (
                        <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      )}
                    </div>

                    {/* Hotel Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                          {hotel.name}
                        </h3>

                        <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] mb-3">
                          <MapPin className="w-3.5 h-3.5 text-sky-500" />
                          <span>{hotel.location}</span>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[10px] text-[var(--text-secondary)] font-medium"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pricing Bottom */}
                      <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">
                            {formatINR(hotel.pricePerNight)} / night
                          </div>
                          <div className="text-lg font-bold text-sky-600 dark:text-sky-400">
                            {formatINR(totalStayCost)} <span className="text-xs text-[var(--text-muted)] font-normal">({hotelNights}N)</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectHotel(hotel);
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
          </div>
        )}

        {/* Action Bar */}
        <div className="ui-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onGoBack}
            className="ui-btn-secondary w-full sm:w-auto"
          >
            ← Back to Step 2
          </button>

          {isComplete ? (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="hidden md:flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {wantsHotel ? `Selected: ${selectedHotel?.name}` : 'No hotel selected'}
                </span>
              </div>
              <button
                type="button"
                id="step-3-next-btn"
                onClick={onContinue}
                className="ui-btn-primary w-full sm:w-auto"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-xs text-amber-500 font-medium">
              Please choose YES or NO for hotel booking
            </span>
          )}
        </div>

      </div>
    </section>
  );
};
