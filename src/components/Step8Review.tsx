import React from 'react';
import { ShieldCheck, Edit3, Car, Building2, Utensils, Calendar, User, ArrowRight, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { Vehicle, Hotel, Pitstop, UserProfile, PricingDetails } from '../types';
import { formatINR } from '../utils/pricing';

interface Step8ReviewProps {
  fromLocation: string;
  toLocation: string;
  distanceKm: number;
  travelTime: string;
  vehicle: Vehicle | null;
  hotel: Hotel | null;
  hotelNights: number;
  pitstops: Pitstop[];
  userProfile: UserProfile;
  pricing: PricingDetails;
  isConfirming: boolean;
  onNavigateToStep: (stepNumber: number) => void;
  onConfirmBooking: () => void;
  onGoBack: () => void;
}

export const Step8Review: React.FC<Step8ReviewProps> = ({
  fromLocation,
  toLocation,
  distanceKm,
  travelTime,
  vehicle,
  hotel,
  hotelNights,
  pitstops,
  userProfile,
  pricing,
  isConfirming,
  onNavigateToStep,
  onConfirmBooking,
  onGoBack,
}) => {
  return (
    <section id="step-8-review" className="py-12 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-tech text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Step 8 of 9</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-2">
            Step 8: <span className="gold-gradient-text">Review & Confirm Your Trip</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Please review all trip details carefully. You can click "Edit" on any section to make changes.
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
                  <span>1. Route & Travel Distance</span>
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

              <div className="grid grid-cols-2 gap-4 text-xs font-mono-tech">
                <div>
                  <span className="text-zinc-400 block mb-0.5">From:</span>
                  <span className="text-base font-bold text-white">{fromLocation}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">To:</span>
                  <span className="text-base font-bold text-white">{toLocation}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Road Distance:</span>
                  <span className="text-sm font-semibold text-[#F3E5AB]">{distanceKm} km</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Estimated Drive Time:</span>
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
                    <span className="text-[10px] text-zinc-400 block">Fare</span>
                    <span className="text-base font-bold text-[#D4AF37]">{formatINR(vehicle.price)}</span>
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
                  <span>3. Hotel Stay</span>
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
                  <div>
                    <span className="text-sm font-bold text-white font-serif-luxury block">{hotel.name}</span>
                    <span className="text-zinc-400">{hotel.location} • {hotelNights} Night(s)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">{formatINR(hotel.pricePerNight)} × {hotelNights}N</span>
                    <span className="text-base font-bold text-[#D4AF37]">
                      {formatINR(hotel.pricePerNight * hotelNights)}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-zinc-400 font-mono-tech">No hotel stay selected (₹0)</span>
              )}
            </div>

            {/* 4. Food Stops */}
            <div className="glass-panel rounded-2xl p-5 border border-zinc-800 hover:border-[#D4AF37]/40 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-serif-luxury">
                  <Utensils className="w-4 h-4 text-[#D4AF37]" />
                  <span>4. Highway Food Stops</span>
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

              {pitstops.length > 0 ? (
                <div className="space-y-2 text-xs font-mono-tech">
                  {pitstops.map((p) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <span className="text-zinc-300">{p.name} ({p.location})</span>
                      <span className="font-bold text-[#D4AF37]">{formatINR(p.cost || p.price || 0)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-zinc-400 font-mono-tech">No food stops selected (₹0)</span>
              )}
            </div>

            {/* 5. Passenger & Timing Details */}
            <div className="glass-panel rounded-2xl p-5 border border-zinc-800 hover:border-[#D4AF37]/40 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-serif-luxury">
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <span>5. Traveler & Schedule</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep(7)}
                  className="flex items-center gap-1 text-xs text-[#D4AF37] hover:text-[#F3E5AB] font-mono-tech cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono-tech">
                <div>
                  <span className="text-zinc-400 block">Traveler:</span>
                  <span className="text-white font-semibold">{userProfile.fullName || 'Registered User'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Contact Phone:</span>
                  <span className="text-white font-semibold">{userProfile.phone || 'Provided'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Email:</span>
                  <span className="text-white font-semibold truncate block">{userProfile.email}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Departure Date:</span>
                  <span className="text-[#F3E5AB] font-semibold">{userProfile.startDate}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Pickup Time:</span>
                  <span className="text-[#F3E5AB] font-semibold">{userProfile.startTime}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Travelers:</span>
                  <span className="text-white font-semibold">{userProfile.travelersCount} Person(s)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Col: Price Breakdown & Confirm CTA */}
          <div className="lg:col-span-1">
            <div className="glass-panel rounded-2xl p-6 border border-[#D4AF37]/35 shadow-[0_0_30px_rgba(212,175,55,0.15)] sticky top-24">
              
              <h3 className="text-lg font-bold font-serif-luxury text-white mb-4 pb-3 border-b border-zinc-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Price Breakdown</span>
              </h3>

              <div className="space-y-3 text-xs font-mono-tech mb-6">
                <div className="flex justify-between text-zinc-300">
                  <span>Car Rental Fare:</span>
                  <span className="font-semibold text-white">{formatINR(pricing.vehicleCost)}</span>
                </div>

                <div className="flex justify-between text-zinc-300">
                  <span>Hotel Stay ({hotelNights}N):</span>
                  <span className="font-semibold text-white">{formatINR(pricing.hotelCost)}</span>
                </div>

                <div className="flex justify-between text-zinc-300">
                  <span>Food & Refreshments:</span>
                  <span className="font-semibold text-white">{formatINR(pricing.pitstopCost)}</span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Taxes & GST:</span>
                  <span className="text-emerald-400 font-semibold">Included</span>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white uppercase">Total Price:</span>
                  <span className="text-2xl font-bold font-serif-luxury text-[#D4AF37]">
                    {formatINR(pricing.total)}
                  </span>
                </div>
              </div>

              {/* Confirm Booking CTA */}
              <button
                type="button"
                id="confirm-booking-final-btn"
                disabled={isConfirming}
                onClick={onConfirmBooking}
                className="w-full py-4 rounded-xl gold-gradient-bg text-black font-bold font-mono-tech text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isConfirming ? 'Generating Token...' : 'Confirm Booking & Get Ticket'}</span>
              </button>

              <p className="text-[10px] text-zinc-400 text-center font-mono-tech mt-3">
                Generates your unique Registration Token ID for driver & hotel check-in.
              </p>
            </div>
          </div>

        </div>

        {/* Go Back Bar */}
        <div className="flex justify-start">
          <button
            type="button"
            onClick={onGoBack}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono-tech uppercase tracking-wider cursor-pointer"
          >
            ← Back to Step 7: Schedule
          </button>
        </div>

      </div>
    </section>
  );
};
