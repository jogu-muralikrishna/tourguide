import React from 'react';
import { ShieldCheck, Edit3, Car, Building2, Utensils, Calendar, MapPin, ArrowRight, Receipt, Users, ArrowLeft } from 'lucide-react';
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
  const perPersonCost = Math.round(finalTotal / peopleCount);

  return (
    <section id="step-7-review" className="py-6 sm:py-10 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Top Back Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onGoBack}
            className="ui-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Back to Step 6 (Your Details)</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Receipt className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Step 7 of 7</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight font-serif-luxury">
            Review & Checkout
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Review your complete journey summary and itemized cost breakdown before confirming.
          </p>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Left Column: Trip Segments */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* 1. Route */}
            <div className="ui-card-luxury p-5 border border-[#D4AF37]/25">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20 mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-serif-luxury">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>1. Route & Highway Distance</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep(1)}
                  className="flex items-center gap-1 text-xs text-[#F3E5AB] hover:underline font-semibold cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-[#D4AF37]" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-zinc-400 block mb-0.5">Origin:</span>
                  <span className="font-bold text-white">{fromLocation}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Destination:</span>
                  <span className="font-bold text-white">{toLocation}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Distance:</span>
                  <span className="font-bold text-[#F3E5AB] font-mono-tech">{distanceKm} km</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Est. Time:</span>
                  <span className="font-semibold text-white font-mono-tech">{travelTime}</span>
                </div>
              </div>
            </div>

            {/* 2. Car Selection */}
            <div className="ui-card-luxury p-5 border border-[#D4AF37]/25">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20 mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-serif-luxury">
                  <Car className="w-4 h-4 text-[#D4AF37]" />
                  <span>2. Selected Transport</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep(2)}
                  className="flex items-center gap-1 text-xs text-[#F3E5AB] hover:underline font-semibold cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-[#D4AF37]" />
                  <span>Edit</span>
                </button>
              </div>

              {vehicle ? (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-16 h-12 object-cover rounded-lg border border-[#D4AF37]/30"
                    />
                    <div>
                      <span className="text-sm font-bold text-white block font-serif-luxury">{vehicle.name}</span>
                      <span className="text-zinc-400">{vehicle.carType} • {vehicle.seats} Seats</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">Trip Fare</span>
                    <span className="text-base font-bold text-[#F3E5AB] font-mono-tech">{formatINR(carCost)}</span>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-red-400">No transport selected</span>
              )}
            </div>

            {/* 3. Hotel Stay */}
            <div className="ui-card-luxury p-5 border border-[#D4AF37]/25">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20 mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-serif-luxury">
                  <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>3. Hotel Accommodation</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep(3)}
                  className="flex items-center gap-1 text-xs text-[#F3E5AB] hover:underline font-semibold cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-[#D4AF37]" />
                  <span>Edit</span>
                </button>
              </div>

              {hotel ? (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-16 h-12 object-cover rounded-lg border border-[#D4AF37]/30"
                    />
                    <div>
                      <span className="text-sm font-bold text-white block font-serif-luxury">{hotel.name}</span>
                      <span className="text-zinc-400">
                        {hotel.location} • {formatINR(hotelRate)}/night × {hotelNightsCount}N
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">Hotel Total</span>
                    <span className="text-base font-bold text-[#F3E5AB] font-mono-tech">{formatINR(hotelCost)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-zinc-400 flex items-center justify-between">
                  <span>No hotel stay selected (Transit trip)</span>
                  <span className="font-bold text-white font-mono-tech">₹0</span>
                </div>
              )}
            </div>

            {/* 4. Food Items */}
            <div className="ui-card-luxury p-5 border border-[#D4AF37]/25">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20 mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-serif-luxury">
                  <Utensils className="w-4 h-4 text-[#D4AF37]" />
                  <span>4. Highway Meals</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep(4)}
                  className="flex items-center gap-1 text-xs text-[#F3E5AB] hover:underline font-semibold cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-[#D4AF37]" />
                  <span>Edit</span>
                </button>
              </div>

              {selectedFoodItems && selectedFoodItems.length > 0 ? (
                <div className="space-y-2">
                  {selectedFoodItems.map((item) => {
                    const itemTotal = item.pricePerPerson * peopleCount * (item.quantity || 1);
                    return (
                      <div key={item.id} className="flex items-center justify-between text-xs bg-[#0a0a0f] p-2 rounded-xl border border-[#D4AF37]/20">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          <span className="font-medium text-white">{item.name}</span>
                        </div>
                        <span className="font-bold text-[#F3E5AB] font-mono-tech">{formatINR(itemTotal)}</span>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t border-[#D4AF37]/20 flex justify-between text-xs font-semibold">
                    <span className="text-zinc-400">Food Total:</span>
                    <span className="text-[#F3E5AB] font-mono-tech">{formatINR(foodCost)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-zinc-400 flex items-center justify-between">
                  <span>Non-stop route (No food order)</span>
                  <span className="font-bold text-white font-mono-tech">₹0</span>
                </div>
              )}
            </div>

            {/* 5. Schedule & Contact */}
            <div className="ui-card-luxury p-5 border border-[#D4AF37]/25">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20 mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-serif-luxury">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span>5. Traveler Details & Schedule</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep(6)}
                  className="flex items-center gap-1 text-xs text-[#F3E5AB] hover:underline font-semibold cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-[#D4AF37]" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-zinc-400 block mb-0.5">Passenger:</span>
                  <span className="font-bold text-white">{userProfile.fullName || 'Traveler'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Phone:</span>
                  <span className="font-bold text-white">{userProfile.phone || '—'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Departure:</span>
                  <span className="font-semibold text-[#F3E5AB]">{userProfile.startDate} at {userProfile.startTime}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Travelers:</span>
                  <span className="font-bold text-white">{peopleLabel}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Total Cost Breakdown Card */}
          <div className="space-y-4">
            <div className="ui-card-luxury p-6 sticky top-20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-2 border-[#D4AF37]/40">
              <div className="flex items-center gap-2 pb-3 border-b border-[#D4AF37]/20 mb-4">
                <Receipt className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-bold text-lg text-white font-serif-luxury">
                  Total Trip Cost
                </h3>
              </div>

              <div className="space-y-2.5 text-xs mb-6 divide-y divide-[#D4AF37]/15">
                <div className="pt-1 flex justify-between items-center">
                  <span className="text-zinc-400">Travel / Vehicle:</span>
                  <span className="font-semibold text-white font-mono-tech">{formatINR(carCost)}</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-zinc-400">Hotel Accommodations:</span>
                  <span className="font-semibold text-white font-mono-tech">{formatINR(hotelCost)}</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-zinc-400">Food & Refreshments:</span>
                  <span className="font-semibold text-white font-mono-tech">{formatINR(foodCost)}</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-zinc-400">Service & Concierge Fee:</span>
                  <span className="font-semibold text-white font-mono-tech">{formatINR(serviceFee)}</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-zinc-400">Taxes & GST:</span>
                  <span className="font-semibold text-white font-mono-tech">{formatINR(tax)}</span>
                </div>

                <div className="pt-4 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-white block font-serif-luxury">TOTAL TRIP COST</span>
                    <span className="text-[10px] text-[#F3E5AB] font-medium font-mono-tech">Per Person: {formatINR(perPersonCost)}</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#F3E5AB] font-mono-tech drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                    {formatINR(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Confirm CTA */}
              <button
                type="button"
                id="confirm-trip-booking-btn"
                disabled={isConfirming || !vehicle}
                onClick={onConfirmBooking}
                className="ui-btn-primary w-full py-4 text-sm uppercase tracking-wider font-extrabold shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              >
                {isConfirming ? (
                  <span>Creating Booking Token...</span>
                ) : (
                  <>
                    <span>Confirm & Book Trip</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Instant Digital Boarding Voucher</span>
              </div>
            </div>
          </div>

        </div>

        {/* Back Action */}
        <div className="flex justify-start">
          <button
            type="button"
            onClick={onGoBack}
            className="ui-btn-secondary"
          >
            ← Back to Step 6
          </button>
        </div>

      </div>
    </section>
  );
};
