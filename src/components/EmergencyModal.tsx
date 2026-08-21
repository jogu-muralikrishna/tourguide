import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  X,
  Hospital,
  Pill,
  Shield,
  ExternalLink,
  Search,
  Navigation,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EmergencyFacility } from '../types';
import { EmergencyService, VERIFIED_HELPLINES } from '../services/emergencyService';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination?: string;
  coords?: { latitude: number; longitude: number };
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  destination = 'Goa',
  coords,
}) => {
  const [facilities, setFacilities] = useState<EmergencyFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      EmergencyService.getNearbyEmergencyFacilities(destination, coords)
        .then((res) => {
          setFacilities(res);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [isOpen, destination, coords]);

  if (!isOpen) return null;

  const filtered =
    filterType === 'ALL'
      ? facilities
      : facilities.filter((f) => f.type === filterType);

  return (
    <div
      id="emergency-sos-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-[#090910] border border-red-500/40 rounded-2xl shadow-[0_0_90px_rgba(239,68,68,0.25)] overflow-hidden flex flex-col max-h-[90vh] text-left"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-950 px-6 py-4 border-b border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury font-bold text-base text-zinc-100 uppercase tracking-wide">
                  EMERGENCY SOS & IMMEDIATE TRAVEL ASSIST
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono-tactical bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                  24/7 ACTIVE
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono-tactical">
                Verified Emergency Facilities & Direct Dispatch for {destination}
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
          {/* Universal Helplines Grid */}
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-3">
              🚨 NATIONAL UNIVERSAL DISPATCH HELPLINES
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {VERIFIED_HELPLINES.map((line, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-zinc-950 border border-red-500/20 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] text-zinc-400 block">{line.name}</span>
                    <span className="text-xl font-bold font-serif-luxury text-red-400 block mt-0.5">
                      {line.number}
                    </span>
                    <span className="text-[9px] text-zinc-500">{line.purpose}</span>
                  </div>

                  <a
                    href={`tel:${line.number}`}
                    className="p-3 rounded-xl bg-red-500 hover:bg-red-400 text-zinc-950 font-bold flex items-center justify-center transition-all cursor-pointer shadow-lg"
                    title={`Call ${line.number}`}
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Emergency Facilities */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                🏥 NEARBY VERIFIED EMERGENCY FACILITIES ({destination})
              </span>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                {['ALL', 'HOSPITAL', 'PHARMACY', 'POLICE'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] transition-all cursor-pointer ${
                      filterType === type
                        ? 'bg-red-500 text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-zinc-500">
                Querying verified emergency facilities...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filtered.map((fac) => (
                  <div
                    key={fac.id}
                    className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-red-500/40 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-700 text-zinc-300">
                          {fac.type} {fac.isOpen24h && '• 24/7'}
                        </span>
                        <span className="text-[10px] text-amber-400 font-bold">
                          ~{fac.distanceKm} km away
                        </span>
                      </div>

                      <h4 className="font-serif-luxury text-sm font-bold text-zinc-100 pt-1">
                        {fac.name}
                      </h4>

                      <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0 text-zinc-500" />
                        <span>{fac.address}</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between gap-2">
                      <a
                        href={`tel:${fac.phone}`}
                        className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call: {fac.phone}</span>
                      </a>

                      {fac.coordinates && (
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${fac.coordinates.latitude}&mlon=${fac.coordinates.longitude}#map=16/${fac.coordinates.latitude}/${fac.coordinates.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Navigation className="w-3.5 h-3.5 text-amber-400" />
                          <span>GPS Route</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
