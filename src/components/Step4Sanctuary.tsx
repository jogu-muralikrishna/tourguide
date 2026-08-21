import React from 'react';
import { Building2, Star, Calendar, Moon, Phone, Check, ArrowRight, X, Sparkles, MapPin, BedDouble } from 'lucide-react';
import { Hotel } from '../types';
import { HOTELS_DATA } from '../data/mockData';
import { formatINR } from '../utils/pricing';

interface Step4SanctuaryProps {
  selectedHotel: Hotel | null;
  hotelNights: number;
  checkInDate: string;
  checkOutDate: string;
  onSelectHotel: (hotel: Hotel | null) => void;
  onNightsChange: (nights: number) => void;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  onProceedToStep5: () => void;
}

export const Step4Sanctuary: React.FC<Step4SanctuaryProps> = ({
  selectedHotel,
  hotelNights,
  checkInDate,
  checkOutDate,
  onSelectHotel,
  onNightsChange,
  onCheckInChange,
  onCheckOutChange,
  onProceedToStep5,
}) => {
  const safeNights = Math.max(1, hotelNights);
  const hotelSubtotal = selectedHotel ? selectedHotel.pricePerNight * safeNights : 0;

  // Handle date change and auto-recalculate nights if both dates are valid
  const handleCheckIn = (newDate: string) => {
    onCheckInChange(newDate);
    if (checkOutDate && newDate) {
      const d1 = new Date(newDate);
      const d2 = new Date(checkOutDate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        onNightsChange(diffDays);
      }
    }
  };

  const handleCheckOut = (newDate: string) => {
    onCheckOutChange(newDate);
    if (checkInDate && newDate) {
      const d1 = new Date(checkInDate);
      const d2 = new Date(newDate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        onNightsChange(diffDays);
      }
    }
  };

  return (
    <section id="step-4-sanctuary" className="py-16 scroll-mt-20 border-t border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-tech text-xs uppercase tracking-widest mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Destination Residence & Stays</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-3">
            Step 4: <span className="gold-gradient-text">Sanctuary Selection</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Choose your private hotel sanctuary upon arrival, customize the duration of your stay, or proceed with transit-only.
          </p>
        </div>

        {/* Stay Duration & Dates Control Bar */}
        <div className="max-w-4xl mx-auto mb-10 p-5 rounded-2xl bg-[#0D0D12] border border-[#D4AF37]/30 shadow-[0_0_25px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            
            {/* Check-In Date */}
            <div>
              <label htmlFor="check-in-date" className="block text-xs uppercase font-mono-tech tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Check-in Date</span>
              </label>
              <input
                id="check-in-date"
                type="date"
                value={checkInDate}
                onChange={(e) => handleCheckIn(e.target.value)}
                className="w-full bg-[#14141B] text-white px-3 py-2.5 rounded-xl border border-zinc-800 focus:border-[#D4AF37] outline-none text-sm font-mono-tech"
              />
            </div>

            {/* Check-Out Date */}
            <div>
              <label htmlFor="check-out-date" className="block text-xs uppercase font-mono-tech tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Check-out Date</span>
              </label>
              <input
                id="check-out-date"
                type="date"
                value={checkOutDate}
                onChange={(e) => handleCheckOut(e.target.value)}
                className="w-full bg-[#14141B] text-white px-3 py-2.5 rounded-xl border border-zinc-800 focus:border-[#D4AF37] outline-none text-sm font-mono-tech"
              />
            </div>

            {/* Nights Stepper */}
            <div>
              <label className="block text-xs uppercase font-mono-tech tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Duration of Stay</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="decrement-nights-btn"
                  onClick={() => onNightsChange(Math.max(1, safeNights - 1))}
                  className="w-10 h-10 rounded-xl bg-[#171720] hover:bg-[#22222E] border border-zinc-800 text-white font-bold flex items-center justify-center transition-all"
                >
                  -
                </button>
                <div className="flex-1 bg-[#14141B] border border-zinc-800 py-2 rounded-xl text-center font-mono-tech font-bold text-white text-sm">
                  {safeNights} {safeNights === 1 ? 'Night' : 'Nights'}
                </div>
                <button
                  type="button"
                  id="increment-nights-btn"
                  onClick={() => onNightsChange(safeNights + 1)}
                  className="w-10 h-10 rounded-xl bg-[#171720] hover:bg-[#22222E] border border-zinc-800 text-white font-bold flex items-center justify-center transition-all"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Current Selection Live Pill */}
          <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech">
            <div className="flex items-center gap-2 text-zinc-300">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>
                Active Sanctuary:{' '}
                <strong className="text-white">
                  {selectedHotel ? selectedHotel.name : 'No hotel selected (Optional)'}
                </strong>
              </span>
            </div>

            {selectedHotel ? (
              <div className="flex items-center gap-3">
                <span className="text-[#D4AF37] font-bold">
                  {formatINR(selectedHotel.pricePerNight)} × {safeNights} N = {formatINR(hotelSubtotal)}
                </span>
                <button
                  type="button"
                  id="remove-hotel-btn"
                  onClick={() => onSelectHotel(null)}
                  className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] flex items-center gap-1 transition-all"
                >
                  <X className="w-3 h-3" />
                  <span>Remove Hotel</span>
                </button>
              </div>
            ) : (
              <span className="text-zinc-500">Stays are optional. Select a stay below or proceed.</span>
            )}
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {HOTELS_DATA.map((hotel) => {
            const isSelected = selectedHotel?.id === hotel.id;
            const currentSubtotal = hotel.pricePerNight * safeNights;

            return (
              <div
                key={hotel.id}
                id={`hotel-card-${hotel.id}`}
                className={`rounded-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between relative group ${
                  isSelected ? 'glass-card-selected' : 'glass-panel glass-panel-hover'
                }`}
              >
                {/* Hotel Image Banner */}
                <div className="relative h-52 w-full overflow-hidden bg-[#0A0A0E]">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090D] via-transparent to-black/40" />

                  {/* Badge */}
                  {hotel.badge && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono-tech font-bold uppercase tracking-wider text-[#D4AF37] border border-[#D4AF37]/50 shadow-md">
                      {hotel.badge}
                    </div>
                  )}

                  {/* Rating */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-xs font-mono-tech text-[#D4AF37] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    <span>{hotel.rating}</span>
                    <span className="text-[10px] text-zinc-400">({hotel.reviewsCount})</span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#D4AF37]/40 shadow-lg text-right">
                    <div className="text-[10px] text-zinc-400 font-mono-tech">Nightly:</div>
                    <span className="font-serif-luxury font-bold text-lg text-[#F3E5AB]">
                      {formatINR(hotel.pricePerNight)}
                    </span>
                    <span className="text-[11px] text-zinc-400">/night</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-luxury text-lg font-bold text-white group-hover:text-[#F3E5AB] transition-colors mb-1">
                      {hotel.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono-tech mb-2">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="truncate">{hotel.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-mono-tech mb-3">
                      <BedDouble className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{hotel.roomType}</span>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1.5 mb-4 pb-3 border-b border-zinc-800">
                      {hotel.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-[#121216] text-zinc-300 border border-zinc-800"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400 mb-5">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-zinc-500" />
                        <span>{hotel.contact}</span>
                      </span>
                      <span className="text-zinc-500">{hotel.distanceFromCenter}</span>
                    </div>
                  </div>

                  {/* Selection Button */}
                  <div>
                    {/* Subtotal Preview */}
                    <div className="flex items-center justify-between text-xs font-mono-tech mb-2 px-1">
                      <span className="text-zinc-400">{safeNights} Night(s) Stay:</span>
                      <span className="font-bold text-[#F3E5AB]">{formatINR(currentSubtotal)}</span>
                    </div>

                    <button
                      type="button"
                      id={`select-hotel-${hotel.id}`}
                      onClick={() => onSelectHotel(isSelected ? null : hotel)}
                      className={`w-full py-3 px-4 rounded-xl font-mono-tech text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                        isSelected
                          ? 'gold-gradient-bg text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                          : 'bg-[#16161D] hover:bg-[#20202A] text-[#F3E5AB] border border-[#D4AF37]/30 hover:border-[#D4AF37]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Sanctuary Confirmed</span>
                        </>
                      ) : (
                        <>
                          <span>Select Sanctuary ({formatINR(hotel.pricePerNight)}/N)</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Step 5 Next Action */}
        <div className="flex justify-center">
          <button
            type="button"
            id="proceed-to-map-btn"
            onClick={onProceedToStep5}
            className="px-8 py-4 rounded-xl gold-gradient-bg text-black font-mono-tech text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.65)] hover:scale-[1.02] transition-all"
          >
            <span>Proceed to Tactical Map (Step 5)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
