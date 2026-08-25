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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      
      <div className="relative w-full max-w-4xl my-8 ui-card shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-[var(--text-primary)]">
                  My Trips
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold">
                  {bookings.length} Saved
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                Manage your saved and confirmed trips
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-my-trips-btn"
            className="p-1.5 rounded-xl hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search */}
        <div className="p-4 bg-[var(--bg-surface)] border-b border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search token, city, traveler..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ui-input w-full pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1 bg-[var(--bg-surface-elevated)] p-1 rounded-xl border border-[var(--border-color)] text-xs">
            {['all', 'Confirmed', 'Pending', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-sky-500 text-white font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
            <div className="text-center py-12">
              <Sparkles className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <h4 className="font-bold text-base text-[var(--text-primary)] mb-1">No trips found</h4>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mb-4">
                No trips match your current filter criteria.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onPlanNewTrip();
                }}
                className="ui-btn-primary py-2 px-4 text-xs"
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
                  className="p-5 rounded-2xl ui-card ui-card-hover flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs text-sky-600 dark:text-sky-400">
                        {b.journeyToken || b.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isConfirmed
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : isCancelled
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
                      <MapPin className="w-4 h-4 text-sky-500" />
                      <span>{b.from}</span>
                      <span className="text-sky-500">➔</span>
                      <span>{b.to}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[var(--text-muted)] pt-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <Car className="w-3.5 h-3.5 text-sky-500" />
                        <span className="truncate">{b.vehicle.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-sky-500" />
                        <span className="truncate">
                          {b.hotel ? `${b.hotel.name} (${b.hotelNights}N)` : 'Transit Only'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-sky-500" />
                        <span>{b.travelDate} at {b.travelTime || '08:00'}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[var(--text-muted)] flex flex-wrap items-center gap-2 pt-1">
                      <span>Traveler: <strong className="text-[var(--text-primary)]">{b.user.fullName}</strong></span>
                      <span>• People: <strong className="text-[var(--text-primary)]">{peopleLabel}</strong></span>
                      <span>• Total: <strong className="text-sky-600 dark:text-sky-400 font-bold">{formatINR(finalAmount)}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border-color)]">
                    {isConfirmed && (
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                        title="Cancel Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onViewTicket(b)}
                      id={`view-ticket-btn-${b.id}`}
                      className="ui-btn-primary py-2 px-3.5 text-xs"
                    >
                      <Ticket className="w-3.5 h-3.5" />
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
