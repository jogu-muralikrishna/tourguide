import React from 'react';
import { ShieldCheck, Edit3, Car, Building2, Utensils, Calendar, User, ArrowRight, CheckCircle2, MapPin, Sparkles, Users, Receipt } from 'lucide-react';
import { Vehicle, Hotel, Pitstop, SelectedFoodItem, UserProfile, PricingDetails } from '../types';
import { formatINR } from '../utils/pricing';

interface Step7ReviewProps {
  fromLocation: string;
  toLocation: string;
  distanceKm: number;
  travelTime: string;
  vehicle: Vehicle | null;
  hotel: Hotel | null;
  hotelNights: number;
  pitstops: Pitstop[];
  selectedFoodItems?: SelectedFoodItem[];
  userProfile: UserProfile;
  pricing: PricingDetails;
  isConfirming: boolean;
  onNavigateToStep: (stepNumber: number) => void;
  onConfirmBooking: () => void;
  onGoBack: () => void;
}

export const Step7Review: React.FC<Step7ReviewProps> = ({
  fromLocation,
  toLocation,
  distanceKm,
  travelTime,
  vehicle,
  hotel,
  hotelNights,
  pitstops,
  selectedFoodItems = [],
  userProfile,
  pricing,
  isConfirming,
  onNavigateToStep,
  onConfirmBooking,
  onGoBack,
}) => {
  const peopleCount = Math.max(1, userProfile.numberOfPeople || userProfile.travelersCount || pricing.numberOfPeople || 1);
  const peopleLabel = peopleCount === 1 ? '1 Person' : `${peopleCount} People`;

  const carCost = pricing.carCost || pricing.vehicleCost || (vehicle ? vehicle.price : 0);
  const hotelNightsCount = hotel ? Math.max(1, hotelNights || 1) : 0;
  const hotelRate = hotel ? hotel.pricePerNight : 0;
  const hotelCost = pricing.hotelCost || (hotel ? hotelRate * hotelNightsCount : 0);
  const foodCost = pricing.foodCost || pricing.pitstopCost || 0;
  const serviceFee = pricing.serviceFee || 0;
  const tax = pricing.tax || pricing.taxesAndFees || 0;
  const finalTotal = pricing.finalTotal || pricing.total || (carCost + hotelCost + foodCost + serviceFee + tax);

  return (
    <section id="step-7-review" className="py-12 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-tech text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Step 7 of 7</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-2">
            Step 7: <span className="gold-gradient-text">Review & Confirm Your Trip</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Review your complete itemized journey breakdown before confirming. Click "Edit" on any section to make updates.
          </p>
        </div>

        {/* 2 Column Layout: Details on left, Price Summary on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Left 2 Cols: Trip Segments */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* 1. Route Segment */}
            <div className="glass-panel rounded-2xl p-5 border border-zinc-800 hover:border-[#D4AF37]/40 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-serif-luxury">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>1. Route & Highway Distance</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep(1)}
                  className="flex items-center gap-1 text-xs text-[#D4AF37] hover:text-[#F3E5AB] font-mono-tech cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono-tech">
                <div>
                  <span className="text-zinc-400 block mb-0.5">Origin:</span>
                  <span className="text-sm font-bold text-white">{fromLocation}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Destination:</span>
                  <span className="text-sm font-bold text-white">{toLocation}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Road Distance:</span>
                  <span className="text-sm font-semibold text-[#F3E5AB]">{distanceKm} km</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Drive Time:</span>
                  <span className="text-sm font-semibold text-zinc-300">{travelTime}</span>
                </div>
              </div>
            </div>

            {/* 2. Car Selection */}
            <div className="glass-panel rounded-2xl p-5 border border-zinc-800 hover:border-[#D4AF37]/40 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-serif-luxury">
                  <Car className="w-4 h-4 text-[#D4AF37]" />
                  <span>2. Selected Car</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep(2)}
                  className="flex items-center gap-1 text-xs text-[#D4AF37] hover:text-[#F3E5AB] font-mono-tech cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              {vehicle ? (
                <div className="flex items-center justify-between text-xs font-mono-tech">
                  <div className="flex items-center gap-3">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-16 h-12 object-cover rounded-lg border border-zinc-700"
                    />
                    <div>
                      <span className="text-sm font-bold text-white font-serif-luxury block">{vehicle.name}</span>
                      <span className="text-zinc-400">{vehicle.carType} • {vehicle.seats} Seats</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">Trip Fare</span>
                    <span className="text-base font-bold text-[#D4AF37]">{formatINR(carCost)}</span>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-red-400">No car selected</span>
              )}
            </div>

            {/* 3. Hotel Stay */}
            <div className="glass-panel rounded-2xl p-5 border border-zinc-800 hover:border-[#D4AF37]/40 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-serif-luxury">
                  <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>3. Hotel Booking</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep(3)}
                  className="flex items-center gap-1 text-xs text-[#D4AF37] hover:text-[#F3E5AB] font-mono-tech cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              {hotel ? (
                <div className="flex items-center justify-between text-xs font-mono-tech">
                  <div className="flex items-center gap-3">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-16 h-12 object-cover rounded-lg border border-zinc-700"
                    />
                    <div>
                      <span className="text-sm font-bold text-white font-serif-luxury block">{hotel.name}</span>
                      <span className="text-zinc-400">
                        {hotel.location} • {formatINR(hotelRate)} per night × {hotelNightsCount} Night(s)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">Hotel Total</span>
                    <span className="text-base font-bold text-[#D4AF37]">
                      {formatINR(hotelCost)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-zinc-400 font-mono-tech flex items-center justify-between">
                  <span>No hotel stay selected (Transit trip)</span>
                  <span className="text-zinc-500 font-bold">₹0</span>
                </div>
              )}
            </div>

            {/* 4. Food Items Breakdown */}
            <div className="glass-panel rounded-2xl p-5 border border-zinc-800 hover:border-[#D4AF37]/40 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-serif-luxury">
                  <Utensils className="w-4 h-4 text-[#D4AF37]" />
                  <span>4. Highway Food Items & Meals</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep(4)}
                  className="flex items-center gap-1 text-xs text-[#D4AF37] hover:text-[#F3E5AB] font-mono-tech cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              {selectedFoodItems && selectedFoodItems.length > 0 ? (
                <div className="space-y-2.5">
                  <div className="text-[11px] text-zinc-400 font-mono-tech mb-1">
                    Itemized food order for <strong className="text-[#D4AF37]">{peopleLabel}</strong>:
                  </div>
                  {selectedFoodItems.map((item) => {
                    const itemTotal = item.pricePerPerson * peopleCount * (item.quantity || 1);
                    return (
                      <div key={item.id} className="flex items-center justify-between text-xs font-mono-tech bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/80">
                        <div>
                          <div className="text-white font-medium flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            <span>{item.name}</span>
                            {item.restaurantName && <span className="text-zinc-500 text-[11px]">({item.restaurantName})</span>}
                          </div>
                          <div className="text-zinc-400 text-[11px]">
                            {formatINR(item.pricePerPerson)} per person × {peopleLabel}
                            {item.quantity > 1 ? ` × ${item.quantity} servings` : ''}
                          </div>
                        </div>
                        <span className="text-white font-bold">{formatINR(itemTotal)}</span>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t border-zinc-800 flex justify-between text-xs font-mono-tech">
                    <span className="text-zinc-400 font-semibold">Food Subtotal:</span>
                    <span className="text-[#D4AF37] font-bold">{formatINR(foodCost)}</span>
                  </div>
                </div>
              ) : pitstops && pitstops.length > 0 ? (
                <div className="space-y-2">
                  {pitstops.map((stop) => (
                    <div key={stop.id} className="flex items-center justify-between text-xs font-mono-tech">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                        <span className="text-white font-semibold">{stop.name}</span>
                        <span className="text-zinc-500">({stop.location})</span>
                      </div>
                      <span className="text-zinc-300">
                        {formatINR(stop.price || 120)} × {peopleLabel} = {formatINR((stop.price || 120) * peopleCount)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-zinc-800 flex justify-between text-xs font-mono-tech">
                    <span className="text-zinc-400 font-semibold">Food Subtotal:</span>
                    <span className="text-[#D4AF37] font-bold">{formatINR(foodCost)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-zinc-400 font-mono-tech flex items-center justify-between">
                  <span>Non-stop direct drive (No food orders)</span>
                  <span className="text-zinc-500 font-bold">₹0</span>
                </div>
              )}
            </div>

            {/* 5. Schedule & Traveler Contact */}
            <div className="glass-panel rounded-2xl p-5 border border-zinc-800 hover:border-[#D4AF37]/40 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-serif-luxury">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span>5. Passenger & Schedule Information</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep(6)}
                  className="flex items-center gap-1 text-xs text-[#D4AF37] hover:text-[#F3E5AB] font-mono-tech cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-tech">
                <div>
                  <span className="text-zinc-400 block mb-0.5">Primary Passenger:</span>
                  <span className="text-white font-bold">{userProfile.fullName || 'Passenger'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Contact Phone:</span>
                  <span className="text-white font-bold">{userProfile.phone || '—'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Journey Date:</span>
                  <span className="text-[#F3E5AB] font-semibold">
                    {userProfile.startDate} at {userProfile.startTime}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Travelers:</span>
                  <span className="text-white font-bold text-sm text-[#D4AF37]">{peopleLabel}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right 1 Col: Complete Itemized Price Summary Card */}
          <div className="space-y-4">
            <div className="glass-panel rounded-2xl p-6 border border-[#D4AF37]/40 shadow-[0_0_40px_rgba(0,0,0,0.8)] sticky top-24">
              <div className="flex items-center gap-2 pb-4 border-b border-zinc-800 mb-4">
                <Receipt className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif-luxury font-bold text-lg text-white">
                  Itemized Final Bill
                </h3>
              </div>

              <div className="space-y-3 text-xs font-mono-tech mb-6 divide-y divide-zinc-800/60">
                {/* 1. Car Cost */}
                <div className="pt-2 flex justify-between items-start text-zinc-300">
                  <div>
                    <span className="text-white font-semibold block">{vehicle ? vehicle.name : 'Car Rental'}</span>
                    <span className="text-[11px] text-zinc-400">Dedicated vehicle road fare</span>
                  </div>
                  <span className="font-bold text-white text-sm">{formatINR(carCost)}</span>
                </div>

                {/* 2. Hotel Cost */}
                <div className="pt-2 flex justify-between items-start text-zinc-300">
                  <div>
                    <span className="text-white font-semibold block">
                      {hotel ? hotel.name : 'Hotel Accommodation'}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {hotel ? `${formatINR(hotelRate)} per night × ${hotelNightsCount} Nights` : 'No Hotel (₹0)'}
                    </span>
                  </div>
                  <span className="font-bold text-white text-sm">{formatINR(hotelCost)}</span>
                </div>

                {/* 3. Food Cost */}
                <div className="pt-2 flex justify-between items-start text-zinc-300">
                  <div>
                    <span className="text-white font-semibold block">Food & Refreshments</span>
                    <span className="text-[11px] text-zinc-400">
                      {foodCost > 0 ? `Calculated for ${peopleLabel}` : 'No Food Selected'}
                    </span>
                  </div>
                  <span className="font-bold text-white text-sm">{formatINR(foodCost)}</span>
                </div>

                {/* 4. Service Fee */}
                <div className="pt-2 flex justify-between items-start text-zinc-300">
                  <div>
                    <span className="text-zinc-300 block">Service & Support Fee</span>
                    <span className="text-[11px] text-zinc-500">24/7 Journey tracking & concierge</span>
                  </div>
                  <span className="font-semibold text-zinc-300">{formatINR(serviceFee)}</span>
                </div>

                {/* 5. Tax */}
                <div className="pt-2 flex justify-between items-start text-zinc-300">
                  <div>
                    <span className="text-zinc-300 block">Taxes & GST</span>
                    <span className="text-[11px] text-zinc-500">Standard highway service tax</span>
                  </div>
                  <span className="font-semibold text-zinc-300">{formatINR(tax)}</span>
                </div>

                {/* 6. Total Payable */}
                <div className="pt-4 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-white font-serif-luxury block">TOTAL PAYABLE</span>
                    <span className="text-[10px] text-[#D4AF37] font-mono-tech">All taxes & fees included</span>
                  </div>
                  <span className="text-2xl font-bold font-serif-luxury text-[#D4AF37]">
                    {formatINR(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Confirm Booking CTA */}
              <button
                type="button"
                id="confirm-trip-booking-btn"
                disabled={isConfirming || !vehicle}
                onClick={onConfirmBooking}
                className="w-full py-4 rounded-xl gold-gradient-bg text-black font-bold font-mono-tech text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50"
              >
                {isConfirming ? (
                  <span>Generating Journey Token...</span>
                ) : (
                  <>
                    <span>Confirm & Book Journey</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-mono-tech">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Journey Token & Digital Boarding Pass</span>
              </div>
            </div>
          </div>

        </div>

        {/* Back Button */}
        <div className="flex justify-start">
          <button
            type="button"
            onClick={onGoBack}
            className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono-tech uppercase tracking-wider cursor-pointer"
          >
            ← Back to Step 6: Schedule & Passenger Details
          </button>
        </div>

      </div>
    </section>
  );
};
