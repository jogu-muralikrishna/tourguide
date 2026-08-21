import React, { useState } from 'react';
import { 
  Luggage, 
  Search, 
  X, 
  Ticket, 
  Calendar, 
  MapPin, 
  Car, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Trash2, 
  Sparkles,
  Users,
  Utensils
} from 'lucide-react';
import { Booking } from '../types';
import { formatINR } from '../utils/pricing';

interface MyTripsModalProps {
  isOpen: boolean;
  bookings: Booking[];
  initialTab?: 'all' | 'Confirmed' | 'Pending' | 'Cancelled';
  onClose: () => void;
  onViewTicket: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onPlanNewTrip: () => void;
}

export const MyTripsModal: React.FC<MyTripsModalProps> = ({
  isOpen,
  bookings,
  initialTab = 'all',
  onClose,
  onViewTicket,
  onCancelBooking,
  onPlanNewTrip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialTab);

  if (!isOpen) return null;

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = statusFilter === 'all' || b.status === statusFilter;
    const token = (b.journeyToken || b.id || '').toLowerCase();
    const bkgId = (b.bookingId || b.id || '').toLowerCase();
    const uId = (b.userId || b.user?.userId || '').toLowerCase();
    const dest = (b.to || '').toLowerCase();
    const orig = (b.from || '').toLowerCase();
    const name = (b.user?.fullName || '').toLowerCase();
    const phone = (b.user?.phone || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      token.includes(query) ||
      bkgId.includes(query) ||
      uId.includes(query) ||
      dest.includes(query) ||
      orig.includes(query) ||
      name.includes(query) ||
      phone.includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      
      <div className="relative w-full max-w-4xl my-8 bg-[#09090D] rounded-3xl border-2 border-[#D4AF37]/40 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#14120A] via-[#1A1810] to-[#0A0A0E] border-b border-[#D4AF37]/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-xl font-bold text-white">
                  My Trips & Bookings
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-mono-tech font-bold">
                  {bookings.length} Saved
                </span>
              </div>
              <div className="text-xs text-zinc-400 font-mono-tech">
                Verified Journey Token IDs & Boarding Passes
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-my-trips-btn"
            className="w-9 h-9 rounded-xl bg-[#14141B] hover:bg-[#20202A] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-6 bg-[#0C0C10] border-b border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Token, Booking ID, User ID, City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#14141A] text-white placeholder-zinc-500 pl-9 pr-3.5 py-2 rounded-xl border border-zinc-800 focus:border-[#D4AF37] text-xs font-mono-tech outline-none"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#14141A] border border-zinc-800 text-xs font-mono-tech">
            {['all', 'Confirmed', 'Pending', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

        </div>

        {/* Bookings List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <Sparkles className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h4 className="font-serif-luxury text-lg text-white mb-1">No Voyages Located</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
                No journey records match your search or filter.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onPlanNewTrip();
                }}
                className="px-6 py-2.5 rounded-xl gold-gradient-bg text-black font-mono-tech text-xs uppercase tracking-wider font-bold cursor-pointer"
              >
                Plan New Journey
              </button>
            </div>
          ) : (
            filteredBookings.map((b) => {
              const isConfirmed = b.status === 'Confirmed';
              const isCancelled = b.status === 'Cancelled';
              const people = Math.max(1, b.numberOfPeople || b.travelers || b.user?.numberOfPeople || b.user?.travelersCount || 1);
              const peopleLabel = people === 1 ? '1 Person' : `${people} People`;
              const finalAmount = b.finalTotal || b.pricing?.finalTotal || b.pricing?.total || 0;

              return (
                <div
                  key={b.id}
                  id={`booking-item-${b.id}`}
                  className="p-5 rounded-2xl bg-[#111116] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono-tech font-bold text-sm text-[#F3E5AB]">
                        {b.journeyToken || b.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase ${
                          isConfirmed
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                            : isCancelled
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                            : 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {b.status}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono-tech">
                        • User ID: {b.userId || b.user.userId || 'TGAI-USER'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-base font-serif-luxury font-bold text-white">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                      <span>{b.from}</span>
                      <span className="text-[#D4AF37]">➔</span>
                      <span className="text-[#F3E5AB]">{b.to}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono-tech text-zinc-400 pt-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <Car className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="truncate">{b.vehicle.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="truncate">
                          {b.hotel ? `${b.hotel.name} (${b.hotelNights}N)` : 'Transit Only'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{b.travelDate} at {b.travelTime || '08:00 AM'}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-500 font-mono-tech flex flex-wrap items-center gap-2 pt-1">
                      <span>Traveler: <strong className="text-zinc-300">{b.user.fullName}</strong></span>
                      <span>• People: <strong className="text-zinc-300">{peopleLabel}</strong></span>
                      <span>• Total: <strong className="text-[#D4AF37] font-bold">{formatINR(finalAmount)}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                    {isConfirmed && (
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all text-xs font-mono-tech flex items-center gap-1 cursor-pointer"
                        title="Cancel Journey"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Cancel</span>
                      </button>
                    )}

                    <button
                      onClick={() => onViewTicket(b)}
                      id={`view-ticket-btn-${b.id}`}
                      className="px-4 py-2.5 rounded-xl gold-gradient-bg text-black font-mono-tech text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 transition-all cursor-pointer"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>View Boarding Pass</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
};
