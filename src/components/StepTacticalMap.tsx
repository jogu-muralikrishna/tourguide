import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Navigation,
  MapPin,
  ExternalLink,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  ArrowRight,
  Radio,
  Layers,
  Sparkles,
  Share2,
  Copy,
  Check,
  Eye,
  Route,
} from 'lucide-react';
import L from 'leaflet';
import { RouteState, Pitstop, SanctuaryHotel, WeatherData } from '../types';
import { INITIAL_WEATHER } from '../data/mockData';

interface StepTacticalMapProps {
  route: RouteState;
  selectedPitstops: Pitstop[];
  selectedSanctuary: SanctuaryHotel | null;
  onContinue: () => void;
}

export const StepTacticalMap: React.FC<StepTacticalMapProps> = ({
  route,
  selectedPitstops,
  selectedSanctuary,
  onContinue,
}) => {
  const [weather, setWeather] = useState<WeatherData>((route as any).weather || INITIAL_WEATHER);
  const [mapMode, setMapMode] = useState<'TACTICAL_RADAR' | 'GOOGLE_MAPS_EMBED'>('TACTICAL_RADAR');
  const [copiedLink, setCopiedLink] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Synchronize weather from route or target city
  useEffect(() => {
    if ((route as any).weather) {
      setWeather((route as any).weather);
    } else {
      const targetCity = selectedSanctuary?.location?.split(',')[0] || route.destination?.split(',')[0] || 'Goa';
      setWeather((prev) => ({
        ...prev,
        city: targetCity,
      }));
    }
  }, [route.destination, selectedSanctuary]);

  const originLat = route.originCoordinates?.latitude || route.originCoordinates?.lat || 17.385;
  const originLng = route.originCoordinates?.longitude || route.originCoordinates?.lng || 78.4866;
  const destLat = route.destinationCoordinates?.latitude || route.destinationCoordinates?.lat || 15.2993;
  const destLng = route.destinationCoordinates?.longitude || route.destinationCoordinates?.lng || 74.1239;

  // Initialize and update Leaflet interactive map when in TACTICAL_RADAR mode
  useEffect(() => {
    if (mapMode !== 'TACTICAL_RADAR') return;
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [(originLat + destLat) / 2, (originLng + destLng) / 2],
        zoom: 6,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Dark Matter tiles for luxury night theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom zoom control
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Origin Icon
      const originIcon = L.divIcon({
        className: 'custom-leaflet-icon',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="width: 28px; height: 28px; border-radius: 9999px; background: #f59e0b; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(245,158,11,0.9); color: #09090b; font-weight: bold; font-size: 11px;">
              ▲
            </div>
            <div style="margin-top: 4px; padding: 2px 6px; background: rgba(0,0,0,0.85); border: 1px solid rgba(245,158,11,0.5); border-radius: 4px; color: #fbbf24; font-size: 10px; font-family: monospace; white-space: nowrap; font-weight: bold;">
              ${route.origin || 'Origin'}
            </div>
          </div>
        `,
        iconSize: [80, 50],
        iconAnchor: [40, 20],
      });

      // Destination Icon
      const destIcon = L.divIcon({
        className: 'custom-leaflet-icon',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="width: 32px; height: 32px; border-radius: 9999px; background: #10b981; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 25px rgba(16,185,129,0.9); color: #09090b; font-weight: bold; font-size: 14px;">
              ★
            </div>
            <div style="margin-top: 4px; padding: 2px 6px; background: rgba(0,0,0,0.85); border: 1px solid rgba(16,185,129,0.5); border-radius: 4px; color: #6ee7b7; font-size: 10px; font-family: monospace; white-space: nowrap; font-weight: bold;">
              ${selectedSanctuary?.name || route.destination || 'Sanctuary'}
            </div>
          </div>
        `,
        iconSize: [100, 55],
        iconAnchor: [50, 24],
      });

      const originMarker = L.marker([originLat, originLng], { icon: originIcon }).addTo(map);
      originMarker.bindPopup(`<b>Departure:</b> ${route.origin || 'Origin'}`);

      const destMarker = L.marker([destLat, destLng], { icon: destIcon }).addTo(map);
      destMarker.bindPopup(`<b>Destination:</b> ${selectedSanctuary?.name || route.destination}`);

      // Pitstop Waypoints
      const latlngs: [number, number][] = [[originLat, originLng]];

      selectedPitstops.forEach((p, idx) => {
        const pLat = originLat + (destLat - originLat) * ((idx + 1) / (selectedPitstops.length + 1)) + (idx % 2 === 0 ? 0.2 : -0.2);
        const pLng = originLng + (destLng - originLng) * ((idx + 1) / (selectedPitstops.length + 1)) + (idx % 2 === 0 ? -0.2 : 0.2);
        latlngs.push([pLat, pLng]);

        const pitstopIcon = L.divIcon({
          className: 'custom-leaflet-icon',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
              <div style="width: 22px; height: 22px; border-radius: 9999px; background: #fbbf24; border: 1.5px solid #ffffff; display: flex; align-items: center; justify-content: center; color: #000; font-size: 10px; font-weight: bold; box-shadow: 0 0 12px rgba(251,191,36,0.8);">
                ${idx + 1}
              </div>
              <div style="margin-top: 2px; padding: 1px 4px; background: rgba(0,0,0,0.85); border: 1px solid #3f3f46; border-radius: 3px; color: #d4d4d8; font-size: 9px; font-family: monospace; white-space: nowrap;">
                ${p.name.split(' ')[0]}
              </div>
            </div>
          `,
          iconSize: [60, 40],
          iconAnchor: [30, 15],
        });

        L.marker([pLat, pLng], { icon: pitstopIcon }).addTo(map).bindPopup(`<b>Waypoint ${idx + 1}:</b> ${p.name}`);
      });

      latlngs.push([destLat, destLng]);

      // Glowing Polyline
      L.polyline(latlngs, {
        color: '#f59e0b',
        weight: 4,
        opacity: 0.9,
        dashArray: '8, 6',
      }).addTo(map);

      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [40, 40] });

      mapInstanceRef.current = map;
    } catch (err) {
      console.warn('Leaflet map initialization:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapMode, originLat, originLng, destLat, destLng, selectedPitstops, route.origin, route.destination, selectedSanctuary]);

  // Construct precise Google Maps directions URL
  const getGoogleMapsDirectionsUrl = () => {
    const origin = encodeURIComponent(route.origin || 'Hyderabad, India');
    const destination = encodeURIComponent(
      selectedSanctuary ? `${selectedSanctuary.name}, ${selectedSanctuary.location}` : route.destination || 'Goa, India'
    );

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    if (selectedPitstops.length > 0) {
      const waypoints = selectedPitstops
        .map((p) => encodeURIComponent(p.location?.split('•')[0].trim() || p.name))
        .join('|');
      url += `&waypoints=${waypoints}`;
    }

    return url;
  };

  const handleLaunchGoogleMaps = () => {
    const url = getGoogleMapsDirectionsUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMapLink = () => {
    const url = getGoogleMapsDirectionsUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Google Maps Embed URL
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    selectedSanctuary ? `${selectedSanctuary.name}, ${selectedSanctuary.location}` : route.destination || 'Goa, India'
  )}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="tactical-map" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative scroll-mt-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Stage 05 • Route Navigation & Weather</span>
        </div>
        <h2 className="font-bold text-3xl sm:text-4xl text-zinc-100 uppercase tracking-tight">
          Interactive <span className="text-amber-400">Route Map</span>
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-400 leading-relaxed">
          Explore your route with live waypoints, switch between tactical satellite radar and Google Maps directions, and view destination weather.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Main Map Container (8 cols) */}
        <div className="lg:col-span-8 bg-[#0a0a14] border border-amber-500/30 rounded-2xl p-5 sm:p-7 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
          {/* Top Mode Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-5 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
              <button
                type="button"
                onClick={() => setMapMode('TACTICAL_RADAR')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mapMode === 'TACTICAL_RADAR'
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Interactive Route Radar</span>
              </button>

              <button
                type="button"
                onClick={() => setMapMode('GOOGLE_MAPS_EMBED')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mapMode === 'GOOGLE_MAPS_EMBED'
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Google Maps View</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyMapLink}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy Google Maps Navigation Link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Route Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Map Display Screen */}
          <div className="relative w-full h-80 sm:h-96 rounded-xl bg-[#06060a] border border-zinc-800 overflow-hidden shadow-inner">
            {mapMode === 'TACTICAL_RADAR' ? (
              <>
                <div ref={mapContainerRef} className="w-full h-full z-0" style={{ background: '#09090f' }} />
                <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/80 border border-zinc-800 text-[11px] text-zinc-300 flex items-center gap-1.5 backdrop-blur-md z-10 pointer-events-none shadow-lg">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>
                    {destLat.toFixed(2)}° N, {destLng.toFixed(2)}° E
                  </span>
                </div>
              </>
            ) : (
              <iframe
                title="Google Maps Route View"
                src={googleMapsEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            )}
          </div>

          {/* Corridor Info & One-Click Launch */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800/80">
            <div className="text-left text-xs text-zinc-400 space-y-1">
              <div className="text-zinc-200 font-semibold flex items-center gap-2">
                <Route className="w-4 h-4 text-amber-400" />
                <span>
                  {route.origin || 'Hyderabad'} →{' '}
                  <span className="text-amber-300 font-bold">{selectedSanctuary?.name || route.destination || 'Goa'}</span>
                </span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Distance: <strong className="text-zinc-200">{route.distanceMiles} Miles</strong> • Estimated Drive: <strong className="text-zinc-200">{route.eta}</strong>
                {selectedPitstops.length > 0 && ` • ${selectedPitstops.length} Planned Stop(s)`}
              </p>
            </div>

            <button
              id="launch-google-maps-btn"
              type="button"
              onClick={handleLaunchGoogleMaps}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Open in Google Maps App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Destination Weather & Info Widget (4 cols) */}
        <div className="lg:col-span-4 bg-[#0a0a14] border border-amber-500/30 rounded-2xl p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between text-left shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
                Destination Weather
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE
              </span>
            </div>

            <h3 className="text-xl font-bold text-zinc-100 truncate">{weather.city}</h3>
            <p className="text-xs text-amber-300/90 font-medium mt-0.5">{weather.condition}</p>

            {/* Temperature Display */}
            <div className="mt-5 flex items-baseline gap-3">
              <div className="text-5xl font-bold text-zinc-100">
                {weather.tempF}°<span className="text-2xl text-amber-400">F</span>
              </div>
              <div className="text-base text-zinc-400 font-semibold">({weather.tempC}°C)</div>
            </div>

            {/* Atmosphere Stats */}
            <div className="grid grid-cols-2 gap-3 mt-5 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <Wind className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Wind</span>
                  <span className="font-semibold">{weather.windSpeed}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-300">
                <Droplets className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Humidity</span>
                  <span className="font-semibold">{weather.humidity}%</span>
                </div>
              </div>
            </div>

            {/* 4-Day Forecast */}
            <div className="mt-5">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide block mb-2">
                4-Day Forecast
              </span>
              <div className="grid grid-cols-4 gap-2">
                {weather.forecast.map((f, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-center"
                  >
                    <span className="text-[10px] text-zinc-400 font-semibold block">{f.day}</span>
                    <Sun className="w-3.5 h-3.5 text-amber-400 mx-auto my-1" />
                    <span className="text-xs font-bold text-zinc-200">{f.tempC ?? (f as any).temp}°C</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Continue Action */}
          <div className="pt-5 mt-6 border-t border-zinc-800">
            <button
              id="advance-tactical-btn"
              type="button"
              onClick={onContinue}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs tracking-wider uppercase shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Continue to Passenger Details</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
