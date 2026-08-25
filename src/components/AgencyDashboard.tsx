import React, { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Users, 
  Plus, 
  Utensils, 
  Building2, 
  Compass, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  LogOut, 
  DollarSign, 
  AlertCircle,
  FileText,
  X
} from 'lucide-react';
import { AuthRoleUser, fetchAgencyTripsApi, createAgencyTripApi } from '../services/api';
import { formatINR } from '../utils/pricing';

interface AgencyDashboardProps {
  user: AuthRoleUser;
  onLogout: () => void;
}

export const AgencyDashboard: React.FC<AgencyDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'planner' | 'vehicles' | 'routes'>('overview');
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Trip Planner Form State
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startingPoint, setStartingPoint] = useState('');
  const [startDate, setStartDate] = useState('2026-03-15');
  const [endDate, setEndDate] = useState('2026-03-18');
  const [travelersCount, setTravelersCount] = useState('4');
  const [selectedVehicle, setSelectedVehicle] = useState('Toyota Innova Crysta (SUV)');
  const [selectedHotel, setSelectedHotel] = useState('The Leela Palace');
  const [tiffinStopName, setTiffinStopName] = useState('Subbayya Gari Hotel / Highway Food Court');
  const [mealType, setMealType] = useState<'Breakfast' | 'Tiffin' | 'Lunch' | 'Snacks' | 'Dinner'>('Breakfast');
  const [tiffinCost, setTiffinCost] = useState('960');
  const [formError, setFormError] = useState<string | null>(null);

  const loadAgencyData = async () => {
    setIsLoading(true);
    try {
      const tripList = await fetchAgencyTripsApi();
      setTrips(tripList);
    } catch (err) {
      console.warn('loadAgencyData error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAgencyData();
  }, []);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();

    // Required Field Validation
    if (!tripName.trim()) {
      setFormError('❌ Please enter the Trip Name.');
      return;
    }
    if (!startingPoint.trim()) {
      setFormError('❌ Please select or enter the starting point.');
      return;
    }
    if (!destination.trim()) {
      setFormError('❌ Please enter the trip destination.');
      return;
    }
    if (!startDate.trim()) {
      setFormError('❌ Please select the trip start date.');
      return;
    }
    if (!selectedVehicle.trim()) {
      setFormError('❌ Please select a vehicle for the trip.');
      return;
    }

    try {
      const newTripPayload = {
        tripName: tripName.trim(),
        destination: destination.trim(),
        startingPoint: startingPoint.trim(),
        startDate,
        endDate,
        numberOfTravelers: Number(travelersCount),
        vehicleName: selectedVehicle,
        agencyName: user.agencyName || user.name,
        agencyId: user.agencyId || 'agency-royal-fleet',
        routeStops: [
          { stopName: `${startingPoint} Departure ORR Exit`, location: startingPoint, stopType: 'BREAK', duration: '20 mins' },
          { stopName: tiffinStopName, location: `${startingPoint}-${destination} Highway`, stopType: 'TIFFIN', duration: '45 mins', notes: `${mealType} Pitstop` },
          { stopName: selectedHotel, location: destination, stopType: 'HOTEL', duration: 'Overnight Stay' },
        ],
        hotelStopover: {
          hotelName: selectedHotel,
          checkIn: startDate,
          checkOut: endDate,
          roomsCount: Math.ceil(Number(travelersCount) / 2),
          guestsCount: Number(travelersCount),
          roomType: 'Deluxe Suite',
          price: 17000,
          status: 'CONFIRMED',
        },
        foodStops: [
          {
            placeName: tiffinStopName,
            location: `${startingPoint}-${destination} Highway`,
            mealType,
            numberOfPeople: Number(travelersCount),
            estimatedCost: Number(tiffinCost),
            notes: 'High-rated pitstop for fresh tiffins and coffee',
          },
        ],
        totalCost: 24500,
      };

      const res = await createAgencyTripApi(newTripPayload);
      if (res.trip) {
        setTrips((prev) => [res.trip, ...prev]);
      }
      setFormError(null);
      setTripName('');
      setDestination('');
      setStartingPoint('');
      setActiveTab('trips');
      alert(`Trip "${newTripPayload.tripName}" Created & Scheduled Successfully!`);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create trip.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07070A] text-zinc-100 flex flex-col font-sans">
      
      {/* Travel Agency Dashboard Header */}
      <header className="px-6 py-4 bg-[#0E0E14] border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif-luxury text-white">
                {user.agencyName || user.name || 'Royal Fleet Travels'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 text-[10px] font-mono-tech font-bold uppercase">
                🟢 Verified Travel Agency
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono-tech">
              Travel Agency Workspace • Fleet, Route & Trip Planning Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white font-mono-tech">{user.email}</div>
            <div className="text-[10px] text-sky-400 font-mono-tech">Role: TRAVEL_ADMIN</div>
          </div>
          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 text-xs font-mono-tech font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="px-6 bg-[#0B0B10] border-b border-zinc-800/60 flex items-center gap-6 overflow-x-auto text-xs font-mono-tech">
        {[
          { id: 'overview', label: 'Fleet Overview', icon: Car },
          { id: 'planner', label: '✨ Trip Planner (Create Trip)', icon: Plus },
          { id: 'trips', label: `Scheduled Trips (${trips.length})`, icon: Compass },
          { id: 'vehicles', label: 'Fleet Vehicles Catalog', icon: Car },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 border-b-2 font-bold uppercase transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-sky-400 text-sky-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4 text-sky-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dashboard Body Content */}
      <main className="p-6 max-w-7xl mx-auto w-full flex-1 space-y-6">
        
        {/* Fleet Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono-tech">
          <div className="p-4 rounded-2xl bg-[#0E0E14] border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] text-zinc-400 uppercase font-bold flex items-center justify-between">
              <span>Active Scheduled Trips</span>
              <Compass className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{trips.length}</div>
            <div className="text-[10px] text-sky-400 mt-1">Confirmed Tours</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0E0E14] border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] text-zinc-400 uppercase font-bold flex items-center justify-between">
              <span>Fleet Vehicles</span>
              <Car className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-2">6</div>
            <div className="text-[10px] text-zinc-400 mt-1">SUVs, Sedans & Coaches</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0E0E14] border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] text-zinc-400 uppercase font-bold flex items-center justify-between">
              <span>Hotel Stopovers</span>
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-2">{trips.filter(t => t.hotelStopover).length}</div>
            <div className="text-[10px] text-zinc-400 mt-1">Reserved Partner Hotels</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0E0E14] border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] text-zinc-400 uppercase font-bold flex items-center justify-between">
              <span>Tiffin & Meal Pitstops</span>
              <Utensils className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-bold text-pink-400 mt-2">{trips.filter(t => t.foodStops?.length > 0).length}</div>
            <div className="text-[10px] text-pink-400 mt-1">Breakfast & Snack Breaks</div>
          </div>
        </div>

        {/* --- TRIP PLANNER TAB (CREATE TRIP FORM) --- */}
        {activeTab === 'planner' && (
          <div className="p-6 rounded-3xl bg-[#0E0E14] border border-sky-500/30 space-y-6 font-mono-tech">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-sky-400" />
                  <span>Agency Trip Planner — Create New Tour</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Plan starting point, destination, vehicle fleet, hotel stay, and breakfast/tiffin stopover places.
                </p>
              </div>
            </div>

            {formError && (
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateTrip} className="space-y-6 text-xs">
              
              {/* Basic Details Section */}
              <div className="p-4 rounded-2xl bg-[#14141C] border border-zinc-800 space-y-4">
                <h3 className="text-xs font-bold text-sky-400 uppercase flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>1. Basic Trip Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Trip Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Heritage Circuit Tour"
                      value={tripName}
                      onChange={(e) => setTripName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E14] border border-zinc-800 text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Starting Point *</label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad"
                      value={startingPoint}
                      onChange={(e) => setStartingPoint(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E14] border border-zinc-800 text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Destination *</label>
                    <input
                      type="text"
                      placeholder="e.g. Delhi / Goa / Jaipur"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E14] border border-zinc-800 text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E14] border border-zinc-800 text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E14] border border-zinc-800 text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Number of Travelers</label>
                    <input
                      type="number"
                      value={travelersCount}
                      onChange={(e) => setTravelersCount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E14] border border-zinc-800 text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle & Hotel Selection Section */}
              <div className="p-4 rounded-2xl bg-[#14141C] border border-zinc-800 space-y-4">
                <h3 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <Car className="w-4 h-4" />
                  <span>2. Vehicle & Hotel Selection</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Selected Vehicle *</label>
                    <select
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E14] border border-zinc-800 text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="Toyota Innova Crysta (SUV)">Toyota Innova Crysta (6 Seater SUV)</option>
                      <option value="Mahindra XUV700 (Premium SUV)">Mahindra XUV700 (6 Seater SUV)</option>
                      <option value="Maruti Suzuki Dzire (Sedan)">Maruti Suzuki Dzire (4 Seater Sedan)</option>
                      <option value="Executive Luxury Tempo Traveller">Executive Tempo Traveller (12 Seater)</option>
                      <option value="Volvo Premium Coach Bus">Volvo Coach Bus (32 Seater)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Hotel Stay Place</label>
                    <select
                      value={selectedHotel}
                      onChange={(e) => setSelectedHotel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E14] border border-zinc-800 text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="The Leela Palace">The Leela Palace (5-Star Deluxe)</option>
                      <option value="Taj Palace Hotel">Taj Palace Hotel (Luxury Resort)</option>
                      <option value="Radisson Blu Hotel">Radisson Blu Hotel (Executive Suite)</option>
                      <option value="ITC Grand Chola">ITC Grand Chola (Heritage Palace)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tiffin & Food Stop Section */}
              <div className="p-4 rounded-2xl bg-[#14141C] border border-zinc-800 space-y-4">
                <h3 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <Utensils className="w-4 h-4" />
                  <span>3. Tiffin & Food Stopover Place</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Tiffin Place Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Subbayya Gari Hotel"
                      value={tiffinStopName}
                      onChange={(e) => setTiffinStopName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E14] border border-zinc-800 text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Meal Type</label>
                    <select
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E14] border border-zinc-800 text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="Breakfast">Breakfast / Tiffin</option>
                      <option value="Lunch">Lunch Break</option>
                      <option value="Snacks">Snacks & Evening Tea</option>
                      <option value="Dinner">Dinner Stop</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Estimated Meal Cost (₹)</label>
                    <input
                      type="number"
                      value={tiffinCost}
                      onChange={(e) => setTiffinCost(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E14] border border-zinc-800 text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs cursor-pointer transition-all shadow-md flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Create & Schedule Trip</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Scheduled Trips Card */}
            <div className="p-6 rounded-3xl bg-[#0E0E14] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono-tech font-bold uppercase text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-400" />
                  <span>Scheduled Agency Trips</span>
                </h3>
                <button
                  onClick={() => setActiveTab('planner')}
                  className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Trip</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono-tech">
                {trips.map((trip) => (
                  <div key={trip.id} className="p-5 rounded-2xl bg-[#14141C] border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-base">{trip.tripName}</div>
                      <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 text-[10px] font-bold uppercase">
                        {trip.status}
                      </span>
                    </div>

                    <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{trip.startingPoint} ➔ {trip.destination}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300 pt-1 border-t border-zinc-800/60">
                      <div>Vehicle: <strong className="text-white">{trip.vehicleName}</strong></div>
                      <div>Travelers: <strong className="text-white">{trip.numberOfTravelers} People</strong></div>
                      <div>Hotel Stop: <strong className="text-emerald-400">{trip.hotelStopover?.hotelName || 'Reserved Hotel'}</strong></div>
                      <div>Tiffin Stop: <strong className="text-pink-400">{trip.foodStops?.[0]?.placeName || 'Highway Food Court'}</strong></div>
                    </div>

                    <div className="text-xs text-emerald-400 font-bold pt-1">
                      Total Trip Cost: {formatINR(trip.totalCost)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* --- SCHEDULED TRIPS TAB --- */}
        {activeTab === 'trips' && (
          <div className="p-6 rounded-3xl bg-[#0E0E14] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-mono-tech font-bold text-white">
                Scheduled Agency Trips ({trips.length})
              </h3>
              <button
                onClick={() => setActiveTab('planner')}
                className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Trip</span>
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#0C0C12] overflow-hidden font-mono-tech text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#12121A] text-zinc-400 border-b border-zinc-800 uppercase">
                  <tr>
                    <th className="p-3.5">Trip Name</th>
                    <th className="p-3.5">Route</th>
                    <th className="p-3.5">Vehicle Selected</th>
                    <th className="p-3.5">Hotel Stop</th>
                    <th className="p-3.5">Tiffin Stop</th>
                    <th className="p-3.5">Total Cost</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {trips.map((t) => (
                    <tr key={t.id}>
                      <td className="p-3.5 font-bold text-white">{t.tripName}</td>
                      <td className="p-3.5 text-amber-400">{t.startingPoint} → {t.destination}</td>
                      <td className="p-3.5 text-sky-400">{t.vehicleName}</td>
                      <td className="p-3.5 text-emerald-400">{t.hotelStopover?.hotelName || 'N/A'}</td>
                      <td className="p-3.5 text-pink-400">{t.foodStops?.[0]?.placeName || 'N/A'}</td>
                      <td className="p-3.5 font-bold text-emerald-400">{formatINR(t.totalCost)}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 text-[10px] font-bold uppercase">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
