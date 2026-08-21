import React from 'react';
import { Building2, Star, Phone, Check, ArrowRight, Bed, MapPin, CheckCircle2 } from 'lucide-react';
import { Hotel } from '../types';
import { formatINR } from '../utils/pricing';

interface Step3HotelProps {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  hotelNights: number;
  wantsHotel: boolean | null; // null = unchosen, true = yes, false = no
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
    <section id="step-3-hotel" className="py-12 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-tech text-xs uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Step 3 of 7</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-2">
            Step 3: <span className="gold-gradient-text">Hotel Stay</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Do you want to stay at a hotel in <span className="text-white font-semibold">{destinationCity || 'your destination'}</span>?
          </p>
        </div>

        {/* Big YES / NO Decision Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-8 border border-[#D4AF37]/30 text-center max-w-2xl mx-auto shadow-[0_0_30px_rgba(0,0,0,0.7)]">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 font-serif-luxury">
            Do you want to book a hotel in {destinationCity}?
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
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                wantsHotel === true
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.4)] text-white scale-[1.02]'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-600'
              }`}
            >
              <div className="text-2xl">🏨</div>
              <div className="text-base font-bold font-serif-luxury">YES, Book Hotel</div>
              <div className="text-xs text-zinc-400 font-mono-tech">Select destination hotel</div>
            </button>

            <button
              type="button"
              id="hotel-choice-no-btn"
              onClick={() => {
                onChooseWantsHotel(false);
                onSelectHotel(null);
              }}
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                wantsHotel === false
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.4)] text-white scale-[1.02]'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-600'
              }`}
            >
              <div className="text-2xl">🚗</div>
              <div className="text-base font-bold font-serif-luxury">NO Hotel Needed</div>
              <div className="text-xs text-zinc-400 font-mono-tech">Transit & ride only (₹0)</div>
            </button>
          </div>
        </div>

        {/* If YES: Show Hotel Catalog & Nights Selection */}
        {wantsHotel === true && (
          <div className="space-y-6 animate-fade-in mb-8">
            {/* Nights Selector */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0F0F14] border border-zinc-800">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-sm font-semibold text-white font-serif-luxury">
                  Number of Nights:
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onChangeNights(n)}
                    className={`w-10 h-10 rounded-xl font-mono-tech text-xs font-bold transition-all cursor-pointer ${
                      hotelNights === n
                        ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.6)]'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-white'
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
                    className={`group relative rounded-2xl overflow-hidden bg-[#0D0D12] border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.35)] scale-[1.02]'
                        : 'border-zinc-800 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {/* Hotel Image & Rating */}
                    <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-transparent to-black/40" />

                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 text-amber-400 text-xs font-mono-tech border border-zinc-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{hotel.rating}</span>
                      </div>

                      {isSelected && (
                        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.8)] animate-fade-in">
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </div>
                      )}
                    </div>

                    {/* Hotel Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold font-serif-luxury text-white mb-1 group-hover:text-[#F3E5AB] transition-colors">
                          {hotel.name}
                        </h3>

                        <div className="flex items-center gap-1 text-xs text-zinc-400 mb-3">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{hotel.location}</span>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono-tech"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>

                        {/* Contact */}
                        <div className="mb-4 text-xs font-mono-tech text-zinc-400 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{hotel.contact ? `Call: ${hotel.contact}` : 'Phone number not available'}</span>
                        </div>
                      </div>

                      {/* Pricing Bottom */}
                      <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-mono-tech text-zinc-400">
                            {formatINR(hotel.pricePerNight)} / night
                          </div>
                          <div className="text-lg font-bold font-serif-luxury text-[#D4AF37]">
                            {formatINR(totalStayCost)} <span className="text-xs text-zinc-400 font-mono-tech font-normal">({hotelNights}N)</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectHotel(hotel);
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-tech uppercase font-bold tracking-wider transition-all cursor-pointer ${
                            isSelected
                              ? 'gold-gradient-bg text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
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

        {/* Step Completion & Action Bar */}
        <div className="glass-panel p-5 rounded-2xl border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onGoBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono-tech uppercase tracking-wider cursor-pointer"
          >
            ← Back to Step 2: Car
          </button>

          {isComplete ? (
            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              <div className="hidden md:flex items-center gap-2 text-emerald-400 text-xs font-mono-tech font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Step 3 completed: {wantsHotel ? `${selectedHotel?.name} (${hotelNights}N)` : 'No hotel (Transit)'}
                </span>
              </div>
              <button
                type="button"
                id="step-3-next-btn"
                onClick={onContinue}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono-tech uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 gold-gradient-bg text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02] cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-xs font-mono-tech text-amber-400">
              Please choose YES or NO for hotel booking above
            </span>
          )}
        </div>

      </div>
    </section>
  );
};
