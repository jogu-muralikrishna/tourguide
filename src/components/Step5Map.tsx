import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Navigation, Compass, MapPin, Building2, Utensils, CheckCircle2, ArrowRight, ArrowLeft, ZoomIn, ZoomOut, RefreshCw, List, Map as MapIcon } from 'lucide-react';
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
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

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

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Custom Map Pins
    const startPinIcon = L.divIcon({
      className: 'start-map-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      html: `
        <div style="background: #0284c7; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #FFFFFF; box-shadow: 0 4px 12px rgba(2,132,199,0.5); display: flex; align-items: center; justify-content: center;">
          <div style="transform: rotate(45deg); color: #FFFFFF; font-size: 11px; font-weight: 800;">A</div>
        </div>
      `,
    });

    const destPinIcon = L.divIcon({
      className: 'dest-map-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      html: `
        <div style="background: #10B981; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #FFFFFF; box-shadow: 0 4px 12px rgba(16,185,129,0.5); display: flex; align-items: center; justify-content: center;">
          <div style="transform: rotate(45deg); color: #FFFFFF; font-size: 11px; font-weight: 800;">B</div>
        </div>
      `,
    });

    const startMarker = L.marker([startLat, startLng], { icon: startPinIcon }).addTo(map);
    startMarker.bindPopup(`<b>Departure: ${fromLocation}</b>`);

    const destMarker = L.marker([destLat, destLng], { icon: destPinIcon }).addTo(map);
    destMarker.bindPopup(`<b>Destination: ${toLocation}</b>`);

    if (routeData?.routeGeometry && routeData.routeGeometry.length > 0) {
      const routeLatLngs = routeData.routeGeometry.map(([lng, lat]) => [lat, lng] as [number, number]);
      const routeLine = L.polyline(routeLatLngs, {
        color: '#0284c7',
        weight: 5,
        opacity: 0.9,
      }).addTo(map);

      map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
    } else {
      const fallbackLine = L.polyline([[startLat, startLng], [destLat, destLng]], {
        color: '#0284c7',
        weight: 4,
        dashArray: '8, 8',
      }).addTo(map);
      map.fitBounds(fallbackLine.getBounds(), { padding: [40, 40] });
    }

    if (hotel) {
      const hotelIcon = L.divIcon({
        className: 'hotel-map-pin',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        html: `
          <div style="background: #F59E0B; width: 26px; height: 26px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #FFFFFF; display: flex; align-items: center; justify-content: center;">
            <div style="transform: rotate(45deg); color: #FFF; font-size: 10px; font-weight: bold;">H</div>
          </div>
        `,
      });
      L.marker([destLat + 0.015, destLng + 0.015], { icon: hotelIcon }).addTo(map).bindPopup(`<b>${hotel.name}</b>`);
    }

    pitstops.forEach((p, idx) => {
      const frac = (idx + 1) / (pitstops.length + 1);
      const foodIcon = L.divIcon({
        className: 'food-map-pin',
        iconSize: [26, 26],
        iconAnchor: [13, 26],
        html: `
          <div style="background: #EA580C; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #FFFFFF; display: flex; align-items: center; justify-content: center;">
            <div style="transform: rotate(45deg); color: #FFF; font-size: 9px; font-weight: bold;">F</div>
          </div>
        `,
      });
      L.marker([startLat + (destLat - startLat) * frac + 0.01, startLng + (destLng - startLng) * frac + 0.01], { icon: foodIcon }).addTo(map).bindPopup(`<b>${p.name}</b>`);
    });

    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [fromLocation, toLocation, routeData, hotel, pitstops]);

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Step 5 • Tactical Route Map</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
          Route Map
        </h2>
        <p className="text-[var(--text-muted)] text-sm">
          Interactive view of your departure, highway path, pitstops, and destination.
        </p>
      </div>

      {/* Mobile Toggle */}
      <div className="flex md:hidden justify-center gap-2 mb-2">
        <button
          onClick={() => setMobileView('map')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold ${
            mobileView === 'map' ? 'bg-sky-500 text-white' : 'ui-btn-secondary'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Map</span>
        </button>
        <button
          onClick={() => setMobileView('list')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold ${
            mobileView === 'list' ? 'bg-sky-500 text-white' : 'ui-btn-secondary'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>Itinerary List</span>
        </button>
      </div>

      {/* Split Desktop Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Itinerary Details (Visible on desktop or when mobileView === 'list') */}
        <div className={`md:col-span-5 space-y-3 ${mobileView === 'map' ? 'hidden md:block' : 'block'}`}>
          <div className="ui-card p-4">
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-3 flex items-center justify-between">
              <span>Trip Waypoints</span>
              <span className="text-xs text-sky-600 dark:text-sky-400">{distanceKm} km</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                <div className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-xs">A</div>
                <div>
                  <div className="font-bold text-[var(--text-primary)]">Departure: {fromLocation}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">Starting Point</div>
                </div>
              </div>

              {pitstops.map((p, i) => (
                <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-xs">F</div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)]">{p.name}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{p.cuisine} • Food Stop</div>
                  </div>
                </div>
              ))}

              {hotel && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs">H</div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)]">{hotel.name}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Hotel Stay</div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">B</div>
                <div>
                  <div className="font-bold text-[var(--text-primary)]">Destination: {toLocation}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">Arrival Point</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Map Box (Visible on desktop or when mobileView === 'map') */}
        <div className={`md:col-span-7 ${mobileView === 'list' ? 'hidden md:block' : 'block'}`}>
          <div className="relative rounded-2xl overflow-hidden ui-card h-[450px] shadow-lg">
            <div ref={mapContainerRef} className="w-full h-full z-0" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="ui-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onGoBack}
          className="ui-btn-secondary w-full sm:w-auto"
        >
          ← Back to Step 4
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="hidden md:flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Route Verified</span>
          </div>
          <button
            type="button"
            id="step5-next-btn"
            onClick={onContinue}
            className="ui-btn-primary w-full sm:w-auto"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
