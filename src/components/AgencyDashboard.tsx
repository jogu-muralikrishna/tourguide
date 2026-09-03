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
  X,
  Star,
  Trash2,
  Edit,
  UserCheck,
  Phone,
  Mail,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle
} from 'lucide-react';
import { 
  AuthRoleUser, 
  fetchAgencyTripsApi, 
  fetchAgencyVehiclesApi, 
  createAgencyVehicleApi, 
  updateAgencyVehicleStatusApi, 
  fetchAgencyDriversApi, 
  createAgencyDriverApi, 
  assignDriverToVehicleApi, 
  fetchPartnerReviewsApi, 
  AgencyVehicle, 
  AgencyDriver, 
  PartnerReview 
} from '../services/api';
import { formatINR } from '../utils/pricing';

interface AgencyDashboardProps {
  user: AuthRoleUser;
  onLogout: () => void;
}

export const AgencyDashboard: React.FC<AgencyDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'vehicles' | 'drivers' | 'trips' | 'completed' | 'reviews' | 'profile' | 'settings'>('overview');
  
  // Data States
  const [trips, setTrips] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<AgencyVehicle[]>([]);
  const [drivers, setDrivers] = useState<AgencyDriver[]>([]);
  const [reviews, setReviews] = useState<PartnerReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter & Modal States
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTripDetails, setSelectedTripDetails] = useState<any | null>(null);

  // Add Vehicle Modal State
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [vehName, setVehName] = useState('');
  const [vehType, setVehType] = useState('SUV');
  const [vehRegNumber, setVehRegNumber] = useState('');
  const [vehSeats, setVehSeats] = useState('7');
  const [vehModel, setVehModel] = useState('');
  const [vehYear, setVehYear] = useState('2025');
  const [vehPrice, setVehPrice] = useState('3500');
  const [vehFuel, setVehFuel] = useState('Diesel');
  const [vehAC, setVehAC] = useState(true);
  const [vehFormError, setVehFormError] = useState<string | null>(null);

  // Add Driver Modal State
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [drvName, setDrvName] = useState('');
  const [drvPhone, setDrvPhone] = useState('');
  const [drvEmail, setDrvEmail] = useState('');
  const [drvLicense, setDrvLicense] = useState('');
  const [drvExpiry, setDrvExpiry] = useState('2030-08-15');
  const [drvExp, setDrvExp] = useState('6 years');
  const [drvFormError, setDrvFormError] = useState<string | null>(null);

  // Driver Assignment State
  const [assigningVehicle, setAssigningVehicle] = useState<AgencyVehicle | null>(null);
  const [selectedDriverIdForAssign, setSelectedDriverIdForAssign] = useState<string>('');

  const agencyId = user.agencyId || `agency-${user.email.split('@')[0]}`;
  const agencyName = user.agencyName || user.name || 'Travel Agency';

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [tripList, vehList, drvList, revList] = await Promise.all([
        fetchAgencyTripsApi(),
        fetchAgencyVehiclesApi(agencyId),
        fetchAgencyDriversApi(agencyId),
        fetchPartnerReviewsApi('TRAVEL_AGENCY', agencyId),
      ]);
      setTrips(tripList);
      setVehicles(vehList);
      setDrivers(drvList);
      setReviews(revList);
    } catch (err) {
      console.warn('loadAllData agency error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [agencyId]);

  // Derived Overview Metrics
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const totalDrivers = drivers.length;
  const activeBookings = trips.filter(t => t.status === 'CONFIRMED' || t.status === 'Upcoming' || t.status === 'Ongoing').length;
  const upcomingTrips = trips.filter(t => t.status === 'Upcoming' || t.status === 'CONFIRMED').length;
  const completedTrips = trips.filter(t => t.status === 'COMPLETED' || t.status === 'Completed').length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '4.8';

  // Handle Add Vehicle Submit
  const handleAddVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehName.trim() || !vehRegNumber.trim() || !vehPrice.trim()) {
      setVehFormError('Vehicle Name, Registration Number, and Daily Price are required.');
      return;
    }

    try {
      const res = await createAgencyVehicleApi({
        agencyId,
        agencyName,
        name: vehName.trim(),
        type: vehType,
        regNumber: vehRegNumber.trim().toUpperCase(),
        seats: Number(vehSeats),
        model: vehModel.trim() || 'Standard Model',
        year: vehYear,
        price: Number(vehPrice),
        fuelType: vehFuel,
        ac: vehAC,
        status: 'Available',
      });

      if (res.vehicle) {
        setVehicles(prev => [res.vehicle, ...prev]);
      }
      setIsAddVehicleOpen(false);
      setVehName('');
      setVehRegNumber('');
      setVehFormError(null);
      alert(`Vehicle "${vehName}" added successfully to your fleet!`);
    } catch (err: any) {
      setVehFormError(err.message || 'Failed to add vehicle.');
    }
  };

  // Handle Add Driver Submit
  const handleAddDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drvName.trim() || !drvPhone.trim() || !drvLicense.trim()) {
      setDrvFormError('Driver Name, Phone, and License Number are required.');
      return;
    }

    try {
      const res = await createAgencyDriverApi({
        agencyId,
        agencyName,
        name: drvName.trim(),
        phone: drvPhone.trim(),
        email: drvEmail.trim() || `${drvName.toLowerCase().replace(/\s+/g, '')}@agency.com`,
        licenseNumber: drvLicense.trim().toUpperCase(),
        licenseExpiry: drvExpiry,
        experienceYears: drvExp,
        status: 'Available',
      });

      if (res.driver) {
        setDrivers(prev => [res.driver, ...prev]);
      }
      setIsAddDriverOpen(false);
      setDrvName('');
      setDrvPhone('');
      setDrvLicense('');
      setDrvFormError(null);
      alert(`Driver "${drvName}" added successfully to your roster!`);
    } catch (err: any) {
      setDrvFormError(err.message || 'Failed to add driver.');
    }
  };

  // Handle Assign Driver Submit
  const handleAssignDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningVehicle || !selectedDriverIdForAssign) return;

    const matchedDriver = drivers.find(d => d.id === selectedDriverIdForAssign);
    if (!matchedDriver) return;

    await assignDriverToVehicleApi(assigningVehicle.id, matchedDriver.id, matchedDriver.name);
    setVehicles(prev => prev.map(v => v.id === assigningVehicle.id ? { ...v, assignedDriverId: matchedDriver.id, assignedDriverName: matchedDriver.name } : v));
    setDrivers(prev => prev.map(d => d.id === matchedDriver.id ? { ...d, assignedVehicleId: assigningVehicle.id, assignedVehicleName: assigningVehicle.name } : d));

    setAssigningVehicle(null);
    setSelectedDriverIdForAssign('');
    alert(`Assigned driver ${matchedDriver.name} to ${assigningVehicle.name}!`);
  };

  // Handle Toggle Vehicle Status
  const handleToggleVehStatus = async (vehId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Available' ? 'Maintenance' : 'Available';
    await updateAgencyVehicleStatusApi(vehId, nextStatus as any);
    setVehicles(prev => prev.map(v => v.id === vehId ? { ...v, status: nextStatus as any } : v));
  };

  // Handle Complete Trip Action
  const handleMarkTripCompleted = (tripId: string, tripToken: string) => {
    if (!window.confirm(`Mark trip ${tripToken} as COMPLETED? This will enable customer review submission.`)) return;

    const completedAt = new Date().toISOString();
    setTrips(prev => prev.map(t => (t.id === tripId || t.tripToken === tripToken) ? { ...t, status: 'COMPLETED', completedAt } : t));
    alert(`Trip ${tripToken} marked as COMPLETED! Completion timestamp recorded.`);
  };

  const filteredTrips = trips.filter(t => {
    const statusMatch = bookingFilterStatus === 'all' || t.status === bookingFilterStatus;
    const query = searchQuery.toLowerCase().trim();
    const token = (t.tripToken || t.journeyToken || t.id || '').toLowerCase();
    const name = (t.customerName || t.user?.fullName || t.name || '').toLowerCase();
    const dest = (t.destination || '').toLowerCase();
    const veh = (t.vehicleName || '').toLowerCase();
    const drv = (t.driverName || '').toLowerCase();

    const searchMatch = !query || token.includes(query) || name.includes(query) || dest.includes(query) || veh.includes(query) || drv.includes(query);
    return statusMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-[#07070A] text-zinc-100 flex flex-col font-sans">
      
      {/* Top Luxury Header */}
      <header className="px-6 py-4 bg-[#0E0E14] border-b border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14141B] hover:bg-[#20202A] border border-[#D4AF37]/40 text-xs font-mono-tech font-bold text-[#F3E5AB] cursor-pointer transition-all"
            title="Return to Main Login"
          >
            <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
            <span>← Back to Previous Page</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl gold-gradient-bg text-black flex items-center justify-center font-extrabold shadow-md border border-[#D4AF37]">
              <Car className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white font-serif-luxury">{agencyName}</h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono-tech font-bold uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified Agency Partner</span>
                </span>
              </div>
              <span className="text-xs font-mono-tech text-[#F3E5AB]">TRAVEL_AGENCY_ADMIN • {user.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-bold font-mono-tech flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#0A0A10] border-r border-zinc-800/80 p-4 space-y-2">
          <div className="text-[10px] font-mono-tech uppercase tracking-widest text-[#D4AF37] px-3 py-2">
            Agency Command Navigation
          </div>

          <nav className="space-y-1 font-mono-tech text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Bookings ({trips.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('vehicles')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'vehicles'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Vehicles ({vehicles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('drivers')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'drivers'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Drivers Roster ({drivers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('trips')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'trips'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Trip Management</span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Completed Trips ({completedTrips})</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Star className="w-4 h-4 text-amber-400" />
              <span>Customer Reviews ({reviews.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Agency Profile</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Summary Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono-tech">
                <div className="p-4 rounded-2xl bg-[#0D0D14] border border-sky-500/30 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Total Fleet Vehicles</span>
                    <Car className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{totalVehicles}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">{availableVehicles} Available Now</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D0D14] border border-[#D4AF37]/30 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Active Drivers</span>
                    <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="text-2xl font-black text-white">{totalDrivers}</div>
                  <div className="text-[11px] text-[#F3E5AB]">Verified Fleet Roster</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D0D14] border border-sky-500/30 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Active Bookings</span>
                    <Clock className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{activeBookings}</div>
                  <div className="text-[11px] text-sky-400">{upcomingTrips} Upcoming Trips</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D0D14] border border-amber-500/30 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Average Customer Rating</span>
                    <Star className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400">★ {avgRating}</div>
                  <div className="text-[11px] text-zinc-400">Based on {reviews.length} Verified Reviews</div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F0F16] border border-zinc-800">
                <div>
                  <h3 className="font-bold text-white font-serif-luxury text-lg">Quick Agency Fleet Management</h3>
                  <p className="text-xs text-zinc-400 font-mono-tech">Add new vehicles or drivers to your active agency roster</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAddVehicleOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-mono-tech text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Vehicle</span>
                  </button>

                  <button
                    onClick={() => setIsAddDriverOpen(true)}
                    className="px-4 py-2.5 rounded-xl gold-gradient-bg text-black font-mono-tech text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Driver</span>
                  </button>
                </div>
              </div>

              {/* Recent Bookings Snapshot */}
              <div className="p-5 rounded-2xl bg-[#0C0C12] border border-zinc-800 space-y-4 font-mono-tech">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white uppercase text-sm">Recent Active Bookings</h3>
                  <button onClick={() => setActiveTab('bookings')} className="text-xs text-sky-400 hover:underline">
                    View All Bookings →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#12121A] text-zinc-400 border-b border-zinc-800 uppercase">
                      <tr>
                        <th className="p-3">Trip Token</th>
                        <th className="p-3">Customer Name</th>
                        <th className="p-3">Destination</th>
                        <th className="p-3">Vehicle</th>
                        <th className="p-3">Driver</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      {trips.slice(0, 5).map((t, idx) => (
                        <tr key={t.id || idx} className="hover:bg-zinc-900/50">
                          <td className="p-3 font-mono font-bold text-sky-400">{t.tripToken || t.journeyToken || `TG-2026-8F3K${idx}`}</td>
                          <td className="p-3 font-bold text-white">{t.customerName || t.user?.fullName || t.name || 'Ammu'}</td>
                          <td className="p-3 text-zinc-300">{t.destination || 'Goa'}</td>
                          <td className="p-3 text-zinc-400">{t.vehicleName || 'Toyota Innova Crysta'}</td>
                          <td className="p-3 text-zinc-400">{t.driverName || 'Ramesh Kumar'}</td>
                          <td className="p-3 font-bold text-emerald-400">{t.status || 'CONFIRMED'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div className="space-y-4 font-mono-tech">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase">Status Filter:</span>
                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs"
                  >
                    <option value="all">All Bookings</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search by Trip Token or Customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-[#0C0C12] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#12121A] text-zinc-400 border-b border-zinc-800 uppercase">
                      <tr>
                        <th className="p-3.5">Trip Token</th>
                        <th className="p-3.5">Customer Name</th>
                        <th className="p-3.5">Mobile</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Car</th>
                        <th className="p-3.5">Driver</th>
                        <th className="p-3.5">Destination</th>
                        <th className="p-3.5">Dates</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      {filteredTrips.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="p-8 text-center text-zinc-500">
                            No agency bookings found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredTrips.map((t, idx) => {
                          const token = t.tripToken || t.journeyToken || `TG-2026-8F3K${idx}`;
                          const cName = t.customerName || t.user?.fullName || t.name || 'Ammu';
                          const cPhone = t.mobile || t.user?.phone || '+91 98765 43210';
                          const cEmail = t.email || t.user?.email || 'ammu@gmail.com';
                          const car = t.vehicleName || 'Toyota Innova Crysta';
                          const drv = t.driverName || 'Ramesh Kumar';
                          const dest = t.destination || 'Goa';
                          const dates = `${t.startDate || '10 Sep'} - ${t.endDate || '14 Sep'}`;
                          const status = t.status || 'CONFIRMED';

                          return (
                            <tr key={t.id || idx} className="hover:bg-zinc-900/50">
                              <td className="p-3.5 font-bold text-sky-400 font-mono">{token}</td>
                              <td className="p-3.5 font-bold text-white">{cName}</td>
                              <td className="p-3.5 text-zinc-400">{cPhone}</td>
                              <td className="p-3.5 text-zinc-400 font-mono text-[11px]">{cEmail}</td>
                              <td className="p-3.5 text-zinc-300">{car}</td>
                              <td className="p-3.5 text-amber-400 font-semibold">{drv}</td>
                              <td className="p-3.5 text-zinc-300">{dest}</td>
                              <td className="p-3.5 text-zinc-400 text-[11px]">{dates}</td>
                              <td className="p-3.5 font-bold text-emerald-400">{status}</td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => setSelectedTripDetails(t)}
                                  className="px-2.5 py-1 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold cursor-pointer transition-all"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VEHICLES MANAGEMENT */}
          {activeTab === 'vehicles' && (
            <div className="space-y-4 font-mono-tech">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white font-serif-luxury">Fleet Vehicle Management</h2>
                  <p className="text-xs text-zinc-400">Manage vehicles, set prices, and assign drivers</p>
                </div>

                <button
                  onClick={() => setIsAddVehicleOpen(true)}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Vehicle</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map((v) => (
                  <div key={v.id} className="p-4 rounded-2xl bg-[#0D0D14] border border-zinc-800 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <h4 className="font-bold text-white text-sm">{v.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        v.status === 'Available' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {v.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-zinc-400">
                      <div className="flex justify-between"><span>Registration:</span> <span className="font-mono text-white font-bold">{v.regNumber}</span></div>
                      <div className="flex justify-between"><span>Type & Seats:</span> <span className="text-zinc-200">{v.type} • {v.seats} Seats</span></div>
                      <div className="flex justify-between"><span>Daily Price:</span> <span className="font-bold text-emerald-400">{formatINR(v.price)}/day</span></div>
                      <div className="flex justify-between"><span>Assigned Driver:</span> <span className="text-amber-400 font-bold">{v.assignedDriverName || 'Not Assigned'}</span></div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-zinc-800/80">
                      <button
                        onClick={() => { setAssigningVehicle(v); setSelectedDriverIdForAssign(v.assignedDriverId || ''); }}
                        className="flex-1 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold cursor-pointer"
                      >
                        Assign Driver
                      </button>
                      <button
                        onClick={() => handleToggleVehStatus(v.id, v.status)}
                        className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold cursor-pointer"
                      >
                        {v.status === 'Available' ? 'Maintenance' : 'Make Available'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DRIVERS ROSTER */}
          {activeTab === 'drivers' && (
            <div className="space-y-4 font-mono-tech">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white font-serif-luxury">Agency Driver Roster</h2>
                  <p className="text-xs text-zinc-400">Manage drivers, licenses, and assigned fleet vehicles</p>
                </div>

                <button
                  onClick={() => setIsAddDriverOpen(true)}
                  className="px-4 py-2 rounded-xl gold-gradient-bg text-black font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Driver</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drivers.map((d) => (
                  <div key={d.id} className="p-4 rounded-2xl bg-[#0D0D14] border border-zinc-800 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                        <h4 className="font-bold text-white text-sm">{d.name}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
                        {d.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-zinc-400">
                      <div className="flex justify-between"><span>Phone:</span> <span className="text-white font-mono">{d.phone}</span></div>
                      <div className="flex justify-between"><span>License No:</span> <span className="font-mono text-zinc-300">{d.licenseNumber}</span></div>
                      <div className="flex justify-between"><span>Experience:</span> <span className="text-zinc-200">{d.experienceYears}</span></div>
                      <div className="flex justify-between"><span>Assigned Vehicle:</span> <span className="text-sky-400 font-bold">{d.assignedVehicleName || 'Unassigned'}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TRIP MANAGEMENT */}
          {activeTab === 'trips' && (
            <div className="space-y-4 font-mono-tech">
              <h2 className="text-lg font-bold text-white font-serif-luxury">Trip Lifecycle Management</h2>
              
              <div className="rounded-2xl border border-zinc-800 bg-[#0C0C12] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#12121A] text-zinc-400 border-b border-zinc-800 uppercase">
                    <tr>
                      <th className="p-3.5">Trip Token</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Vehicle</th>
                      <th className="p-3.5">Driver</th>
                      <th className="p-3.5">Destination</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {trips.map((t, idx) => {
                      const token = t.tripToken || t.journeyToken || `TG-2026-8F3K${idx}`;
                      const isDone = t.status === 'COMPLETED' || t.status === 'Completed';

                      return (
                        <tr key={t.id || idx} className="hover:bg-zinc-900/50">
                          <td className="p-3.5 font-bold font-mono text-sky-400">{token}</td>
                          <td className="p-3.5 font-bold text-white">{t.customerName || t.user?.fullName || t.name || 'Ammu'}</td>
                          <td className="p-3.5 text-zinc-300">{t.vehicleName || 'Toyota Innova Crysta'}</td>
                          <td className="p-3.5 text-amber-400 font-semibold">{t.driverName || 'Ramesh Kumar'}</td>
                          <td className="p-3.5 text-zinc-300">{t.destination || 'Goa'}</td>
                          <td className="p-3.5 font-bold text-emerald-400">{t.status || 'CONFIRMED'}</td>
                          <td className="p-3.5 text-right">
                            {!isDone ? (
                              <button
                                onClick={() => handleMarkTripCompleted(t.id, token)}
                                className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer shadow-md"
                              >
                                Mark Trip Completed
                              </button>
                            ) : (
                              <span className="text-zinc-500 font-bold">✓ Trip Completed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: COMPLETED TRIPS */}
          {activeTab === 'completed' && (
            <div className="space-y-4 font-mono-tech">
              <h2 className="text-lg font-bold text-white font-serif-luxury">Completed Trips History</h2>
              
              <div className="rounded-2xl border border-zinc-800 bg-[#0C0C12] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#12121A] text-zinc-400 border-b border-zinc-800 uppercase">
                    <tr>
                      <th className="p-3.5">Trip Token</th>
                      <th className="p-3.5">Customer Name</th>
                      <th className="p-3.5">Vehicle & Driver</th>
                      <th className="p-3.5">Destination</th>
                      <th className="p-3.5">Completion Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {trips.filter(t => t.status === 'COMPLETED' || t.status === 'Completed').length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">
                          No completed trips recorded yet. Complete an active trip to see history here.
                        </td>
                      </tr>
                    ) : (
                      trips.filter(t => t.status === 'COMPLETED' || t.status === 'Completed').map((t, idx) => (
                        <tr key={t.id || idx} className="hover:bg-zinc-900/50">
                          <td className="p-3.5 font-bold font-mono text-sky-400">{t.tripToken || t.journeyToken || `TG-2026-8F3K${idx}`}</td>
                          <td className="p-3.5 font-bold text-white">{t.customerName || t.user?.fullName || t.name || 'Ammu'}</td>
                          <td className="p-3.5 text-zinc-300">{t.vehicleName} ({t.driverName})</td>
                          <td className="p-3.5 text-zinc-300">{t.destination}</td>
                          <td className="p-3.5 font-mono text-emerald-400">{t.completedAt ? new Date(t.completedAt).toLocaleString() : '2026-03-02 14:30'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 font-mono-tech">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D0D14] border border-amber-500/30">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white font-serif-luxury">Customer Rating & Feedback</h2>
                  <p className="text-xs text-zinc-400">Verified customer reviews connected to Trip Tokens</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black text-amber-400">★ {avgRating}</div>
                  <div className="text-xs text-zinc-400">Based on {reviews.length} customer reviews</div>
                </div>
              </div>

              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#0C0C12] border border-zinc-800 text-center text-zinc-500">
                    No customer reviews submitted yet.
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-[#0D0D14] border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{rev.customerName}</span>
                          <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 font-mono text-[10px]">Trip Token: {rev.tripToken}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          {'★'.repeat(rev.rating)}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-300 italic">"{rev.reviewText}"</p>
                      <div className="text-[10px] text-zinc-500 flex justify-between pt-1 border-t border-zinc-800/60">
                        <span>Vehicle: {rev.vehicleName || 'Toyota Innova Crysta'} • Driver: {rev.driverName || 'Ramesh Kumar'}</span>
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 8: AGENCY PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-xl space-y-4 font-mono-tech">
              <h2 className="text-lg font-bold text-white font-serif-luxury">Travel Agency Business Profile</h2>

              <div className="p-5 rounded-2xl bg-[#0D0D14] border border-zinc-800 space-y-4">
                <div className="space-y-1 border-b border-zinc-800 pb-3">
                  <span className="text-xs text-zinc-500">Agency Company Name</span>
                  <div className="font-bold text-lg text-white">{agencyName}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-zinc-500">Fleet Manager Name</span>
                    <div className="font-bold text-white">{user.name}</div>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500">Account Role</span>
                    <div className="font-bold text-sky-400">TRAVEL_AGENCY_ADMIN</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-zinc-500">Login Email</span>
                    <div className="font-mono text-zinc-200">{user.email}</div>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500">Phone Number</span>
                    <div className="font-mono text-zinc-200">{user.phone}</div>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-zinc-500">Account Status</span>
                  <div className="pt-1">
                    <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold uppercase inline-block">
                      🟢 Active & Verified Partner
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* --- ADD VEHICLE MODAL --- */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c12] border border-sky-500/40 rounded-2xl p-6 max-w-lg w-full space-y-4 font-mono-tech">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Car className="w-5 h-5 text-sky-400" />
                <span>+ Add New Fleet Vehicle</span>
              </h3>
              <button onClick={() => setIsAddVehicleOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {vehFormError && <div className="p-3 rounded-xl bg-red-950 border border-red-800 text-red-300 text-xs">⚠️ {vehFormError}</div>}

            <form onSubmit={handleAddVehicleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Vehicle Name *</label>
                <input type="text" required placeholder="e.g. Toyota Innova Crysta" value={vehName} onChange={e => setVehName(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Vehicle Type</label>
                  <select value={vehType} onChange={e => setVehType(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white">
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Premium SUV">Premium SUV</option>
                    <option value="Luxury Car">Luxury Car</option>
                    <option value="Tempo Traveler">Tempo Traveler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Registration Number *</label>
                  <input type="text" required placeholder="e.g. TS09AB1234" value={vehRegNumber} onChange={e => setVehRegNumber(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Seats</label>
                  <input type="number" min={2} max={30} value={vehSeats} onChange={e => setVehSeats(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white" />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Price / Day (₹) *</label>
                  <input type="number" required value={vehPrice} onChange={e => setVehPrice(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white" />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Fuel Type</label>
                  <select value={vehFuel} onChange={e => setVehFuel(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white">
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="EV">EV Electric</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setIsAddVehicleOpen(false)} className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold uppercase">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-sky-500 text-white font-bold uppercase shadow-md">Save Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD DRIVER MODAL --- */}
      {isAddDriverOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c12] border border-[#D4AF37]/50 rounded-2xl p-6 max-w-lg w-full space-y-4 font-mono-tech">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#D4AF37]" />
                <span>+ Add Driver to Agency Roster</span>
              </h3>
              <button onClick={() => setIsAddDriverOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {drvFormError && <div className="p-3 rounded-xl bg-red-950 border border-red-800 text-red-300 text-xs">⚠️ {drvFormError}</div>}

            <form onSubmit={handleAddDriverSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Driver Full Name *</label>
                <input type="text" required placeholder="e.g. Ramesh Kumar" value={drvName} onChange={e => setDrvName(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Mobile Number *</label>
                  <input type="tel" required placeholder="+91 98765 43210" value={drvPhone} onChange={e => setDrvPhone(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white" />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">License Number *</label>
                  <input type="text" required placeholder="e.g. DL-042018009214" value={drvLicense} onChange={e => setDrvLicense(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Driving Experience</label>
                  <input type="text" placeholder="e.g. 8 years" value={drvExp} onChange={e => setDrvExp(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white" />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">License Expiry Date</label>
                  <input type="date" value={drvExpiry} onChange={e => setDrvExpiry(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white" />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setIsAddDriverOpen(false)} className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold uppercase">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl gold-gradient-bg text-black font-bold uppercase shadow-md">Save Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ASSIGN DRIVER MODAL --- */}
      {assigningVehicle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c12] border border-amber-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 font-mono-tech">
            <h3 className="font-bold text-white text-base">Assign Driver to {assigningVehicle.name}</h3>
            <form onSubmit={handleAssignDriverSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Select Driver</label>
                <select
                  value={selectedDriverIdForAssign}
                  onChange={(e) => setSelectedDriverIdForAssign(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs"
                >
                  <option value="">Select a driver...</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.phone})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setAssigningVehicle(null)} className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold uppercase">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold uppercase shadow-md">Save Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TRIP DETAILS MODAL --- */}
      {selectedTripDetails && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c12] border border-sky-500/40 rounded-2xl p-6 max-w-lg w-full space-y-4 font-mono-tech max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-lg">Trip Token Details</h3>
                <span className="text-xs font-mono font-bold text-sky-400">{selectedTripDetails.tripToken || selectedTripDetails.journeyToken || 'TG-2026-8F3K2'}</span>
              </div>
              <button onClick={() => setSelectedTripDetails(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-3 rounded-xl bg-[#12121A] border border-zinc-800 space-y-1">
                <div className="font-bold text-white uppercase text-[11px] text-sky-400">Customer & Contact Info</div>
                <div>Name: <span className="text-white font-bold">{selectedTripDetails.customerName || selectedTripDetails.user?.fullName || 'Ammu'}</span></div>
                <div>Mobile: <span className="font-mono text-zinc-200">{selectedTripDetails.mobile || selectedTripDetails.user?.phone || '+91 98765 43210'}</span></div>
                <div>Email: <span className="font-mono text-zinc-200">{selectedTripDetails.email || selectedTripDetails.user?.email || 'ammu@gmail.com'}</span></div>
              </div>

              <div className="p-3 rounded-xl bg-[#12121A] border border-zinc-800 space-y-1">
                <div className="font-bold text-white uppercase text-[11px] text-sky-400">Trip & Route Details</div>
                <div>Destination: <span className="text-white font-bold">{selectedTripDetails.destination || 'Goa'}</span></div>
                <div>Start Location: <span className="text-zinc-300">{selectedTripDetails.startingPoint || 'Hyderabad'}</span></div>
                <div>Dates: <span className="text-zinc-300">{selectedTripDetails.startDate || '10 Sep'} to {selectedTripDetails.endDate || '14 Sep'}</span></div>
              </div>

              <div className="p-3 rounded-xl bg-[#12121A] border border-zinc-800 space-y-1">
                <div className="font-bold text-white uppercase text-[11px] text-sky-400">Selected Food & Rest Stops</div>
                {selectedTripDetails.foodStops && selectedTripDetails.foodStops.length > 0 ? (
                  selectedTripDetails.foodStops.map((stop: any, i: number) => (
                    <div key={i} className="text-zinc-300">
                      🍽️ {stop.placeName || stop.location} ({stop.mealType || 'Pitstop'})
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-500 italic">No specific food stops selected by customer</div>
                )}
              </div>
            </div>

            <button onClick={() => setSelectedTripDetails(null)} className="w-full py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold uppercase text-xs">
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
