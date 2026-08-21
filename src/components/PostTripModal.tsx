import React, { useState } from 'react';
import {
  Trophy,
  MapPin,
  Utensils,
  DollarSign,
  Compass,
  Star,
  CheckCircle2,
  X,
  Share2,
  Sparkles,
  ArrowRight,
  Bookmark,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Trip, PostTripSummary } from '../types';
import { CopilotService } from '../services/copilotService';
import { ExpenseService } from '../services/expenseService';
import { TripService } from '../services/tripService';

interface PostTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTrip?: Trip | null;
  onTripCompleted?: () => void;
}

export const PostTripModal: React.FC<PostTripModalProps> = ({
  isOpen,
  onClose,
  activeTrip,
  onTripCompleted,
}) => {
  const [copied, setCopied] = useState(false);
  const [memoryNotes, setMemoryNotes] = useState(
    'Explored historical citadels and enjoyed sunset dinners along the coast. Seamless route coordination!'
  );

  if (!isOpen) return null;

  const expensesTotal = activeTrip
    ? ExpenseService.getExpenses(activeTrip.id).reduce((sum, e) => sum + e.amount, 0)
    : 0;

  const summary: PostTripSummary = activeTrip
    ? CopilotService.generatePostTripSummary(activeTrip, expensesTotal)
    : {
        tripId: 'draft',
        title: 'Grand Expedition to Goa',
        destination: 'Goa',
        durationDays: 4,
        placesVisitedCount: 9,
        culinaryVisitedCount: 5,
        totalDistanceKm: 420,
        plannedBudget: 25000,
        recordedSpent: 21500,
        currency: '₹',
        favoriteActivities: ['Goa Historic Citadel & Heritage Fortress', 'Coastal Sunset Promenade', 'Artisan Village'],
        foodHighlights: ['Signature Seafood Thali', 'Kingfish Curry with Poi', 'Kokum Coconut Mocktail'],
        memoriesNotes: memoryNotes,
        recommendedNextDestinations: [
          {
            name: 'Kerala Backwaters & Munnar Hills',
            reason: 'Matches your affinity for coastal sunsets, authentic culinary heritage, and relaxed luxury.',
            matchScore: 96,
            bestSeason: 'October – March',
          },
          {
            name: 'Andaman & Nicobar Havelock Island',
            reason: 'Pristine coral waters, exclusive sanctuary villas, and high privacy rating.',
            matchScore: 92,
            bestSeason: 'November – April',
          },
        ],
      };

  const handleMarkCompleted = async () => {
    if (activeTrip?.id) {
      await TripService.updateTrip(activeTrip.id, {
        status: 'COMPLETED',
        mode: 'POST_TRIP',
        personalNotes: memoryNotes,
      });
      onTripCompleted?.();
    }
    onClose();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Expedition Debrief: ${summary.title} • Visited ${summary.placesVisitedCount} landmarks across ${summary.durationDays} days. Curated with TOURGUIDE AI!`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="post-trip-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-[#090910] border border-amber-500/40 rounded-2xl shadow-[0_0_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh] text-left"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 via-[#10101c] to-zinc-900 px-6 py-4 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury font-bold text-base text-zinc-100 uppercase tracking-wide">
                  POST-TRIP EXPEDITION DEBRIEF & MEMORY ARCHIVE
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono-tactical bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  VERIFIED LOG
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono-tactical">
                {summary.title} • {summary.durationDays} Days Completed
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 text-xs font-mono-tactical">
          {/* Key Metrics Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">Landmarks Visited</span>
              <span className="text-2xl font-serif-luxury font-bold text-amber-400 block mt-1">
                {summary.placesVisitedCount}
              </span>
              <span className="text-[9px] text-zinc-500">Verified POIs</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">Culinary Stops</span>
              <span className="text-2xl font-serif-luxury font-bold text-amber-400 block mt-1">
                {summary.culinaryVisitedCount}
              </span>
              <span className="text-[9px] text-zinc-500">Authentic dining</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">Total Distance</span>
              <span className="text-2xl font-serif-luxury font-bold text-zinc-100 block mt-1">
                {summary.totalDistanceKm} km
              </span>
              <span className="text-[9px] text-zinc-500">Traversed</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">Actual Spend / Budget</span>
              <span className="text-2xl font-serif-luxury font-bold text-emerald-400 block mt-1">
                {summary.currency}{summary.recordedSpent.toLocaleString()}
              </span>
              <span className="text-[9px] text-zinc-500">of {summary.currency}{summary.plannedBudget.toLocaleString()}</span>
            </div>
          </div>

          {/* Highlights & Memories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                ⭐ TOP EXPEDITION HIGHLIGHTS
              </span>
              <ul className="space-y-1.5 pt-1">
                {summary.favoriteActivities.map((act, i) => (
                  <li key={i} className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                ✍️ TRAVEL JOURNAL & MEMORY NOTES
              </span>
              <textarea
                value={memoryNotes}
                onChange={(e) => setMemoryNotes(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs focus:border-amber-400 focus:outline-none"
                placeholder="Log your thoughts on this trip..."
              />
            </div>
          </div>

          {/* Future AI Destination Recommendations */}
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-3">
              ✨ RECOMMENDED NEXT EXPEDITIONS (BASED ON YOUR TRAVEL STYLE)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {summary.recommendedNextDestinations.map((rec, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif-luxury font-bold text-sm text-zinc-100">{rec.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {rec.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">{rec.reason}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Prime Season: <strong className="text-zinc-300">{rec.bestSeason}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1.5 cursor-pointer transition-all border border-zinc-700"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied to Clipboard!' : 'Share Expedition Summary'}</span>
            </button>

            <button
              onClick={handleMarkCompleted}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow cursor-pointer transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Archive & Mark Completed</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
