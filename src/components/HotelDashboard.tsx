import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Bed, 
  Users, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Calendar, 
  QrCode, 
  Search, 
  Plus, 
  LogOut, 
  DollarSign, 
  AlertCircle,
  FileText,
  Lock,
  X,
  Star,
  CheckCircle,
  ArrowLeft,
  Mail,
  Edit
} from 'lucide-react';
import { 
  AuthRoleUser, 
  fetchHotelRoomsApi, 
  createHotelRoomApi, 
  updateHotelRoomStatusApi, 
  fetchGuestVerificationsApi, 
  fetchPartnerReviewsApi, 
  HotelRoom, 
  PartnerReview 
} from '../services/api';
import { formatINR } from '../utils/pricing';

interface HotelDashboardProps {
  user: AuthRoleUser;
  onLogout: () => void;
}

export const HotelDashboard: React.FC<HotelDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'rooms' | 'verifications' | 'completed' | 'reviews' | 'profile' | 'settings'>('overview');
  
  // Data States
  const [rooms, setRooms] = useState<HotelRoom[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [reviews, setReviews] = useState<PartnerReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForRoomAssign, setSelectedBookingForRoomAssign] = useState<any | null>(null);
  const [assignedRoomNumberInput, setAssignedRoomNumberInput] = useState('');

  // Add Room Modal State
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomType, setNewRoomType] = useState('Deluxe Suite');
  const [newRoomPrice, setNewRoomPrice] = useState('8500');
  const [newRoomCapacity, setNewRoomCapacity] = useState('2');
  const [roomError, setRoomError] = useState<string | null>(null);

  const hotelId = user.hotelId || `hotel-${user.email.split('@')[0]}`;
  const hotelName = user.hotelName || user.name || 'Grand Palace Hotel';

  const loadHotelData = async () => {
    setIsLoading(true);
    try {
      const [roomList, verifList, revList] = await Promise.all([
        fetchHotelRoomsApi(),
        fetchGuestVerificationsApi(),
        fetchPartnerReviewsApi('HOTEL', hotelId),
      ]);
      setRooms(roomList);
      setVerifications(verifList);
      setReviews(revList);
    } catch (err) {
      console.warn('loadHotelData error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHotelData();
  }, [hotelId]);

  // Derived Overview Metrics
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'AVAILABLE' || r.status === 'Available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED' || r.status === 'Occupied' || r.status === 'Reserved').length;
  const upcomingBookings = verifications.filter(v => v.verificationStatus !== 'COMPLETED').length;
  const completedStays = verifications.filter(v => v.verificationStatus === 'COMPLETED').length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  // Handle Add Room Submit
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber.trim() || !newRoomPrice.trim()) {
      setRoomError('Room Number and Price Per Night are required.');
      return;
    }

    try {
      const res = await createHotelRoomApi({
        roomNumber: newRoomNumber.trim(),
        roomType: newRoomType,
        pricePerNight: Number(newRoomPrice),
        capacity: Number(newRoomCapacity),
        hotelName,
        hotelId,
        status: 'Available',
      });

      if (res.room) {
        setRooms(prev => [res.room, ...prev]);
      } else {
        const fallbackRoom: HotelRoom = {
          id: `RM-${Date.now()}`,
          hotelId,
          hotelName,
          roomNumber: newRoomNumber.trim(),
          roomType: newRoomType,
          capacity: Number(newRoomCapacity),
          pricePerNight: Number(newRoomPrice),
          amenities: ['King Bed', 'AC', 'High Speed WiFi', 'Mountain View'],
          status: 'Available',
          createdAt: new Date().toISOString(),
        };
        setRooms(prev => [fallbackRoom, ...prev]);
      }

      setIsAddRoomOpen(false);
      setNewRoomNumber('');
      setRoomError(null);
      alert(`Room Number ${newRoomNumber} added successfully to ${hotelName}!`);
    } catch (err: any) {
      setRoomError(err.message || 'Failed to create room.');
    }
  };

  // Handle Toggle Room Status
  const handleToggleRoomStatus = async (roomId: string, currentStatus: string) => {
    const nextStatus = (currentStatus === 'AVAILABLE' || currentStatus === 'Available') ? 'Maintenance' : 'Available';
    await updateHotelRoomStatusApi(roomId, nextStatus);
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: nextStatus as any } : r));
  };

  // Handle Assign Room Number Submit
  const handleAssignRoomNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForRoomAssign || !assignedRoomNumberInput.trim()) return;

    setVerifications(prev => prev.map(v => 
      (v.id === selectedBookingForRoomAssign.id || v.bookingId === selectedBookingForRoomAssign.bookingId)
        ? { ...v, assignedRoomNumber: assignedRoomNumberInput.trim() }
        : v
    ));

    alert(`Assigned Room Number ${assignedRoomNumberInput.trim()} to guest ${selectedBookingForRoomAssign.guestName}!`);
    setSelectedBookingForRoomAssign(null);
    setAssignedRoomNumberInput('');
  };

  // Handle Complete Stay Action
  const handleMarkStayCompleted = (verifId: string, bookingId: string) => {
    if (!window.confirm(`Mark guest stay ${bookingId} as COMPLETED / CHECKED OUT? This enables guest review submission.`)) return;

    const completedAt = new Date().toISOString();
    setVerifications(prev => prev.map(v => 
      (v.id === verifId || v.bookingId === bookingId)
        ? { ...v, verificationStatus: 'COMPLETED', completedAt }
        : v
    ));

    alert(`Guest stay for ${bookingId} marked as COMPLETED! Completion timestamp recorded.`);
  };

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
              <Building2 className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white font-serif-luxury">{hotelName}</h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono-tech font-bold uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified Hotel Partner</span>
                </span>
              </div>
              <span className="text-xs font-mono-tech text-[#F3E5AB]">HOTEL_ADMIN • {user.email}</span>
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
            Hotel Property Navigation
          </div>

          <nav className="space-y-1 font-mono-tech text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-amber-500/20 text-[#F3E5AB] border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-amber-500/20 text-[#F3E5AB] border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <span>Guest Bookings ({verifications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('rooms')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'rooms'
                  ? 'bg-amber-500/20 text-[#F3E5AB] border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Bed className="w-4 h-4 text-[#D4AF37]" />
              <span>Room Management ({rooms.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('verifications')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'verifications'
                  ? 'bg-amber-500/20 text-[#F3E5AB] border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <QrCode className="w-4 h-4 text-[#D4AF37]" />
              <span>Guest Check-In</span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-amber-500/20 text-[#F3E5AB] border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>Completed Stays ({completedStays})</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-amber-500/20 text-[#F3E5AB] border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Star className="w-4 h-4 text-amber-400" />
              <span>Guest Reviews ({reviews.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-amber-500/20 text-[#F3E5AB] border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Hotel Profile</span>
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
                <div className="p-4 rounded-2xl bg-[#0D0D14] border border-[#D4AF37]/30 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Total Rooms</span>
                    <Bed className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="text-2xl font-black text-white">{totalRooms}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">{availableRooms} Available</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D0D14] border border-[#D4AF37]/30 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Occupied / Reserved</span>
                    <Users className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="text-2xl font-black text-white">{occupiedRooms}</div>
                  <div className="text-[11px] text-amber-400 font-semibold">Active Guests</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D0D14] border border-[#D4AF37]/30 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Upcoming Bookings</span>
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="text-2xl font-black text-white">{upcomingBookings}</div>
                  <div className="text-[11px] text-emerald-400">{completedStays} Completed Stays</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D0D14] border border-amber-500/30 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Average Hotel Rating</span>
                    <Star className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400">★ {avgRating}</div>
                  <div className="text-[11px] text-zinc-400">Based on {reviews.length} Guest Reviews</div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F0F16] border border-zinc-800">
                <div>
                  <h3 className="font-bold text-white font-serif-luxury text-lg">Hotel Property Operations</h3>
                  <p className="text-xs text-zinc-400 font-mono-tech">Add new rooms or verify guest reservations</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAddRoomOpen(true)}
                    className="px-4 py-2.5 rounded-xl gold-gradient-bg text-black font-mono-tech text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Room</span>
                  </button>
                </div>
              </div>

              {/* Recent Guest Reservations Snapshot */}
              <div className="p-5 rounded-2xl bg-[#0C0C12] border border-zinc-800 space-y-4 font-mono-tech">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white uppercase text-sm">Recent Guest Reservations</h3>
                  <button onClick={() => setActiveTab('bookings')} className="text-xs text-[#D4AF37] hover:underline">
                    View All Guests →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#12121A] text-zinc-400 border-b border-zinc-800 uppercase">
                      <tr>
                        <th className="p-3">Trip Token / Booking ID</th>
                        <th className="p-3">Guest Name</th>
                        <th className="p-3">Mobile Number</th>
                        <th className="p-3">Room Assigned</th>
                        <th className="p-3">Check-In / Out</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      {verifications.slice(0, 5).map((v, idx) => (
                        <tr key={v.id || idx} className="hover:bg-zinc-900/50">
                          <td className="p-3 font-mono font-bold text-sky-400">{v.bookingId || `TG-2026-8F3K${idx}`}</td>
                          <td className="p-3 font-bold text-white">{v.guestName || 'Ammu'}</td>
                          <td className="p-3 font-mono text-zinc-400">{v.mobileNumber || '+91 98765 43210'}</td>
                          <td className="p-3 text-amber-400 font-bold">{v.assignedRoomNumber || 'Room 101'}</td>
                          <td className="p-3 text-zinc-400 text-[11px]">{v.checkInDate || '10 Sep'} - {v.checkOutDate || '14 Sep'}</td>
                          <td className="p-3 font-bold text-emerald-400">{v.verificationStatus || 'VERIFIED'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: BOOKINGS & ROOM ASSIGNMENT */}
          {activeTab === 'bookings' && (
            <div className="space-y-4 font-mono-tech">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-serif-luxury">Guest Reservations & Room Assignment</h2>
                  <p className="text-xs text-zinc-400">View guest bookings and assign room numbers</p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search Guest or Trip Token..."
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
                        <th className="p-3.5">Guest Name</th>
                        <th className="p-3.5">Mobile</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Room Number</th>
                        <th className="p-3.5">Check-In</th>
                        <th className="p-3.5">Check-Out</th>
                        <th className="p-3.5">Guests</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      {verifications.map((v, idx) => {
                        const token = v.bookingId || `TG-2026-8F3K${idx}`;
                        const isDone = v.verificationStatus === 'COMPLETED';

                        return (
                          <tr key={v.id || idx} className="hover:bg-zinc-900/50">
                            <td className="p-3.5 font-bold font-mono text-sky-400">{token}</td>
                            <td className="p-3.5 font-bold text-white">{v.guestName || 'Ammu'}</td>
                            <td className="p-3.5 font-mono text-zinc-400">{v.mobileNumber || '+91 98765 43210'}</td>
                            <td className="p-3.5 font-mono text-zinc-400 text-[11px]">{v.email || 'ammu@gmail.com'}</td>
                            <td className="p-3.5 font-bold text-amber-400">{v.assignedRoomNumber || 'Unassigned'}</td>
                            <td className="p-3.5 text-zinc-300">{v.checkInDate || '10 Sep'}</td>
                            <td className="p-3.5 text-zinc-300">{v.checkOutDate || '14 Sep'}</td>
                            <td className="p-3.5 text-zinc-400">{v.numberOfGuests || 2}</td>
                            <td className="p-3.5 font-bold text-emerald-400">{v.verificationStatus || 'VERIFIED'}</td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => setSelectedBookingForRoomAssign(v)}
                                className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold cursor-pointer"
                              >
                                Assign Room
                              </button>
                              {!isDone ? (
                                <button
                                  onClick={() => handleMarkStayCompleted(v.id, token)}
                                  className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold cursor-pointer shadow-md"
                                >
                                  Stay Completed
                                </button>
                              ) : (
                                <span className="text-zinc-500 font-bold">✓ Completed</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROOM MANAGEMENT */}
          {activeTab === 'rooms' && (
            <div className="space-y-4 font-mono-tech">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white font-serif-luxury">Hotel Room Inventory</h2>
                  <p className="text-xs text-zinc-400">Manage rooms, capacities, rates, and availability</p>
                </div>

                <button
                  onClick={() => setIsAddRoomOpen(true)}
                  className="px-4 py-2 rounded-xl gold-gradient-bg text-black font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Room</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-[#0D0D14] border border-zinc-800 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-[#D4AF37]" />
                        <h4 className="font-bold text-white text-sm">Room {r.roomNumber}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        (r.status === 'AVAILABLE' || r.status === 'Available') ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {r.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-zinc-400">
                      <div className="flex justify-between"><span>Room Type:</span> <span className="text-white font-bold">{r.roomType}</span></div>
                      <div className="flex justify-between"><span>Capacity:</span> <span className="text-zinc-200">{r.capacity} Guests</span></div>
                      <div className="flex justify-between"><span>Price / Night:</span> <span className="font-bold text-emerald-400">{formatINR(r.pricePerNight)}</span></div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-zinc-800/80">
                      <button
                        onClick={() => handleToggleRoomStatus(r.id, r.status)}
                        className="w-full py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold cursor-pointer"
                      >
                        {(r.status === 'AVAILABLE' || r.status === 'Available') ? 'Set Maintenance' : 'Make Available'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMPLETED STAYS */}
          {activeTab === 'completed' && (
            <div className="space-y-4 font-mono-tech">
              <h2 className="text-lg font-bold text-white font-serif-luxury">Completed Guest Stays History</h2>
              
              <div className="rounded-2xl border border-zinc-800 bg-[#0C0C12] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#12121A] text-zinc-400 border-b border-zinc-800 uppercase">
                    <tr>
                      <th className="p-3.5">Trip Token</th>
                      <th className="p-3.5">Guest Name</th>
                      <th className="p-3.5">Room Number</th>
                      <th className="p-3.5">Check-In / Out</th>
                      <th className="p-3.5">Completion Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {verifications.filter(v => v.verificationStatus === 'COMPLETED').length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">
                          No completed stays recorded yet. Click "Stay Completed" on a guest booking to record check-out.
                        </td>
                      </tr>
                    ) : (
                      verifications.filter(v => v.verificationStatus === 'COMPLETED').map((v, idx) => (
                        <tr key={v.id || idx} className="hover:bg-zinc-900/50">
                          <td className="p-3.5 font-bold font-mono text-sky-400">{v.bookingId || `TG-2026-8F3K${idx}`}</td>
                          <td className="p-3.5 font-bold text-white">{v.guestName || 'Ammu'}</td>
                          <td className="p-3.5 text-amber-400 font-bold">{v.assignedRoomNumber || 'Room 101'}</td>
                          <td className="p-3.5 text-zinc-300">{v.checkInDate} to {v.checkOutDate}</td>
                          <td className="p-3.5 font-mono text-emerald-400">{v.completedAt ? new Date(v.completedAt).toLocaleString() : '2026-03-02 15:00'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 font-mono-tech">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D0D14] border border-amber-500/30">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white font-serif-luxury">Guest Feedback & Ratings</h2>
                  <p className="text-xs text-zinc-400">Verified reviews connected to guest room stays</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black text-amber-400">★ {avgRating}</div>
                  <div className="text-xs text-zinc-400">Based on {reviews.length} guest reviews</div>
                </div>
              </div>

              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#0C0C12] border border-zinc-800 text-center text-zinc-500">
                    No guest reviews submitted yet.
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
                        <span>Room Number: {rev.roomNumber || 'Room 101'}</span>
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: HOTEL PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-xl space-y-4 font-mono-tech">
              <h2 className="text-lg font-bold text-white font-serif-luxury">Hotel Property Profile</h2>

              <div className="p-5 rounded-2xl bg-[#0D0D14] border border-zinc-800 space-y-4">
                <div className="space-y-1 border-b border-zinc-800 pb-3">
                  <span className="text-xs text-zinc-500">Hotel Property Name</span>
                  <div className="font-bold text-lg text-white">{hotelName}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-zinc-500">Hotel Admin Manager</span>
                    <div className="font-bold text-white">{user.name}</div>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500">Account Role</span>
                    <div className="font-bold text-amber-400">HOTEL_ADMIN</div>
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
                      🟢 Active & Verified Hotel Partner
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* --- ADD ROOM MODAL --- */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c12] border border-[#D4AF37]/50 rounded-2xl p-6 max-w-lg w-full space-y-4 font-mono-tech">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Bed className="w-5 h-5 text-[#D4AF37]" />
                <span>+ Add Room to Hotel Inventory</span>
              </h3>
              <button onClick={() => setIsAddRoomOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {roomError && <div className="p-3 rounded-xl bg-red-950 border border-red-800 text-red-300 text-xs">⚠️ {roomError}</div>}

            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Room Number *</label>
                  <input type="text" required placeholder="e.g. 305" value={newRoomNumber} onChange={e => setNewRoomNumber(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white" />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Room Type</label>
                  <select value={newRoomType} onChange={e => setNewRoomType(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white">
                    <option value="Deluxe Suite">Deluxe Suite</option>
                    <option value="Presidential Villa">Presidential Villa</option>
                    <option value="Luxury Oceanfront">Luxury Oceanfront</option>
                    <option value="Heritage Suite">Heritage Suite</option>
                    <option value="Standard Villa">Standard Villa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Price Per Night (₹) *</label>
                  <input type="number" required value={newRoomPrice} onChange={e => setNewRoomPrice(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white" />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Capacity (Guests)</label>
                  <input type="number" min={1} max={10} value={newRoomCapacity} onChange={e => setNewRoomCapacity(e.target.value)} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white" />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setIsAddRoomOpen(false)} className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold uppercase">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl gold-gradient-bg text-black font-bold uppercase shadow-md">Save Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ASSIGN ROOM NUMBER MODAL --- */}
      {selectedBookingForRoomAssign && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c12] border border-amber-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 font-mono-tech">
            <h3 className="font-bold text-white text-base">Assign Room Number for {selectedBookingForRoomAssign.guestName}</h3>
            <form onSubmit={handleAssignRoomNumberSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Enter Room Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 305"
                  value={assignedRoomNumberInput}
                  onChange={(e) => setAssignedRoomNumberInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-bold"
                />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setSelectedBookingForRoomAssign(null)} className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold uppercase">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold uppercase shadow-md">Save Room Number</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
