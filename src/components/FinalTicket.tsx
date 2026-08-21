import React, { useState } from 'react';
import {
  Compass,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  XCircle,
  AlertTriangle,
  Info,
  Car,
  Hotel,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Booking } from '../types';

interface FinalTicketProps {
  booking: Booking;
  onReset: () => void;
  onCancelBooking?: (bookingId: string) => void;
}

export const FinalTicket: React.FC<FinalTicketProps> = ({
  booking,
  onReset,
  onCancelBooking,
}) => {
  const [copied, setCopied] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(booking.transitId || booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    if (onCancelBooking) {
      setIsCancelling(true);
      try {
        await onCancelBooking(booking.id);
      } finally {
        setIsCancelling(false);
      }
    }
  };

  const isCancelled = booking.status === 'CANCELLED';
  const currency = booking.pricing?.currency || '₹';
  const totalAmount = booking.pricing?.total || booking.totalCost || 0;

  return (
    <section
      id="final-ticket"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative scroll-mt-20 print:p-0"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 print:hidden">
        <div
          className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${
            isCancelled
              ? 'bg-red-950/40 border border-red-500/40 text-red-300'
              : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
          }`}
        >
          {isCancelled ? (
            <>
              <XCircle className="w-4 h-4 text-red-400" />
              <span>RESERVATION STATUS: CANCELLED</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>BOOKING CONFIRMED • TRAVEL VOUCHER READY</span>
            </>
          )}
        </div>
        <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-zinc-100 uppercase tracking-tight">
          Official Travel <span className="text-amber-400">Voucher</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
          {isCancelled
            ? 'This reservation has been cancelled. If you need any assistance, our support team is available 24/7.'
            : 'Your luxury trip is confirmed. Save or print this travel pass to present to your chauffeur and hotel reception upon arrival.'}
        </p>
      </div>

      {/* Luxury Boarding Pass Container */}
      <div className="bg-[#0b0b14] border-2 border-amber-500/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)] relative text-left">
        {/* Top Gold Bar */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-500 px-6 sm:px-8 py-3.5 flex items-center justify-between text-zinc-950 font-bold text-xs sm:text-sm tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>TRAVELSYNC LUXURY • CONFIRMED TRIP PASS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-black/25 text-zinc-900 px-2.5 py-0.5 rounded font-bold">
              {isCancelled ? 'STATUS: CANCELLED' : 'STATUS: CONFIRMED ✓'}
            </span>
          </div>
        </div>

        {/* Status Strip */}
        <div className="bg-zinc-900/90 border-b border-zinc-800 px-6 py-2 flex items-center justify-between text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed Reservation • Complimentary Chauffeur Meet & Greet</span>
          </div>
          <span className="text-amber-400 font-medium">Ref: {booking.tripId || 'TS-VIP'}</span>
        </div>

        {/* Ticket Inner Grid */}
        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top Row: Transit ID & Timestamp */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                  BOOKING CONFIRMATION CODE
                </span>
                <div className="text-xl sm:text-2xl font-bold text-amber-400 flex items-center gap-2">
                  <span>{booking.transitId || booking.id}</span>
                  <button
                    onClick={handleCopyId}
                    title="Copy Booking ID"
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer print:hidden"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-[10px] text-zinc-500">
                  ID: {booking.id}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                  DATE & TIME ISSUED
                </span>
                <span className="text-xs text-zinc-300 font-medium">
                  {new Date(booking.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Route Coordinates Strip */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-amber-400 uppercase tracking-wider block mb-2 font-semibold">
                TRIP ROUTE & DISTANCE
              </span>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
                <div>
                  <span className="text-zinc-500 text-[10px] block">STARTING POINT</span>
                  <span className="font-medium text-zinc-100">{booking.route.origin}</span>
                </div>
                <div className="text-amber-400 font-bold px-3 py-1 bg-amber-950/60 rounded-lg border border-amber-500/30 text-xs">
                  → {booking.route.distanceMiles} Miles ({booking.route.eta}) →
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">DESTINATION HOTEL</span>
                  <span className="font-medium text-zinc-100">{booking.route.destination}</span>
                </div>
              </div>
            </div>

            {/* Traveler & Vehicle Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs">
                <span className="text-zinc-500 block uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  PRIMARY GUEST & TRAVELERS
                </span>
                <div className="text-zinc-100 font-bold text-sm">
                  {booking.user?.fullName || booking.traveler?.fullName || 'Traveler'}
                </div>
                <div className="text-zinc-400 text-[11px] mt-0.5">
                  {booking.user?.email || booking.traveler?.email || '—'}
                </div>
                <div className="text-zinc-400 text-[11px]">
                  {booking.user?.phone || booking.traveler?.contactPhone || booking.traveler?.phone || '—'}
                </div>
                <div className="text-amber-400 font-bold text-xs mt-1">
                  {(booking.numberOfPeople || booking.travelers || booking.user?.numberOfPeople || 1) === 1 ? '1 Person' : `${booking.numberOfPeople || booking.travelers || booking.user?.numberOfPeople || 1} People`}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs">
                <span className="text-zinc-500 block uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  VEHICLE DETAILS
                </span>
                <div className="text-zinc-100 font-bold text-sm">{booking.vehicle?.name || 'Selected Vehicle'}</div>
                <div className="text-amber-400 text-[11px] mt-0.5 font-medium">
                  {booking.vehicle?.carType || 'Sedan'} • {booking.vehicle?.seats || 4} Seats
                </div>
                {booking.vehicle?.driver && (
                  <div className="text-zinc-400 text-[11px] mt-1">
                    Driver: {booking.vehicle.driver.name} ({booking.vehicle.driver.phone || 'Assigned'})
                  </div>
                )}
              </div>
            </div>

            {/* Hotel & Food Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs">
                <span className="text-zinc-500 block uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  HOTEL RESERVATION
                </span>
                {booking.hotel ? (
                  <>
                    <div className="text-zinc-100 font-bold text-sm">{booking.hotel.name}</div>
                    <div className="text-zinc-400 text-[11px] mt-0.5">{booking.hotel.location} • {booking.hotelNights || 1} Night(s)</div>
                    <div className="text-emerald-400 text-[10px] mt-1 font-medium">✓ Verified Accommodation</div>
                  </>
                ) : (
                  <div className="text-zinc-500 text-[11px]">Direct Transit Trip (No Hotel Stay)</div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs">
                <span className="text-zinc-500 block uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  HIGHWAY FOOD ORDERS ({booking.selectedFoodItems?.length || booking.pitstops?.length || 0})
                </span>
                {booking.selectedFoodItems && booking.selectedFoodItems.length > 0 ? (
                  <ul className="space-y-1 text-[11px] text-zinc-300">
                    {booking.selectedFoodItems.map((item) => (
                      <li key={item.id} className="truncate">
                        • {item.name} (₹{item.pricePerPerson} × {booking.numberOfPeople || 1} People)
                      </li>
                    ))}
                  </ul>
                ) : booking.pitstops && booking.pitstops.length > 0 ? (
                  <ul className="space-y-1 text-[11px] text-zinc-300">
                    {booking.pitstops.map((p) => (
                      <li key={p.id} className="truncate">• {p.name}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-zinc-500 text-[11px]">Direct Route (No food orders)</div>
                )}
              </div>
            </div>

            {/* Special Directives if any */}
            {(booking.user?.specialRequests || booking.traveler?.specialRequests) && (
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs">
                <span className="text-amber-400 font-semibold block text-[10px] uppercase mb-1">
                  Special Requests & Guest Notes:
                </span>
                <span className="text-zinc-300 italic">"{booking.user?.specialRequests || booking.traveler?.specialRequests}"</span>
              </div>
            )}
          </div>

          {/* Right Ticket Stub (4 cols) with QR & Barcode */}
          <div className="lg:col-span-4 bg-[#08080f] border-t lg:border-t-0 lg:border-l border-dashed border-amber-500/40 p-6 sm:p-8 flex flex-col justify-between items-center text-center">
            <div className="w-full space-y-4">
              <div className="font-bold text-xs tracking-wider text-amber-300 uppercase">
                DIGITAL BOARDING PASS
              </div>

              {/* QR Code Box */}
              <div className="w-36 h-36 mx-auto bg-white p-3 rounded-xl shadow-lg flex items-center justify-center">
                <div className="w-full h-full border-2 border-black flex flex-col items-center justify-center p-1 bg-white">
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-black/5">
                    {[...Array(36)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-full h-full ${
                          (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35 || i === 14 || i === 21
                            ? 'bg-black'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                SCAN AT PICKUP & CHECK-IN
              </span>

              {/* Total Financial Summary */}
              <div className="pt-4 border-t border-zinc-800 w-full">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                  TOTAL BOOKING VALUE
                </span>
                <div className="text-3xl font-bold text-amber-300">
                  {currency}{totalAmount.toLocaleString()}
                </div>
                <span
                  className={`text-[10px] font-semibold block mt-1 ${
                    isCancelled ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {isCancelled ? 'CANCELLED' : 'CONFIRMED & GUARANTEED'}
                </span>
              </div>
            </div>

            {/* Barcode */}
            <div className="mt-8 pt-4 border-t border-zinc-800/80 w-full">
              <div className="flex justify-center items-center gap-0.5 h-10 w-full px-2 opacity-70">
                {[4, 2, 6, 1, 3, 5, 2, 4, 1, 3, 6, 2, 4, 3, 5, 1, 2, 6, 3, 4, 2, 5, 1, 4, 3, 2, 6].map(
                  (height, i) => (
                    <div
                      key={i}
                      className="bg-amber-300"
                      style={{
                        width: i % 3 === 0 ? '3px' : '1.5px',
                        height: `${height * 6 + 10}px`,
                      }}
                    />
                  )
                )}
              </div>
              <span className="text-[9px] text-zinc-600 block mt-1 tracking-widest">
                *TS-{booking.transitId || booking.id}-CONFIRMED*
              </span>
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="bg-zinc-950/90 px-6 sm:px-10 py-5 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-400 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print / Download Voucher</span>
            </button>

            {!isCancelled && onCancelBooking && (
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>{isCancelling ? 'Cancelling...' : 'Cancel Reservation'}</span>
              </button>
            )}
          </div>

          <button
            onClick={onReset}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer"
          >
            Plan Another Trip
          </button>
        </div>
      </div>
    </section>
  );
};
