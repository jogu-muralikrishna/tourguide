import React, { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, Check, X } from 'lucide-react';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onAllowLocation: (coords?: { lat: number; lng: number }) => void;
  onDenyLocation: () => void;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onAllowLocation,
  onDenyLocation,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAllow = () => {
    setIsLocating(true);
    setNotice(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          onAllowLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          setIsLocating(false);
          console.warn('Geolocation error:', err.message);
          // Fallback allowed anyway
          onAllowLocation();
        },
        { timeout: 6000, enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
      onAllowLocation();
    }
  };

  const handleNotNow = () => {
    onDenyLocation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#D4AF37]/40 shadow-[0_0_60px_rgba(0,0,0,0.9)] relative text-center">
        
        {/* Animated GPS Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 border-2 border-[#D4AF37] text-[#D4AF37] mx-auto flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
          <Navigation className="w-8 h-8 animate-pulse" />
        </div>

        {/* Title & Description */}
        <h3 className="font-serif-luxury text-2xl font-bold text-white mb-2">
          Allow Location Access?
        </h3>
        <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">
          TOURGUIDE AI uses your location to calculate real highway distances, show live route waypoints, and find the closest available cars.
        </p>

        {notice && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-mono-tech">
            {notice}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            id="allow-location-btn"
            disabled={isLocating}
            onClick={handleAllow}
            className="w-full py-3.5 px-6 rounded-xl gold-gradient-bg text-black font-bold font-mono-tech text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:shadow-[0_0_35px_rgba(212,175,55,0.65)] transition-all cursor-pointer disabled:opacity-50"
          >
            {isLocating ? (
              <span>Detecting Location...</span>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Allow Location</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="deny-location-btn"
            disabled={isLocating}
            onClick={handleNotNow}
            className="w-full py-3 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white font-mono-tech text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Not Now</span>
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-center gap-1.5 text-[11px] font-mono-tech text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Location is only used for travel routing and not shared</span>
        </div>

      </div>
    </div>
  );
};
