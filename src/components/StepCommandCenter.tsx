import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Zap, ArrowRight, Sparkles, Receipt, AlertCircle, FileCheck, Info, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Vehicle, Pitstop, SanctuaryHotel, RouteState, TravelerInfo } from '../types';
import { BookingService } from '../services/bookingService';

interface StepCommandCenterProps {
  route: RouteState;
  vehicle: Vehicle | null;
  pitstops: Pitstop[];
  hotel: SanctuaryHotel | null;
  traveler: TravelerInfo;
  currency?: string;
  onAuthorizeBooking: () => void;
}

export const StepCommandCenter: React.FC<StepCommandCenterProps> = ({
  route,
  vehicle,
  pitstops,
  hotel,
  traveler,
  currency = '₹',
  onAuthorizeBooking,
}) => {
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authStepMessage, setAuthStepMessage] = useState('');

  // Calculate pricing with transparent calculation
  const pricing = BookingService.calculatePricing(vehicle, hotel, pitstops);

  const handleAuthorize = async () => {
    if (isAuthorizing) return;
    setIsAuthorizing(true);
    setAuthStepMessage('Verifying guest details...');

    await new Promise((r) => setTimeout(r, 400));
    setAuthStepMessage('Locking in hotel & vehicle reservation...');

    // Launch celebratory confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#d97706', '#ffffff', '#10b981'],
    });

    await new Promise((r) => setTimeout(r, 600));
    setAuthStepMessage('Issuing your official travel voucher...');

    setTimeout(() => {
      onAuthorizeBooking();
      setIsAuthorizing(false);
      setAuthStepMessage('');
    }, 400);
  };

  const isReadyToAuthorize = vehicle && hotel && traveler.fullName.trim() && traveler.email.trim();

  return (
    <section
      id="command-center"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative scroll-mt-20"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 7 • Review & Instant Reservation</span>
        </div>
        <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-zinc-100 uppercase tracking-tight">
          Review & <span className="text-amber-400">Confirm Booking</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
          Review your customized itinerary, selected hotel, private chauffeur, and complete itemized price breakdown before confirming.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-[#0a0a12] border border-amber-500/30 rounded-2xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300" />

        {/* Demo Mode Notice Banner */}
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Instant Confirmation:</strong> No upfront payment required. Your booking voucher will be generated instantly.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 uppercase tracking-wider shrink-0">
            GUARANTEED
          </span>
        </div>

        {/* System Readout Status Bar */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-300 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-semibold">Status: Ready to Book</span>
          </div>
          <div className="text-zinc-400">
            24/7 Concierge Support: <span className="text-amber-400 font-semibold">Included</span>
          </div>
          <div className="text-zinc-400">
            Free Cancellation: <span className="text-emerald-400 font-semibold">Within 24 Hours</span>
          </div>
        </div>

        {/* Itemized Audit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column: Route & Passenger Details */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs">
              <span className="text-zinc-500 block uppercase tracking-wider text-[10px] mb-1 font-semibold">
                Trip Route & Timeline
              </span>
              <div className="text-zinc-200 font-medium">
                {route.origin || 'Starting Location'} → {route.destination || 'Destination'}
              </div>
              <div className="text-[11px] text-amber-400/80 mt-1">
                Total Distance: {route.distanceMiles} Miles • Driving Time: {route.eta}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs">
              <span className="text-zinc-500 block uppercase tracking-wider text-[10px] mb-1 font-semibold">
                Guest Information
              </span>
              <div className="text-zinc-200 font-medium">{traveler.fullName || 'Not Registered'}</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                {traveler.email || 'No Email'} • {traveler.contactPhone || 'No Contact'}
              </div>
              {traveler.specialRequests && (
                <div className="mt-2 text-[11px] text-amber-300 italic">
                  Special Notes: "{traveler.specialRequests}"
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs">
              <span className="text-zinc-500 block uppercase tracking-wider text-[10px] mb-1 font-semibold">
                Vehicle & Private Chauffeur
              </span>
              <div className="text-zinc-200 font-medium">
                {vehicle ? vehicle.name : 'No Vehicle Selected'}
              </div>
              {vehicle && (
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Chauffeur: {vehicle.driver.name} ({vehicle.driver.title})
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Financial & Line Item Breakdown */}
          <div className="p-6 rounded-xl bg-zinc-900/80 border border-amber-500/20 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-wider font-bold mb-4">
                <Receipt className="w-4 h-4" />
                <span>Transparent Price Breakdown</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Vehicle Fee */}
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="text-zinc-400">
                    Vehicle & Chauffeur ({vehicle ? vehicle.name.split(' ')[0] : 'Unselected'}):
                  </span>
                  <span className="text-zinc-100 font-semibold">{currency}{(vehicle?.price || 0).toLocaleString()}</span>
                </div>

                {/* Pitstops */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="text-zinc-400">
                      Scenic Stops & Dining ({pitstops.length} stop{pitstops.length === 1 ? '' : 's'}):
                    </span>
                    <span className="text-zinc-100 font-semibold">
                      {currency}{pitstops.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                    </span>
                  </div>
                  {pitstops.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-[11px] text-zinc-500 pl-2">
                      <span>• {p.name.split(' ')[0]}</span>
                      <span>+{currency}{p.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Sanctuary */}
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="text-zinc-400">
                    Hotel Stay ({hotel ? hotel.name.split(' ')[0] : 'Unselected'}):
                  </span>
                  <span className="text-zinc-100 font-semibold">{currency}{(hotel?.pricePerNight || 0).toLocaleString()}</span>
                </div>

                {/* Taxes & Service Fee */}
                <div className="pt-2 border-t border-zinc-800 space-y-1.5 text-zinc-400 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span>Base Subtotal:</span>
                    <span className="text-zinc-200">{currency}{pricing.baseCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Applicable Taxes & GST (12%):</span>
                    <span className="text-zinc-200">{currency}{pricing.taxes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Concierge & Booking Fee (5%):</span>
                    <span className="text-zinc-200">{currency}{pricing.serviceFee.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grand Total Bar */}
            <div className="pt-4 mt-6 border-t border-amber-500/30">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                    Total Trip Price
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">
                    Best Price Guarantee
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-amber-300 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  {currency}{pricing.total.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning if incomplete */}
        {!isReadyToAuthorize && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Please ensure you have selected a Vehicle (Step 2), Hotel (Step 4), and filled in Guest Details (Step 6) before confirming your reservation.
            </span>
          </div>
        )}

        {/* Finalize Action Button */}
        <button
          id="authorize-transit-pass-btn"
          type="button"
          onClick={handleAuthorize}
          disabled={!isReadyToAuthorize || isAuthorizing}
          className={`w-full py-4.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
            isReadyToAuthorize
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-zinc-950 hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] cursor-pointer'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
          }`}
        >
          {isAuthorizing ? (
            <div className="flex items-center gap-2 text-zinc-950">
              <span className="w-4 h-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
              <span>{authStepMessage || 'Confirming your booking...'}</span>
            </div>
          ) : (
            <>
              <FileCheck className="w-5 h-5" />
              <span>Confirm Reservation & View Travel Voucher</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </section>
  );
};
