import React from 'react';
import { Building2, Star, MapPin, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
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
    <section id="step-3-hotel" className="py-6 sm:py-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Back Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onGoBack}
            className="ui-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Back to Step 2 (Transport)</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Step 3 of 7</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight font-serif-luxury">
            Hotel Accommodation
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Do you want to stay at a hotel in <strong className="text-[#F3E5AB]">{destinationCity || 'your destination'}</strong>?
          </p>
        </div>

        {/* Decision Toggle */}
        <div className="max-w-md mx-auto mb-8 grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[#0e0e15] border border-[#D4AF37]/25 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <button
            type="button"
            onClick={() => onChooseWantsHotel(true)}
            className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              wantsHotel === true
                ? 'gold-gradient-bg text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Yes, Book Hotel
          </button>
          <button
            type="button"
            onClick={() => {
              onChooseWantsHotel(false);
              onSelectHotel(null);
            }}
            className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              wantsHotel === false
                ? 'bg-[#1e1e2d] text-[#F3E5AB] border border-[#D4AF37]/30 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            No Hotel Needed
          </button>
        </div>

        {/* YES HOTEL OPTIONS */}
        {wantsHotel === true && (
          <div className="space-y-6 animate-fade-in mb-8">
            
            {/* Nights Selector */}
            <div className="ui-card-luxury p-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto border border-[#D4AF37]/25">
              <span className="text-xs font-bold uppercase text-zinc-300">Number of Nights:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onChangeNights(num)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      hotelNights === num
                        ? 'gold-gradient-bg text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                        : 'bg-[#12121b] border border-white/10 text-zinc-300 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {num}d
                  </button>
                ))}
              </div>
            </div>

            {/* Hotels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((h) => {
                const isSelected = selectedHotel?.id === h.id;
                const imgUrl = h.image || (h as any).imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
                const nightRate = h.pricePerNight || 3500;
                const ratingVal = h.rating || h.starRating || 4.5;

                return (
                  <div
                    key={h.id}
                    onClick={() => onSelectHotel(h)}
                    className={`ui-card group relative overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer rounded-2xl ${
                      isSelected 
                        ? 'bg-[#12121e] border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.3)]' 
                        : 'bg-[#0e0e15] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:bg-[#151520] hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)]'
                    }`}
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-[#09090d]">
                      <img
                        src={imgUrl}
                        alt={h.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {isSelected && (
                        <div className="absolute top-3 right-3 px-3 py-1 gold-gradient-bg text-black text-xs font-bold rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                          <span>Selected</span>
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[#F3E5AB] border border-[#D4AF37]/30 text-[10px] font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                        <span>{h.starRating || 4} Star ({ratingVal})</span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white font-serif-luxury mb-1">{h.name}</h3>
                        <p className="text-xs text-zinc-400 mb-3 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{h.location}</span>
                        </p>
                        <p className="text-xs text-zinc-300 line-clamp-2 mb-4">{h.description || 'Luxury accommodation with modern amenities'}</p>
                      </div>

                      <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs">
                        <span className="text-zinc-400">₹{nightRate.toLocaleString('en-IN')}/night</span>
                        <span className="text-base font-bold text-[#F3E5AB] font-mono-tech">
                          {formatINR(nightRate * hotelNights)} ({hotelNights}n)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="ui-card-luxury p-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onGoBack}
            className="ui-btn-secondary"
          >
            ← Back to Step 2
          </button>

          <button
            type="button"
            id="step3-continue-btn"
            disabled={!isComplete}
            onClick={onContinue}
            className="ui-btn-primary py-3 px-6 text-sm font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
          >
            <span>Food Stops (Step 4)</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>

      </div>
    </section>
  );
};
