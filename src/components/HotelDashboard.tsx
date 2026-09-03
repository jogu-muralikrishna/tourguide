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
  X
} from 'lucide-react';
import { AuthRoleUser, fetchHotelRoomsApi, createHotelRoomApi, updateHotelRoomStatusApi, fetchGuestVerificationsApi, verifyGuestMobileApi } from '../services/api';
import { formatINR } from '../utils/pricing';

interface HotelDashboardProps {
  user: AuthRoleUser;
  onLogout: () => void;
}

export const HotelDashboard: React.FC<HotelDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'verifications' | 'guests' | 'reports'>('overview');
  const [rooms, setRooms] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New Room Form Modal
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomType, setNewRoomType] = useState<'Deluxe Suite' | 'Presidential Villa' | 'Luxury Oceanfront' | 'Heritage Suite' | 'Standard Villa'>('Deluxe Suite');
  const [newRoomPrice, setNewRoomPrice] = useState('8500');
  const [newRoomCapacity, setNewRoomCapacity] = useState('2');
  const [roomError, setRoomError] = useState<string | null>(null);

  // Verification Search Bar
  const [verifyMobileInput, setVerifyMobileInput] = useState('');
  const [verifyTokenInput, setVerifyTokenInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const loadHotelData = async () => {
    setIsLoading(true);
    try {
      const roomList = await fetchHotelRoomsApi();
      setRooms(roomList);
      const verifList = await fetchGuestVerificationsApi();
      setVerifications(verifList);
    } catch (err) {
      console.warn('loadHotelData error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHotelData();
  }, []);

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
        hotelName: user.hotelName || user.name,
        hotelId: user.hotelId || 'hotel-leela-palace',
      });
      if (res.room) {
        setRooms((prev) => [res.room, ...prev]);
      }
      setIsAddRoomOpen(false);
      setNewRoomNumber('');
      setRoomError(null);
      alert(`Room ${newRoomNumber} Created Successfully!`);
    } catch (err: any) {
      setRoomError(err.message || 'Failed to create room.');
    }
  };

  const handleToggleRoomStatus = async (roomId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
    try {
      await updateHotelRoomStatusApi(roomId, nextStatus);
      setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, status: nextStatus } : r)));
    } catch (err: any) {
      alert(err.message || 'Failed to update room status.');
    }
  };

  const handleVerifyGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyMobileInput.trim() && !verifyTokenInput.trim()) {
      alert('Please enter either a Mobile Number or Verification Token.');
      return;
    }
    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const res = await verifyGuestMobileApi(verifyMobileInput.trim(), verifyTokenInput.trim());
      setVerifyResult(res);
      await loadHotelData();
    } catch (err: any) {
      setVerifyResult({ valid: false, message: err.message || 'Verification Failed.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'OCCUPIED').length;
  const availableRooms = rooms.filter((r) => r.status === 'AVAILABLE').length;

  return (
    <div className="min-h-screen bg-[#07070A] text-zinc-100 flex flex-col font-sans">
      
      {/* Hotel Dashboard Header */}
      <header className="px-6 py-4 bg-[#0E0E14] border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif-luxury text-white">
                {user.hotelName || user.name || 'Grand Palace Hotel'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono-tech font-bold uppercase">
                🟢 Verified Hotel Partner
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono-tech">
              Hotel Partner Workspace • Isolated Property Data Management
            </p>
          </div>
        </div>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-[#14141B] hover:bg-[#20202A] border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-mono-tech font-bold flex items-center gap-1.5 transition-all cursor-pointer mr-1"
          >
            <span>← Back to Previous Page</span>
          </button>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white font-mono-tech">{user.email}</div>
            <div className="text-[10px] text-emerald-400 font-mono-tech">Role: HOTEL_ADMIN</div>
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
          { id: 'overview', label: 'Hotel Overview', icon: Building2 },
          { id: 'rooms', label: `Rooms & Suites (${totalRooms})`, icon: Bed },
          { id: 'verifications', label: 'Guest Verification & Mobile', icon: ShieldCheck },
          { id: 'guests', label: 'Guest Stays & Bookings', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 border-b-2 font-bold uppercase transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4 text-emerald-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dashboard Body Content */}
      <main className="p-6 max-w-7xl mx-auto w-full flex-1 space-y-6">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono-tech">
          <div className="p-4 rounded-2xl bg-[#0E0E14] border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] text-zinc-400 uppercase font-bold flex items-center justify-between">
              <span>Total Rooms</span>
              <Bed className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalRooms}</div>
            <div className="text-[10px] text-emerald-400 mt-1">Property Inventory</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0E0E14] border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] text-zinc-400 uppercase font-bold flex items-center justify-between">
              <span>Available Rooms</span>
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-sky-400 mt-2">{availableRooms}</div>
            <div className="text-[10px] text-zinc-400 mt-1">Ready for Check-in</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0E0E14] border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] text-zinc-400 uppercase font-bold flex items-center justify-between">
              <span>Occupied Rooms</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-2">{occupiedRooms}</div>
            <div className="text-[10px] text-zinc-400 mt-1">Checked-in Guests</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0E0E14] border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] text-zinc-400 uppercase font-bold flex items-center justify-between">
              <span>Mobile Verified Guests</span>
              <Phone className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-2">
              {verifications.filter((v) => v.verificationStatus === 'VERIFIED').length}
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">100% Security Compliant</div>
          </div>
        </div>

        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Quick Guest Verification Scanner Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0D1812] via-[#0E0E14] to-[#0A0A0E] border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono-tech">
                    Hotel Guest & Mobile Verification Terminal
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Verify traveler token hashes, mobile numbers, and reservation status before room check-in.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyGuest} className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tech">
                <div>
                  <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1">
                    Guest Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={verifyMobileInput}
                    onChange={(e) => setVerifyMobileInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14141C] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1">
                    Booking ID / Voucher Token
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TGAI-BKG-2026-84920"
                    value={verifyTokenInput}
                    onChange={(e) => setVerifyTokenInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14141C] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isVerifying ? 'Verifying...' : 'Verify Guest Credentials'}</span>
                  </button>
                </div>
              </form>

              {verifyResult && (
                <div className={`p-4 rounded-2xl border text-xs font-mono-tech ${
                  verifyResult.valid ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-red-950/40 border-red-500/50 text-red-300'
                }`}>
                  <div className="font-bold text-sm mb-1">{verifyResult.valid ? '🟢 Verification SUCCESS' : '❌ Verification FAILED'}</div>
                  <div>{verifyResult.message}</div>
                  {verifyResult.verification && (
                    <div className="mt-2 pt-2 border-t border-emerald-500/30 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div>Guest: <strong>{verifyResult.verification.guestName}</strong></div>
                      <div>Mobile: <strong>{verifyResult.verification.mobileNumber}</strong></div>
                      <div>Status: <strong>{verifyResult.verification.verificationStatus}</strong></div>
                      <div>Room Type: <strong>{verifyResult.verification.roomType}</strong></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rooms Overview Grid */}
            <div className="p-6 rounded-3xl bg-[#0E0E14] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono-tech font-bold uppercase text-white flex items-center gap-2">
                  <Bed className="w-4 h-4 text-emerald-400" />
                  <span>Rooms & Suites Inventory</span>
                </h3>
                <button
                  onClick={() => setIsAddRoomOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Room</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <div key={room.id} className="p-4 rounded-2xl bg-[#14141C] border border-zinc-800 space-y-3 font-mono-tech">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-bold text-white">Room {room.roomNumber}</div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        room.status === 'AVAILABLE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-400 font-semibold">{room.roomType}</div>
                    <div className="text-xs text-zinc-300">Rate: <strong>{formatINR(room.pricePerNight)}</strong> / Night</div>
                    <button
                      onClick={() => handleToggleRoomStatus(room.id, room.status)}
                      className="w-full py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white cursor-pointer transition-colors"
                    >
                      Toggle Status ({room.status === 'AVAILABLE' ? 'Mark Occupied' : 'Mark Available'})
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* --- ROOMS TAB --- */}
        {activeTab === 'rooms' && (
          <div className="p-6 rounded-3xl bg-[#0E0E14] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-mono-tech font-bold text-white">
                Hotel Room Inventory ({rooms.length})
              </h3>
              <button
                onClick={() => setIsAddRoomOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Room</span>
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#0C0C12] overflow-hidden">
              <table className="w-full text-left text-xs font-mono-tech">
                <thead className="bg-[#12121A] text-zinc-400 border-b border-zinc-800 uppercase">
                  <tr>
                    <th className="p-3.5">Room No</th>
                    <th className="p-3.5">Room Type</th>
                    <th className="p-3.5">Capacity</th>
                    <th className="p-3.5">Nightly Rate</th>
                    <th className="p-3.5">Current Guest</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td className="p-3.5 font-bold text-white">{room.roomNumber}</td>
                      <td className="p-3.5 text-emerald-400 font-semibold">{room.roomType}</td>
                      <td className="p-3.5">{room.capacity || 2} Persons</td>
                      <td className="p-3.5 font-bold text-emerald-400">{formatINR(room.pricePerNight)}</td>
                      <td className="p-3.5">
                        {room.currentGuestName ? (
                          <div>
                            <div className="font-bold text-white">{room.currentGuestName}</div>
                            <div className="text-[10px] text-zinc-500">{room.currentGuestPhone}</div>
                          </div>
                        ) : (
                          <span className="text-zinc-500 italic">None</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          room.status === 'AVAILABLE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleRoomStatus(room.id, room.status)}
                          className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white cursor-pointer"
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- GUEST VERIFICATION TAB --- */}
        {activeTab === 'verifications' && (
          <div className="p-6 rounded-3xl bg-[#0E0E14] border border-zinc-800 space-y-4">
            <h3 className="text-base font-mono-tech font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Mobile Verification & Guest Credentials</span>
            </h3>

            <div className="rounded-2xl border border-zinc-800 bg-[#0C0C12] overflow-hidden">
              <table className="w-full text-left text-xs font-mono-tech">
                <thead className="bg-[#12121A] text-zinc-400 border-b border-zinc-800 uppercase">
                  <tr>
                    <th className="p-3.5">Booking Token</th>
                    <th className="p-3.5">Guest Name</th>
                    <th className="p-3.5">Mobile Number & Verification</th>
                    <th className="p-3.5">Check-In / Out</th>
                    <th className="p-3.5">Room Type</th>
                    <th className="p-3.5">Status Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {verifications.map((v) => (
                    <tr key={v.id}>
                      <td className="p-3.5 font-bold text-emerald-400 font-mono">{v.bookingId}</td>
                      <td className="p-3.5 font-bold text-white">{v.guestName}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-white">{v.mobileNumber}</div>
                        <div className="text-[10px] text-zinc-500">{v.email}</div>
                      </td>
                      <td className="p-3.5">{v.checkInDate} → {v.checkOutDate}</td>
                      <td className="p-3.5 text-emerald-400">{v.roomType}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${
                          v.verificationStatus === 'VERIFIED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          <span>{v.verificationStatus === 'VERIFIED' ? '🟢 Verified' : '🟡 Pending'}</span>
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

      {/* Add New Room Modal */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono-tech">
          <div className="w-full max-w-md bg-[#0E0E14] border border-zinc-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base">Add New Hotel Room</h3>
              <button onClick={() => setIsAddRoomOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Room Number</label>
                <input
                  type="text"
                  placeholder="e.g. 104"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14141C] border border-zinc-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Room Type</label>
                <select
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14141C] border border-zinc-800 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Deluxe Suite">Deluxe Suite</option>
                  <option value="Presidential Villa">Presidential Villa</option>
                  <option value="Luxury Oceanfront">Luxury Oceanfront</option>
                  <option value="Heritage Suite">Heritage Suite</option>
                  <option value="Standard Villa">Standard Villa</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Nightly Rate (₹)</label>
                <input
                  type="number"
                  value={newRoomPrice}
                  onChange={(e) => setNewRoomPrice(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14141C] border border-zinc-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {roomError && <div className="text-red-400 text-xs font-bold">{roomError}</div>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
