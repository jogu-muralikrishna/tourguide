import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Navigation, Compass, MapPin, Building2, Utensils, CheckCircle2, ArrowRight, ArrowLeft, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { Vehicle, Hotel, Pitstop, RouteData } from '../types';

interface Step5MapProps {
  fromLocation: string;
  toLocation: string;
  distanceKm: number;
  travelTime?: string;
  routeData?: RouteData | null;
  userLiveLocation?: { lat: number; lng: number; accuracy?: number } | null;
  vehicle: Vehicle | null;
  hotel: Hotel | null;
  pitstops: Pitstop[];
  onContinue: () => void;
  onGoBack: () => void;
}

export const Step5Map: React.FC<Step5MapProps> = ({
  fromLocation,
  toLocation,
  distanceKm,
  travelTime,
  routeData,
  userLiveLocation,
  vehicle,
  hotel,
  pitstops,
  onContinue,
  onGoBack,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center (India)
    const startLat = routeData?.originCoordinates?.lat || 17.385;
    const startLng = routeData?.originCoordinates?.lng || 78.4867;
    const destLat = routeData?.destinationCoordinates?.lat || 17.2473;
    const destLng = routeData?.destinationCoordinates?.lng || 80.1514;

    const centerLat = (startLat + destLat) / 2;
    const centerLng = (startLng + destLng) / 2;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 7,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark-themed tiles from CartoDB or OpenStreetMap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Custom Styled Gold Start Pin
    const startPinIcon = L.divIcon({
      className: 'start-map-pin',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
      html: `
        <div style="background: #D4AF37; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #FFFFFF; box-shadow: 0 0 15px rgba(212,175,55,0.7); display: flex; align-items: center; justify-content: center;">
          <div style="transform: rotate(45deg); color: #050505; font-size: 11px; font-weight: 800; font-family: monospace;">A</div>
        </div>
      `,
    });

    // Custom Styled Emerald Destination Pin
    const destPinIcon = L.divIcon({
      className: 'dest-map-pin',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
      html: `
        <div style="background: #10B981; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #FFFFFF; box-shadow: 0 0 15px rgba(16,185,129,0.7); display: flex; align-items: center; justify-content: center;">
          <div style="transform: rotate(45deg); color: #FFFFFF; font-size: 11px; font-weight: 800; font-family: monospace;">B</div>
        </div>
      `,
    });

    // Start Marker
    const startMarker = L.marker([startLat, startLng], { icon: startPinIcon }).addTo(map);
    startMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px; color: #111;">
        <strong style="color: #AA8222;">Departure Location</strong>
        <div style="font-size: 13px; font-weight: bold; margin-top: 2px;">${fromLocation}</div>
      </div>
    `);

    // Destination Marker
    const destMarker = L.marker([destLat, destLng], { icon: destPinIcon }).addTo(map);
    destMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px; color: #111;">
        <strong style="color: #059669;">Destination</strong>
        <div style="font-size: 13px; font-weight: bold; margin-top: 2px;">${toLocation}</div>
      </div>
    `);

    const latLngBounds: [number, number][] = [
      [startLat, startLng],
      [destLat, destLng],
    ];

    // Real Route Polyline
    if (routeData?.routeGeometry && routeData.routeGeometry.length > 0) {
      const routeLatLngs = routeData.routeGeometry.map(([lng, lat]) => [lat, lng] as [number, number]);
      const routeLine = L.polyline(routeLatLngs, {
        color: '#D4AF37',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Glow border underlay
      L.polyline(routeLatLngs, {
        color: '#F3E5AB',
        weight: 9,
        opacity: 0.3,
      }).addTo(map);

      map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
    } else {
      // Fallback straight-line polyline if geometry wasn't available
      const fallbackLine = L.polyline(latLngBounds, {
        color: '#D4AF37',
        weight: 4,
        dashArray: '8, 8',
      }).addTo(map);
      map.fitBounds(fallbackLine.getBounds(), { padding: [40, 40] });
    }

    // Hotel Marker if selected
    if (hotel) {
      const hotelLat = destLat + 0.015;
      const hotelLng = destLng + 0.015;
      const hotelIcon = L.divIcon({
        className: 'hotel-map-pin',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        html: `
          <div style="background: #F59E0B; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #FFFFFF; box-shadow: 0 0 12px rgba(245,158,11,0.7); display: flex; align-items: center; justify-content: center;">
            <div style="transform: rotate(45deg); color: #000; font-size: 10px; font-weight: bold;">H</div>
          </div>
        `,
      });
      const hMarker = L.marker([hotelLat, hotelLng], { icon: hotelIcon }).addTo(map);
      hMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; color: #111;">
          <strong style="color: #D97706;">Hotel Stay</strong>
          <div style="font-size: 13px; font-weight: bold;">${hotel.name}</div>
          <div style="font-size: 11px; color: #666;">₹${hotel.pricePerNight.toLocaleString('en-IN')}/night</div>
        </div>
      `);
    }

    // Food Stops Markers if selected
    pitstops.forEach((p, idx) => {
      const frac = (idx + 1) / (pitstops.length + 1);
      const pLat = startLat + (destLat - startLat) * frac + 0.01;
      const pLng = startLng + (destLng - startLng) * frac + 0.01;
      const foodIcon = L.divIcon({
        className: 'food-map-pin',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        html: `
          <div style="background: #EA580C; width: 26px; height: 26px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #FFFFFF; box-shadow: 0 0 10px rgba(234,88,12,0.7); display: flex; align-items: center; justify-content: center;">
            <div style="transform: rotate(45deg); color: #FFF; font-size: 9px; font-weight: bold;">F</div>
          </div>
        `,
      });
      const fMarker = L.marker([pLat, pLng], { icon: foodIcon }).addTo(map);
      fMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; color: #111;">
          <strong style="color: #EA580C;">Food Stop</strong>
          <div style="font-size: 13px; font-weight: bold;">${p.name}</div>
          <div style="font-size: 11px; color: #666;">₹${p.price} • ${p.cuisine}</div>
        </div>
      `);
    });

    // Live Device Location if permission granted
    if (userLiveLocation) {
      const liveIcon = L.divIcon({
        className: 'live-gps-pin',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        html: `
          <div style="position: relative; width: 22px; height: 22px;">
            <div style="position: absolute; width: 22px; height: 22px; background: rgba(59, 130, 246, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; top: 4px; left: 4px; width: 14px; height: 14px; background: #3B82F6; border: 2px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 10px #3B82F6;"></div>
          </div>
        `,
      });
      const gpsMarker = L.marker([userLiveLocation.lat, userLiveLocation.lng], { icon: liveIcon }).addTo(map);
      gpsMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; color: #111;">
          <strong style="color: #2563EB;">Your Current Location</strong>
          <div style="font-size: 11px; color: #666;">Accuracy: ±${Math.round(userLiveLocation.accuracy || 15)}m</div>
        </div>
      `);
    }

    mapInstanceRef.current = map;
    setMapLoaded(true);

    // Resize observer to ensure full container fit
    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [fromLocation, toLocation, routeData, hotel, pitstops, userLiveLocation]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current && routeData?.routeGeometry && routeData.routeGeometry.length > 0) {
      const routeLatLngs = routeData.routeGeometry.map(([lng, lat]) => [lat, lng] as [number, number]);
      mapInstanceRef.current.fitBounds(L.latLngBounds(routeLatLngs), { padding: [40, 40] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F3E5AB] text-xs font-mono-tech uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Step 5 • Interactive Route Map</span>
        </div>
        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white tracking-wide">
          Your Route on Map
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm">
          Interactive map previewing your departure, highway route, stops, and destination.
        </p>
      </div>

      {/* Main Map Box */}
      <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/30 bg-[#07070B] shadow-[0_0_50px_rgba(0,0,0,0.8)] h-[440px] sm:h-[500px]">
        {/* Leaflet DOM container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Map Top Floating Overlay: Route Stats */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="glass-panel py-2 px-4 rounded-2xl border border-[#D4AF37]/30 flex items-center gap-4 text-xs font-mono-tech shadow-xl pointer-events-auto">
            <div>
              <div className="text-zinc-400 text-[10px] uppercase">Route</div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="text-[#D4AF37]">{fromLocation}</span>
                <span className="text-zinc-500">→</span>
                <span className="text-emerald-400">{toLocation}</span>
              </div>
            </div>
            <div className="h-6 w-px bg-zinc-800" />
            <div>
              <div className="text-zinc-400 text-[10px] uppercase">Driving Distance</div>
              <div className="font-bold text-[#F3E5AB]">{distanceKm} km</div>
            </div>
            {travelTime && (
              <>
                <div className="h-6 w-px bg-zinc-800" />
                <div>
                  <div className="text-zinc-400 text-[10px] uppercase">Travel Time</div>
                  <div className="font-bold text-white">{travelTime}</div>
                </div>
              </>
            )}
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleRecenter}
              title="Recenter Route"
              className="p-2.5 rounded-xl bg-black/80 hover:bg-black border border-[#D4AF37]/30 text-zinc-300 hover:text-[#D4AF37] transition-all shadow-lg cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-2.5 rounded-xl bg-black/80 hover:bg-black border border-[#D4AF37]/30 text-zinc-300 hover:text-[#D4AF37] transition-all shadow-lg cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-2.5 rounded-xl bg-black/80 hover:bg-black border border-[#D4AF37]/30 text-zinc-300 hover:text-[#D4AF37] transition-all shadow-lg cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Map Legend Overlay at Bottom */}
        <div className="absolute bottom-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="glass-panel py-2 px-3 rounded-xl border border-zinc-800/80 flex items-center gap-3 text-[11px] font-mono-tech text-zinc-300 shadow-xl pointer-events-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
              <span>Start: {fromLocation}</span>
            </div>
            {hotel && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Hotel: {hotel.name}</span>
              </div>
            )}
            {pitstops.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span>{pitstops.length} Food Stop{pitstops.length > 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>End: {toLocation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Trip Components Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl glass-panel border border-[#D4AF37]/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-bold">
            🚗
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">Selected Car</div>
            <div className="font-semibold text-white text-sm truncate">{vehicle?.name || 'Standard Car'}</div>
            <div className="text-xs text-[#D4AF37] font-mono-tech font-bold">₹{vehicle?.price.toLocaleString('en-IN') || 0}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[#D4AF37]/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">Hotel Selection</div>
            <div className="font-semibold text-white text-sm truncate">{hotel ? hotel.name : 'No Hotel Selected'}</div>
            <div className="text-xs text-amber-400 font-mono-tech font-bold">{hotel ? `₹${hotel.pricePerNight.toLocaleString('en-IN')}/night` : '₹0'}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-[#D4AF37]/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold">
            <Utensils className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">Food Stops</div>
            <div className="font-semibold text-white text-sm truncate">
              {pitstops.length > 0 ? `${pitstops.length} Selected` : 'No Food Stop Selected'}
            </div>
            <div className="text-xs text-orange-400 font-mono-tech font-bold">
              ₹{pitstops.reduce((s, p) => s + p.price, 0).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner & Action Navigation */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono-tech text-emerald-400 uppercase font-semibold">Step Completed</div>
            <div className="text-sm font-semibold text-white">Route & Stops Verified on Map</div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onGoBack}
            className="flex-1 sm:flex-none py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono-tech text-xs uppercase font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            type="button"
            id="step5-next-btn"
            onClick={onContinue}
            className="flex-1 sm:flex-none py-3 px-7 rounded-xl gold-gradient-bg text-black font-bold font-mono-tech text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:shadow-[0_0_35px_rgba(212,175,55,0.65)] transition-all cursor-pointer"
          >
            <span>Next Step: Your Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
