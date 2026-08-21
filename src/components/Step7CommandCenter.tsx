import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Car, 
  Building2, 
  Utensils, 
  User, 
  MapPin, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ReceiptText, 
  Lock, 
  SlidersHorizontal,
  Info,
  AlertTriangle
} from 'lucide-react';
import { Vehicle, Hotel, Pitstop, UserData, PricingDetails } from '../types';
import { formatINR } from '../utils/pricing';

interface Step7CommandCenterProps {
  fromLocation: string;
  toLocation: string;
  vehicle: Vehicle | null;
  hotel: Hotel | null;
  hotelNights: number;
  checkInDate: string;
  checkOutDate: string;
  pitstops: Pitstop[];
  userData: UserData;
  pricing: PricingDetails;
  onConfirmBooking: () => void;
  onNavigateToStep: (stepNumber: number) => void;
}

export const Step7CommandCenter: React.FC<Step7CommandCenterProps> = ({
  fromLocation,
  toLocation,
  vehicle,
  hotel,
  hotelNights,
  checkInDate,
  checkOutDate,
  pitstops,
  userData,
  pricing,
  onConfirmBooking,
  onNavigateToStep,
}) => {
  const [includeGstTax, setIncludeGstTax] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Validation checks
  const hasRoute = Boolean(fromLocation && toLocation);
  const hasVehicle = Boolean(vehicle);
  const hasUser = Boolean(userData.fullName && userData.email && userData.phone);
  const isReadyToBook = hasRoute && hasVehicle && hasUser;

  const handleConfirm = () => {
    if (!isReadyToBook) return;
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      onConfirmBooking();
    }, 900);
  };

  return (
    <section id="step-7-command" className="py-16 scroll-mt-20 border-t border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-tech text-xs uppercase tracking-widest mb-3">
            <ReceiptText className="w-3.5 h-3.5" />
            <span>Master Manifest & Live Settlement</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white mb-3">
            Step 7: <span className="gold-gradient-text">Command Center</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Review your comprehensive voyage itinerary, live itemized pricing structure, and finalize boarding pass generation.
          </p>
        </div>

        {/* Missing Requirements Warning Banner if needed */}
        {!isReadyToBook && (
          <div className="mb-8 p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-center justify-between text-xs font-mono-tech text-amber-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="block text-amber-400 uppercase">Voyage Incomplete:</strong>
                {!hasRoute && <span>• Missing Route (Step 1) </span>}
                {!hasVehicle && <span>• No Transport Selected (Step 2) </span>}
                {!hasUser && <span>• Incomplete Passenger Details (Step 6) </span>}
              </div>
            </div>
            <button
              onClick={() => onNavigateToStep(!hasRoute ? 1 : !hasVehicle ? 2 : 6)}
              className="px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-white font-bold"
            >
              Complete Missing Steps
            </button>
          </div>
        )}

        {/* Master Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Itinerary Breakdown (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Journey Overview Card */}
            <div className="glass-panel rounded-2xl p-6 border border-[#D4AF37]/25 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-serif-luxury text-lg font-bold text-white uppercase tracking-wider">
                    1. Journey Route
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateToStep(1)}
                  className="text-xs font-mono-tech text-[#D4AF37] hover:underline"
                >
                  Edit Route
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono-tech">
                <div>
                  <span className="text-zinc-500 block uppercase">Origin</span>
                  <strong className="text-white text-sm">{fromLocation || 'Not Selected'}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase">Destination</span>
                  <strong className="text-[#F3E5AB] text-sm">{toLocation || 'Not Selected'}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase">Date</span>
                  <span className="text-white">{userData.travelDate || 'Pending'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase">Travelers</span>
                  <span className="text-white">{userData.travelersCount} Passenger(s)</span>
                </div>
              </div>
            </div>

            {/* 2. Selected Transportation Card */}
            <div className="glass-panel rounded-2xl p-6 border border-[#D4AF37]/25">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-serif-luxury text-lg font-bold text-white uppercase tracking-wider">
                    2. Chariot & Pilot
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateToStep(2)}
                  className="text-xs font-mono-tech text-[#D4AF37] hover:underline"
                >
                  Change Fleet
                </button>
              </div>

              {vehicle ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-16 h-16 rounded-xl object-cover border border-[#D4AF37]/40 shrink-0"
                    />
                    <div>
                      <h4 className="font-serif-luxury text-base font-bold text-white">
                        {vehicle.name}
                      </h4>
                      <div className="text-xs text-zinc-400 font-mono-tech">
                        Category: <span className="capitalize text-zinc-300">{vehicle.category}</span> • ETA: {vehicle.travelTime}
                      </div>
                      <div className="text-xs text-[#D4AF37] font-mono-tech mt-0.5">
                        Pilot: {vehicle.driver.name} (★ {vehicle.driver.rating})
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono-tech text-zinc-500 block">Fare</span>
                    <span className="font-serif-luxury font-bold text-xl text-[#F3E5AB]">
                      {formatINR(vehicle.price)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs font-mono-tech text-rose-400">
                  No transport chariot selected yet.
                </div>
              )}
            </div>

            {/* 3. Selected Hotel Sanctuary Card */}
            <div className="glass-panel rounded-2xl p-6 border border-[#D4AF37]/25">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-serif-luxury text-lg font-bold text-white uppercase tracking-wider">
                    3. Hotel Sanctuary
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateToStep(4)}
                  className="text-xs font-mono-tech text-[#D4AF37] hover:underline"
                >
                  Change Stay
                </button>
              </div>

              {hotel ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-16 h-16 rounded-xl object-cover border border-[#D4AF37]/40 shrink-0"
                    />
                    <div>
                      <h4 className="font-serif-luxury text-base font-bold text-white">
                        {hotel.name}
                      </h4>
                      <div className="text-xs text-zinc-400 font-mono-tech">
                        {hotel.roomType}
                      </div>
                      <div className="text-xs text-[#D4AF37] font-mono-tech mt-0.5">
                        {hotelNights} Night(s) Stay • ({formatINR(hotel.pricePerNight)} / night)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono-tech text-zinc-500 block">
                      Subtotal ({hotelNights}N)
                    </span>
                    <span className="font-serif-luxury font-bold text-xl text-[#F3E5AB]">
                      {formatINR(hotel.pricePerNight * hotelNights)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400">
                  <span>Transit only (No hotel stay booked).</span>
                  <button
                    onClick={() => onNavigateToStep(4)}
                    className="text-[#D4AF37] hover:underline"
                  >
                    + Add Sanctuary
                  </button>
                </div>
              )}
            </div>

            {/* 4. Selected Pitstops Card */}
            <div className="glass-panel rounded-2xl p-6 border border-[#D4AF37]/25">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-serif-luxury text-lg font-bold text-white uppercase tracking-wider">
                    4. Energy Pitstops ({pitstops.length})
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateToStep(3)}
                  className="text-xs font-mono-tech text-[#D4AF37] hover:underline"
                >
                  Manage Stops
                </button>
              </div>

              {pitstops.length > 0 ? (
                <div className="space-y-3">
                  {pitstops.map((stop) => (
                    <div
                      key={stop.id}
                      className="p-3 rounded-xl bg-[#0B0B0F] border border-zinc-800 flex items-center justify-between text-xs font-mono-tech"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={stop.image}
                          alt={stop.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#D4AF37]/30"
                        />
                        <div>
                          <strong className="text-white block">{stop.name}</strong>
                          <span className="text-zinc-400">{stop.cuisine}</span>
                        </div>
                      </div>
                      <span className="font-serif-luxury font-bold text-sm text-[#F3E5AB]">
                        {formatINR(stop.price)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400">
                  <span>No pitstop sanctuaries scheduled. (Non-stop voyage)</span>
                  <button
                    onClick={() => onNavigateToStep(3)}
                    className="text-[#D4AF37] hover:underline"
                  >
                    + Add Pitstop
                  </button>
                </div>
              )}
            </div>

            {/* 5. Passenger Manifest Card */}
            <div className="glass-panel rounded-2xl p-6 border border-[#D4AF37]/25">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-serif-luxury text-lg font-bold text-white uppercase tracking-wider">
                    5. Passenger Manifest
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateToStep(6)}
                  className="text-xs font-mono-tech text-[#D4AF37] hover:underline"
                >
                  Edit Passenger
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono-tech">
                <div>
                  <span className="text-zinc-500 block uppercase">Primary Voyager</span>
                  <strong className="text-white text-sm">{userData.fullName || 'Not Entered'}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase">Contact Phone</span>
                  <span className="text-white">{userData.phone || 'Not Entered'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase">Email</span>
                  <span className="text-white truncate block">{userData.email || 'Not Entered'}</span>
                </div>
              </div>

              {userData.specialRequests && (
                <div className="mt-4 pt-3 border-t border-zinc-800/60 text-xs font-mono-tech">
                  <span className="text-zinc-500 block uppercase">Special Protocol / Notes:</span>
                  <p className="text-zinc-300 italic">{userData.specialRequests}</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Live Settlement Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-[0_0_40px_rgba(212,175,55,0.2)] relative overflow-hidden">
              
              {/* Gold Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 gold-gradient-bg" />

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-serif-luxury text-xl font-bold text-white">
                    Live Bill Breakdown
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono-tech font-bold">
                  REAL-TIME TRUTH
                </span>
              </div>

              {/* Itemized Line Items */}
              <div className="space-y-4 text-xs font-mono-tech text-zinc-300 mb-6">
                
                {/* 1. Transport */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                  <div>
                    <span className="text-white font-semibold">Chariot Transportation</span>
                    <div className="text-[11px] text-zinc-500">{vehicle?.name || 'Pending selection'}</div>
                  </div>
                  <span className="font-bold text-white text-sm">
                    {formatINR(pricing.vehicleCost)}
                  </span>
                </div>

                {/* 2. Hotel */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                  <div>
                    <span className="text-white font-semibold">Sanctuary Stay</span>
                    <div className="text-[11px] text-zinc-500">
                      {hotel ? `${hotel.name} (${pricing.hotelNights} N @ ${formatINR(hotel.pricePerNight)})` : 'No stay selected'}
                    </div>
                  </div>
                  <span className="font-bold text-white text-sm">
                    {formatINR(pricing.hotelCost)}
                  </span>
                </div>

                {/* 3. Pitstops */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                  <div>
                    <span className="text-white font-semibold">Highway Pitstop Meals</span>
                    <div className="text-[11px] text-zinc-500">
                      {pitstops.length > 0 ? `${pitstops.length} gourmet stop(s)` : 'Zero stops'}
                    </div>
                  </div>
                  <span className="font-bold text-white text-sm">
                    {formatINR(pricing.pitstopCost)}
                  </span>
                </div>

                {/* 4. Service Protocol Fee */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                  <div>
                    <span className="text-white font-semibold">Autonomous Concierge Protocol</span>
                    <div className="text-[11px] text-zinc-500">Satellite Dispatch & 24/7 Sage AI</div>
                  </div>
                  <span className="font-bold text-[#D4AF37] text-sm">
                    {formatINR(pricing.serviceFee)}
                  </span>
                </div>

                {/* Optional GST Tax Toggle */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      id="tax-toggle"
                      type="checkbox"
                      checked={includeGstTax}
                      onChange={(e) => setIncludeGstTax(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-700 text-[#D4AF37] focus:ring-[#D4AF37] bg-zinc-900 cursor-pointer"
                    />
                    <label htmlFor="tax-toggle" className="text-xs text-zinc-400 cursor-pointer flex items-center gap-1">
                      <span>Include GST / Luxury Surcharge (0%)</span>
                    </label>
                  </div>
                  <span className="text-zinc-500">₹0</span>
                </div>

              </div>

              {/* Final Calculated Grand Total */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#18160E] to-[#0A0A0D] border border-[#D4AF37]/50 shadow-[inset_0_0_20px_rgba(212,175,55,0.15)] mb-8">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs uppercase font-mono-tech text-[#D4AF37] tracking-widest font-bold block">
                      FINAL CALCULATED TOTAL
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono-tech">
                      Guaranteed final price • No hidden fees
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif-luxury font-extrabold text-3xl sm:text-4xl text-[#F3E5AB] tracking-tight">
                      {formatINR(pricing.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Booking Action Button */}
              <button
                type="button"
                id="confirm-booking-master-btn"
                disabled={!isReadyToBook || isAuthorizing}
                onClick={handleConfirm}
                className={`w-full py-4 px-6 rounded-xl font-mono-tech text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
                  isReadyToBook && !isAuthorizing
                    ? 'gold-gradient-bg text-black shadow-[0_0_35px_rgba(212,175,55,0.45)] hover:shadow-[0_0_50px_rgba(212,175,55,0.75)] hover:scale-[1.02] cursor-pointer'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                }`}
              >
                {isAuthorizing ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    <span>AUTHORIZING VOYAGE PROTOCOL...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-black" />
                    <span>Confirm Booking & Issue Ticket</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono-tech text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>256-bit Encrypted Voyage Manifest • Instant Confirmation</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
