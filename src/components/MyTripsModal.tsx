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
  Sparkles,
  Trash2
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
      
      <div className="relative w-full max-w-4xl my-8 ui-card-luxury shadow-[0_10px_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[85vh] border-2 border-[#D4AF37]/30">
        
        {/* Header */}
        <div className="p-5 bg-[#0b0b12] border-b border-[#D4AF37]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gold-gradient-bg text-black flex items-center justify-center shadow-xs">
              <Luggage className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white font-serif-luxury">
                  My Trips
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F3E5AB] text-xs font-bold font-mono-tech">
                  {bookings.length} Saved
                </span>
              </div>
              <div className="text-xs text-zinc-400">
                Manage your saved and confirmed trips
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-my-trips-btn"
            className="p-1.5 rounded-xl hover:bg-[#181824] text-zinc-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5 text-[#D4AF37]" />
          </button>
        </div>

        {/* Filter & Search */}
        <div className="p-4 bg-[#0a0a0f] border-b border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search token, city, traveler..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ui-input w-full pl-9 text-xs bg-[#12121b] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#12121b] p-1 rounded-xl border border-[#D4AF37]/20 text-xs">
            {['all', 'Confirmed', 'Pending', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'gold-gradient-bg text-black font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-[#07070a]">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
              <h4 className="font-bold text-base text-white mb-1 font-serif-luxury">No trips found</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
                No trips match your current filter criteria.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onPlanNewTrip();
                }}
                className="ui-btn-primary py-2.5 px-5 text-xs font-bold"
              >
                Plan New Trip
              </button>
            </div>
          ) : (
            filteredBookings.map((b) => {
              const isConfirmed = b.status === 'Confirmed';
              const isCancelled = b.status === 'Cancelled';
              const people = Math.max(1, b.numberOfPeople || b.travelers || b.user?.numberOfPeople || 1);
              const peopleLabel = people === 1 ? '1 Person' : `${people} People`;
              const finalAmount = b.finalTotal || b.pricing?.finalTotal || b.pricing?.total || 0;

              return (
                <div
                  key={b.id}
                  id={`booking-item-${b.id}`}
                  className="p-5 rounded-2xl bg-[#0e0e15] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 hover:bg-[#141420] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs text-[#F3E5AB] font-mono-tech">
                        {b.journeyToken || b.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          isConfirmed
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                            : isCancelled
                            ? 'bg-rose-950/60 border-rose-500/40 text-rose-400'
                            : 'bg-amber-950/60 border-amber-500/40 text-[#F3E5AB]'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-base font-bold text-white font-serif-luxury">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                      <span>{b.from}</span>
                      <span className="text-[#D4AF37]">➔</span>
                      <span>{b.to}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-zinc-400 pt-1 font-mono-tech">
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
                        <span>{b.travelDate} at {b.travelTime || '08:00'}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-2 pt-1">
                      <span>Traveler: <strong className="text-white">{b.user.fullName}</strong></span>
                      <span>• People: <strong className="text-white">{peopleLabel}</strong></span>
                      <span>• Total: <strong className="text-[#F3E5AB] font-mono-tech font-bold">{formatINR(finalAmount)}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D4AF37]/15">
                    {isConfirmed && (
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
                        title="Cancel Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onViewTicket(b)}
                      id={`view-ticket-btn-${b.id}`}
                      className="ui-btn-primary py-2 px-3.5 text-xs font-bold"
                    >
                      <Ticket className="w-3.5 h-3.5 text-black" />
                      <span>View Voucher</span>
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
