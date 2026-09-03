import React, { useState } from 'react';
import { Star, X, CheckCircle, Car, Building2, MessageSquare } from 'lucide-react';
import { Booking } from '../types';
import { submitPartnerReviewApi } from '../services/api';

interface CustomerRatingModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const CustomerRatingModal: React.FC<CustomerRatingModalProps> = ({
  isOpen,
  booking,
  onClose,
  onSubmitSuccess,
}) => {
  const [agencyRating, setAgencyRating] = useState<number>(5);
  const [agencyReviewText, setAgencyReviewText] = useState('');
  
  const [hotelRating, setHotelRating] = useState<number>(5);
  const [hotelReviewText, setHotelReviewText] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const tripToken = booking.tripToken || booking.journeyToken || booking.id;
  const customerName = booking.user?.fullName || 'Ammu';
  const customerEmail = booking.user?.email || 'ammu@gmail.com';

  const agencyName = booking.vehicle?.agencyName || 'Royal Fleet Travels';
  const agencyId = booking.vehicle?.agencyId || 'agency-royal-fleet';

  const hotelName = booking.hotel?.name || 'The Leela Palace';
  const hotelId = booking.hotel?.id || 'hotel-leela-palace';

  const handleSubmitReviews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Submit Agency Review
      await submitPartnerReviewApi({
        tripToken,
        bookingId: booking.bookingId || booking.id,
        customerName,
        customerEmail,
        partnerType: 'TRAVEL_AGENCY',
        partnerId: agencyId,
        partnerName: agencyName,
        vehicleName: booking.vehicle?.name,
        rating: agencyRating,
        reviewText: agencyReviewText.trim() || 'Great vehicle service and driver experience!',
      });

      // 2. Submit Hotel Review if Hotel was booked
      if (booking.hotel) {
        await submitPartnerReviewApi({
          tripToken,
          bookingId: booking.bookingId || booking.id,
          customerName,
          customerEmail,
          partnerType: 'HOTEL',
          partnerId: hotelId,
          partnerName: hotelName,
          roomNumber: booking.assignedRoomNumber || 'Room 101',
          rating: hotelRating,
          reviewText: hotelReviewText.trim() || 'Wonderful stay and hospitality!',
        });
      }

      booking.reviewSubmitted = true;
      alert('Thank you! Your ratings & reviews have been submitted to the partner dashboards.');
      onSubmitSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to submit reviews.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0b10] border-2 border-[#D4AF37]/50 rounded-2xl p-6 max-w-lg w-full space-y-5 font-mono-tech shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-lg font-serif-luxury">Rate Your Completed Travel Experience</h3>
            <span className="text-xs text-sky-400 font-mono">Trip Token: {tripToken}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitReviews} className="space-y-4">
          
          {/* SECTION 1: TRAVEL AGENCY RATING */}
          <div className="p-4 rounded-xl bg-[#12121A] border border-sky-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase">
                <Car className="w-4 h-4" />
                <span>Travel Agency: {agencyName}</span>
              </div>
              <div className="text-xs text-zinc-400">Vehicle: {booking.vehicle?.name}</div>
            </div>

            <div>
              <label className="block text-xs text-zinc-300 font-semibold mb-1">Rate Vehicle & Driver Experience (1 to 5 Stars)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setAgencyRating(star)}
                    className={`p-1 text-xl transition-all cursor-pointer ${
                      star <= agencyRating ? 'text-amber-400 scale-110' : 'text-zinc-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-400 ml-2">{agencyRating} / 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Write Optional Travel Review</label>
              <textarea
                rows={2}
                placeholder="How was the car condition, driver punctuality, and highway journey?"
                value={agencyReviewText}
                onChange={(e) => setAgencyReviewText(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs"
              />
            </div>
          </div>

          {/* SECTION 2: HOTEL RATING IF BOOKED */}
          {booking.hotel && (
            <div className="p-4 rounded-xl bg-[#12121A] border border-[#D4AF37]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase">
                  <Building2 className="w-4 h-4" />
                  <span>Hotel Stay: {hotelName}</span>
                </div>
                <div className="text-xs text-zinc-400">Room: {booking.assignedRoomNumber || 'Deluxe'}</div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-semibold mb-1">Rate Hotel Stay & Cleanliness (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setHotelRating(star)}
                      className={`p-1 text-xl transition-all cursor-pointer ${
                        star <= hotelRating ? 'text-amber-400 scale-110' : 'text-zinc-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-2">{hotelRating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Write Optional Hotel Review</label>
                <textarea
                  rows={2}
                  placeholder="How was room cleanliness, service, and stay comfort?"
                  value={hotelReviewText}
                  onChange={(e) => setHotelReviewText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold uppercase text-xs">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl gold-gradient-bg text-black font-bold uppercase text-xs shadow-md cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating & Review'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
