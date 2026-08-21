import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Printer, 
  X, 
  Compass, 
  Car, 
  Building2, 
  Utensils, 
  Calendar, 
  User, 
  Copy, 
  Check, 
  Luggage,
  Receipt,
  Users
} from 'lucide-react';
import { Booking } from '../types';
import { formatINR } from '../utils/pricing';

interface FinalTicketModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenMyTrips: () => void;
  onBookAnother: () => void;
}

export const FinalTicketModal: React.FC<FinalTicketModalProps> = ({
  booking,
  isOpen,
  onClose,
  onOpenMyTrips,
  onBookAnother,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (isOpen && booking) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F3E5AB', '#8C6D1F', '#FFFFFF'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  const peopleCount = Math.max(1, booking.numberOfPeople || booking.travelers || booking.user?.numberOfPeople || booking.user?.travelersCount || 1);
  const peopleLabel = peopleCount === 1 ? '1 Person' : `${peopleCount} People`;

  const carFare = booking.carCost || booking.pricing?.carCost || booking.pricing?.vehicleCost || booking.vehicle.price;
  const hotelTotal = booking.hotelTotal || booking.pricing?.hotelCost || (booking.hotel ? (booking.hotelPricePerNight || booking.hotel.pricePerNight) * (booking.hotelNights || 1) : 0);
  const foodTotal = booking.foodTotal || booking.pricing?.foodCost || booking.pricing?.pitstopCost || 0;
  const finalFare = booking.finalTotal || booking.pricing?.finalTotal || booking.pricing?.total || 0;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyManifest = () => {
    const text = `⭐ TOURGUIDE AI - OFFICIAL BOARDING PASS & JOURNEY TOKEN ⭐
Journey Token ID: ${booking.journeyToken || booking.id}
Booking ID: ${booking.bookingId || booking.id}
User ID: ${booking.userId || booking.user.userId || 'TGAI-USER-82F4K91'}
Status: ${booking.status}
Lead Traveler: ${booking.user.fullName} (${booking.user.phone})
Number of People: ${peopleLabel}
Route: ${booking.from} ➔ ${booking.to} (${booking.distanceKm ? `${booking.distanceKm} km` : ''})
Departure: ${booking.travelDate} at ${booking.travelTime || '08:00 AM'}
Vehicle: ${booking.vehicle.name} (${booking.vehicle.carType}) - ${formatINR(carFare)}
Hotel: ${booking.hotel ? `${booking.hotel.name} (${booking.hotelNights} Night(s)) - ${formatINR(hotelTotal)}` : 'Transit Trip (₹0)'}
Food Total: ${formatINR(foodTotal)}
Total Paid: ${formatINR(finalFare)}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      
      <div className="relative w-full max-w-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-ticket-modal-btn"
          className="absolute -top-12 right-0 sm:-right-4 w-10 h-10 rounded-full bg-[#111115] hover:bg-[#202028] border border-[#D4AF37]/30 text-white flex items-center justify-center no-print transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Master Boarding Ticket Container */}
        <div 
          id="final-boarding-ticket"
          className="ticket-container bg-[#08080C] rounded-3xl border-2 border-[#D4AF37] shadow-[0_0_60px_rgba(212,175,55,0.35)] overflow-hidden"
        >
          {/* Ticket Golden Header */}
          <div className="gold-gradient-bg p-6 sm:p-7 text-black relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-[#D4AF37] shadow-lg">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif-luxury text-xl sm:text-2xl font-black tracking-wider">
                    TOURGUIDE AI
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black text-[#F3E5AB] font-mono-tech text-[10px] font-bold tracking-widest">
                    BOARDING PASS
                  </span>
                </div>
                <div className="text-[10px] uppercase font-mono-tech tracking-wider font-bold text-black/80">
                  Confirmed Highway Journey
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono-tech text-black/80 font-bold block">
                Journey Token ID
              </span>
              <span className="font-mono-tech font-extrabold text-base sm:text-lg tracking-wider bg-black/15 px-3 py-1 rounded-lg inline-block">
                {booking.journeyToken || booking.id}
              </span>
            </div>
          </div>

          {/* Ticket Perforated Divider Bar */}
          <div className="relative h-6 bg-[#08080C] flex items-center justify-between px-2">
            <div className="w-6 h-6 rounded-full bg-black/85 -ml-5 border-r border-[#D4AF37]/50" />
            <div className="flex-1 border-b-2 border-dashed border-[#D4AF37]/30 mx-3" />
            <div className="w-6 h-6 rounded-full bg-black/85 -mr-5 border-l border-[#D4AF37]/50" />
          </div>

          {/* Ticket Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Route Headline Banner */}
            <div className="p-4 rounded-2xl bg-[#0F0E14] border border-[#D4AF37]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono-tech uppercase text-zinc-400 block">Origin (From)</span>
                <span className="font-serif-luxury font-bold text-lg sm:text-2xl text-white">
                  {booking.from}
                </span>
              </div>
              <div className="flex flex-col items-center px-4">
                <span className="text-xs font-mono-tech text-[#D4AF37] font-bold">➔ HIGHWAY TRIP ➔</span>
                <div className="w-24 h-[1px] bg-[#D4AF37]/40 my-1" />
                <span className="text-[10px] font-mono-tech text-zinc-400">
                  {booking.durationText || booking.vehicle.travelTime || 'Direct Route'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono-tech uppercase text-zinc-400 block">Destination (To)</span>
                <span className="font-serif-luxury font-bold text-lg sm:text-2xl text-[#F3E5AB]">
                  {booking.to}
                </span>
              </div>
            </div>

            {/* Middle Grid: Passenger, Car, Stay, QR */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Details */}
              <div className="sm:col-span-2 space-y-3 text-xs font-mono-tech">
                
                {/* Passenger & User ID */}
                <div className="p-3 rounded-xl bg-[#0D0D12] border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="uppercase text-[10px]">Lead Traveler</span>
                    </div>
                    <span className="text-[10px] text-[#D4AF37]">
                      User ID: {booking.userId || booking.user.userId || 'TGAI-USER-82F4K91'}
                    </span>
                  </div>
                  <div className="text-white font-bold text-sm">{booking.user.fullName}</div>
                  <div className="text-zinc-400">{booking.user.phone} {booking.user.email ? `• ${booking.user.email}` : ''}</div>
                  <div className="text-[#F3E5AB] font-semibold mt-1">Number of People: {peopleLabel}</div>
                </div>

                {/* Car */}
                <div className="p-3 rounded-xl bg-[#0D0D12] border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="uppercase text-[10px]">Confirmed Vehicle</span>
                    </div>
                    <span className="text-white font-bold">{formatINR(carFare)}</span>
                  </div>
                  <div className="text-white font-bold">{booking.vehicle.name}</div>
                  <div className="text-zinc-400">{booking.vehicle.carType} • {booking.vehicle.seats} Seats</div>
                </div>

                {/* Hotel */}
                <div className="p-3 rounded-xl bg-[#0D0D12] border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="uppercase text-[10px]">Hotel Accommodation</span>
                    </div>
                    <span className="text-white font-bold">{formatINR(hotelTotal)}</span>
                  </div>
                  {booking.hotel ? (
                    <>
                      <div className="text-white font-bold">{booking.hotel.name}</div>
                      <div className="text-zinc-400">
                        {booking.hotelNights} Night(s) Stay • {formatINR(booking.hotelPricePerNight || booking.hotel.pricePerNight)}/night
                      </div>
                    </>
                  ) : (
                    <div className="text-zinc-400">No hotel accommodation booked (Transit)</div>
                  )}
                </div>

                {/* Food Items */}
                {booking.selectedFoodItems && booking.selectedFoodItems.length > 0 ? (
                  <div className="p-3 rounded-xl bg-[#0D0D12] border border-zinc-800">
                    <div className="flex items-center justify-between text-zinc-400 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="uppercase text-[10px]">Selected Highway Food</span>
                      </div>
                      <span className="text-[#D4AF37] font-bold">{formatINR(foodTotal)}</span>
                    </div>
                    <div className="space-y-1">
                      {booking.selectedFoodItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-[11px] text-zinc-300">
                          <span>{item.name} ({formatINR(item.pricePerPerson)} × {peopleLabel})</span>
                          <span className="font-semibold text-white">
                            {formatINR(item.pricePerPerson * peopleCount * (item.quantity || 1))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : booking.pitstops && booking.pitstops.length > 0 ? (
                  <div className="p-3 rounded-xl bg-[#0D0D12] border border-zinc-800">
                    <div className="flex items-center justify-between text-zinc-400 mb-1">
                      <div className="flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="uppercase text-[10px]">Food Stops</span>
                      </div>
                      <span className="text-white font-bold">{formatINR(foodTotal)}</span>
                    </div>
                    <div className="text-zinc-300">
                      {booking.pitstops.map((p) => p.name).join(' • ')}
                    </div>
                  </div>
                ) : null}

              </div>

              {/* Right Col: QR Code + Verified Status */}
              <div className="flex flex-col items-center justify-between p-4 rounded-2xl bg-[#0A0A0E] border border-[#D4AF37]/30 text-center">
                
                <div className="p-2.5 bg-white rounded-xl shadow-lg mb-3">
                  <QRCodeSVG
                    value={booking.qrPayload || JSON.stringify({ token: booking.journeyToken || booking.id, userId: booking.userId, total: finalFare })}
                    size={130}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <div className="w-full">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-mono-tech font-bold mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>CONFIRMED</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono-tech">
                    Token ID Verified
                  </div>
                </div>

              </div>

            </div>

            {/* Ticket Footer Bar */}
            <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono-tech text-zinc-400">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>Travel Date: <strong className="text-white">{booking.travelDate}</strong> at {booking.travelTime || '08:00 AM'}</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xs uppercase font-mono-tech text-zinc-400">Total Paid:</span>
                <span className="font-serif-luxury font-extrabold text-2xl text-[#F3E5AB]">
                  {formatINR(finalFare)}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Action Controls (Hidden on Print) */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              id="download-print-ticket-btn"
              className="px-4 py-2.5 rounded-xl bg-[#14141B] hover:bg-[#20202A] border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-mono-tech font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#D4AF37]" />
              <span>Print / Download Boarding Pass</span>
            </button>

            <button
              onClick={handleCopyManifest}
              id="share-manifest-btn"
              className="px-4 py-2.5 rounded-xl bg-[#14141B] hover:bg-[#20202A] border border-zinc-800 text-zinc-300 text-xs font-mono-tech flex items-center gap-2 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#D4AF37]" />
                  <span>Copy Token Details</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMyTrips}
              id="view-in-my-trips-btn"
              className="px-4 py-2.5 rounded-xl bg-[#14141B] hover:bg-[#20202A] border border-zinc-800 text-zinc-300 text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Luggage className="w-4 h-4 text-[#D4AF37]" />
              <span>View in My Trips</span>
            </button>

            <button
              onClick={onBookAnother}
              id="book-another-btn"
              className="px-5 py-2.5 rounded-xl gold-gradient-bg text-black font-mono-tech text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.7)] transition-all cursor-pointer"
            >
              <span>Plan Another Trip</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
