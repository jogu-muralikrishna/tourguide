import React, { useState, useEffect } from 'react';
import {
  Building2,
  BedDouble,
  Users,
  CalendarCheck,
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  QrCode,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  AdminUser,
  HotelPartner,
  HotelRoom,
  AdminBookingRecord,
  AdminCustomerProfile,
  PartnerBookingStatus,
  StayPermission,
} from '../../types/admin';
import { AdminService } from '../../services/adminService';

interface HotelAdminDashboardProps {
  currentUser: AdminUser;
  activeTab: string;
}

export const HotelAdminDashboard: React.FC<HotelAdminDashboardProps> = ({
  currentUser,
  activeTab,
}) => {
  const [hotel, setHotel] = useState<HotelPartner | null>(null);
  const [rooms, setRooms] = useState<HotelRoom[]>([]);
  const [bookings, setBookings] = useState<AdminBookingRecord[]>([]);
  const [guests, setGuests] = useState<AdminCustomerProfile[]>([]);
  const [revenue, setRevenue] = useState<any>(null);
  const [stayPermissions, setStayPermissions] = useState<StayPermission[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Drawers
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<AdminCustomerProfile | null>(null);
  const [selectedStayPassModal, setSelectedStayPassModal] = useState<StayPermission | null>(null);

  // Delete Confirmation Dialog State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // New Room Form
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomType, setNewRoomType] = useState<HotelRoom['roomType']>('Deluxe Suite');
  const [newRoomCapacity, setNewRoomCapacity] = useState(2);
  const [newRoomPrice, setNewRoomPrice] = useState(8500);
  const [roomError, setRoomError] = useState<string | null>(null);

  const refreshData = () => {
    if (!currentUser.hotelId) return;
    try {
      const h = AdminService.getHotelById(currentUser, currentUser.hotelId);
      setHotel(h);
      setRooms(AdminService.getRooms(currentUser, currentUser.hotelId));
      setBookings(AdminService.getBookings(currentUser));
      setGuests(AdminService.getCustomers(currentUser));
      setRevenue(AdminService.calculateRevenue(currentUser));
      setStayPermissions(AdminService.getStayPermissions(currentUser));
    } catch (e) {
      console.error('Failed to load hotel admin data', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const handleGrantStayPermission = (permId: string, roomId?: string, roomNumber?: string) => {
    try {
      AdminService.grantStayPermission(currentUser, permId, roomId, roomNumber);
      refreshData();
    } catch (e: any) {
      alert(e.message || 'Failed to grant stay permission');
    }
  };

  const handleCheckInStay = (permId: string) => {
    try {
      AdminService.processGuestCheckIn(currentUser, permId);
      refreshData();
    } catch (e: any) {
      alert(e.message || 'Failed to process check-in');
    }
  };

  const handleCheckOutStay = (permId: string) => {
    try {
      AdminService.processGuestCheckOut(currentUser, permId);
      refreshData();
    } catch (e: any) {
      alert(e.message || 'Failed to process check-out');
    }
  };

  const handleBookingStatus = (bookingId: string, status: PartnerBookingStatus) => {
    AdminService.updateBookingStatus(currentUser, bookingId, status);
    refreshData();
  };

  const handleRoomStatusChange = (roomId: string, status: HotelRoom['status']) => {
    AdminService.updateRoomStatus(currentUser, roomId, status);
    refreshData();
  };

  const handleAddRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRoomError(null);

    if (!currentUser.hotelId) return;

    const res = AdminService.addRoom(currentUser, {
      hotelId: currentUser.hotelId,
      roomNumber: newRoomNumber.trim(),
      roomType: newRoomType,
      capacity: Number(newRoomCapacity),
      pricePerNight: Number(newRoomPrice),
      currency: '₹',
      status: 'AVAILABLE',
      amenities: ['King Bed', 'Ocean Balcony', 'High-Speed WiFi', 'Marble Bath'],
    });

    if (res.success) {
      setIsAddRoomOpen(false);
      setNewRoomNumber('');
      refreshData();
    } else {
      setRoomError(res.error || 'Failed to add room.');
    }
  };

  // Delete Handlers
  const promptDeleteRoom = (room: HotelRoom) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Delete Room',
      description: `Are you sure you want to remove Room ${room.roomNumber} (${room.roomType}) from your inventory?`,
      onConfirm: () => {
        const res = AdminService.deleteRoom(currentUser, room.id);
        if (res.success) {
          refreshData();
        } else {
          alert(res.error || 'Failed to delete room');
        }
        setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const promptDeleteBooking = (booking: AdminBookingRecord) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Delete Booking Record',
      description: `Are you sure you want to delete reservation ${booking.bookingCode} for ${booking.customerName}?`,
      onConfirm: () => {
        const res = AdminService.deleteBooking(currentUser, booking.id);
        if (res.success) {
          refreshData();
        }
        setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Confirmed</span>;
      case 'PENDING':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">Pending</span>;
      case 'CHECKED_IN':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">Checked In</span>;
      case 'CHECKED_OUT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">Checked Out</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/40">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs bg-zinc-800 text-zinc-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 text-zinc-100">
      {/* ------------------------------------------------------------- */}
      {/* 1. OVERVIEW TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Hotel Header Card */}
          {hotel && (
            <div className="p-6 rounded-2xl bg-[#0f0f18] border border-zinc-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-100">{hotel.name}</h2>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {hotel.address}</span>
                    <span className="text-amber-400 font-semibold">★ {hotel.rating} Rating</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddRoomOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Room</span>
                </button>
              </div>
            </div>
          )}

          {/* Metric Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400 uppercase">Available Rooms</span>
              <p className="text-3xl font-bold text-emerald-400 mt-2">
                {rooms.filter((r) => r.status === 'AVAILABLE').length}
                <span className="text-xs text-zinc-500 font-normal ml-2">/ {rooms.length} total</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400 uppercase">Active Bookings</span>
              <p className="text-3xl font-bold text-amber-400 mt-2">{bookings.length}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400 uppercase">Total Revenue</span>
              <p className="text-3xl font-bold text-zinc-100 mt-2">
                ₹{revenue ? revenue.grossRevenue.toLocaleString() : 0}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400 uppercase">Total Guests</span>
              <p className="text-3xl font-bold text-purple-400 mt-2">{guests.length}</p>
            </div>
          </div>

          {/* Quick Room Grid */}
          <div className="p-6 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-zinc-100">Room Status & Inventory</h3>
              <button
                onClick={() => setIsAddRoomOpen(true)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                + Add New Room
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between relative group hover:border-zinc-700"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-base text-zinc-100">#{room.roomNumber}</span>
                    <button
                      onClick={() => promptDeleteRoom(room)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity p-1 cursor-pointer"
                      title="Delete Room"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-1">{room.roomType}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        room.status === 'AVAILABLE'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : room.status === 'OCCUPIED'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {room.status}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-semibold">
                      ₹{room.pricePerNight}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ROOMS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'rooms' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg text-zinc-100">Room & Suite Inventory</h2>
              <p className="text-xs text-zinc-400">Manage room status, pricing, and delete inactive rooms</p>
            </div>

            <button
              onClick={() => setIsAddRoomOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Room</span>
            </button>
          </div>

          <div className="bg-[#0f0f18] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
                <tr>
                  <th className="p-4">Room No.</th>
                  <th className="p-4">Suite Category</th>
                  <th className="p-4">Guest Capacity</th>
                  <th className="p-4">Price / Night</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4">Change Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-zinc-900/50">
                    <td className="p-4 font-bold text-base text-amber-400">#{room.roomNumber}</td>
                    <td className="p-4 font-semibold text-zinc-200">{room.roomType}</td>
                    <td className="p-4 text-zinc-300">{room.capacity} Guests</td>
                    <td className="p-4 font-bold text-emerald-400">
                      ₹{room.pricePerNight.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          room.status === 'AVAILABLE'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : room.status === 'OCCUPIED'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={room.status}
                        onChange={(e) =>
                          handleRoomStatusChange(room.id, e.target.value as HotelRoom['status'])
                        }
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="OCCUPIED">Occupied</option>
                        <option value="CLEANING">Cleaning</option>
                        <option value="MAINTENANCE">Maintenance</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => promptDeleteRoom(room)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Delete Room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. BOOKINGS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'bookings' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg text-zinc-100">Guest Bookings & Check-ins</h2>
              <p className="text-xs text-zinc-400">Manage incoming traveler reservations for your hotel</p>
            </div>
          </div>

          <div className="bg-[#0f0f18] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
                <tr>
                  <th className="p-4">Booking Code</th>
                  <th className="p-4">Guest Name</th>
                  <th className="p-4">Room Type</th>
                  <th className="p-4">Check-In / Out</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-900/50">
                    <td className="p-4 font-bold text-amber-400">{b.bookingCode}</td>
                    <td className="p-4">
                      <span className="font-bold text-zinc-100 block">{b.customerName}</span>
                      <span className="text-zinc-400 text-[11px]">{b.customerPhone}</span>
                    </td>
                    <td className="p-4 text-zinc-300">{b.roomType || 'Deluxe Suite'}</td>
                    <td className="p-4 text-zinc-400">
                      {b.checkInDate} to {b.checkOutDate}
                    </td>
                    <td className="p-4 font-bold text-emerald-400">
                      {b.currency}
                      {b.totalPrice.toLocaleString()}
                    </td>
                    <td className="p-4">{renderStatusBadge(b.bookingStatus)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.bookingStatus === 'PENDING' && (
                          <button
                            onClick={() => handleBookingStatus(b.id, 'CONFIRMED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs cursor-pointer"
                          >
                            Accept
                          </button>
                        )}
                        {b.bookingStatus === 'CONFIRMED' && (
                          <button
                            onClick={() => handleBookingStatus(b.id, 'CHECKED_IN')}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                          >
                            Check In
                          </button>
                        )}
                        {b.bookingStatus === 'CHECKED_IN' && (
                          <button
                            onClick={() => handleBookingStatus(b.id, 'CHECKED_OUT')}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
                          >
                            Check Out
                          </button>
                        )}
                        <button
                          onClick={() => promptDeleteBooking(b)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STAY PERMISSIONS & GUEST VERIFICATION HUB TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'stay-permissions' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Stay Permission & Check-In Verification Desk
              </h2>
              <p className="text-xs text-zinc-400">
                Grant digital room stay permissions to travel agency clients and verify guest check-ins
              </p>
            </div>
          </div>

          <div className="bg-[#0f0f18] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
                <tr>
                  <th className="p-4">Stay Pass Code</th>
                  <th className="p-4">Guest Info</th>
                  <th className="p-4">ID Proof</th>
                  <th className="p-4">Assigned Room</th>
                  <th className="p-4">Agency / Source</th>
                  <th className="p-4">Stay Dates</th>
                  <th className="p-4">Permission Status</th>
                  <th className="p-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {stayPermissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-zinc-500">
                      No stay permission requests registered yet.
                    </td>
                  </tr>
                ) : (
                  stayPermissions.map((perm) => (
                    <tr key={perm.id} className="hover:bg-zinc-900/50">
                      <td className="p-4 font-mono font-bold text-amber-400">
                        {perm.stayPassCode}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-zinc-100 block">{perm.guestName}</span>
                        <span className="text-zinc-400 text-[11px]">{perm.guestPhone}</span>
                      </td>
                      <td className="p-4 text-zinc-300">
                        <span className="block font-medium">{perm.idProofType}</span>
                        <span className="text-zinc-500 font-mono text-[11px]">{perm.idProofNumber}</span>
                      </td>
                      <td className="p-4">
                        {perm.roomNumber ? (
                          <span className="font-bold text-emerald-400">Room #{perm.roomNumber}</span>
                        ) : (
                          <select
                            onChange={(e) => {
                              const [rid, rnum] = e.target.value.split('|');
                              if (rid) handleGrantStayPermission(perm.id, rid, rnum);
                            }}
                            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                            defaultValue=""
                          >
                            <option value="" disabled>Assign Room & Grant</option>
                            {rooms.filter((r) => r.status === 'AVAILABLE').map((r) => (
                              <option key={r.id} value={`${r.id}|${r.roomNumber}`}>
                                Room #{r.roomNumber} ({r.roomType})
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="p-4 text-zinc-400">
                        {perm.agencyName || 'Direct Traveler'}
                      </td>
                      <td className="p-4 text-zinc-300">
                        {perm.checkInDate} → {perm.checkOutDate} ({perm.stayDurationNights}N)
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            perm.permissionStatus === 'GRANTED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : perm.permissionStatus === 'CHECKED_IN'
                              ? 'bg-blue-500/20 text-blue-300'
                              : perm.permissionStatus === 'CHECKED_OUT'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {perm.permissionStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {perm.permissionStatus === 'PENDING_APPROVAL' && (
                            <button
                              onClick={() => handleGrantStayPermission(perm.id, rooms[0]?.id, rooms[0]?.roomNumber)}
                              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow"
                            >
                              Grant Stay Pass
                            </button>
                          )}
                          {perm.permissionStatus === 'GRANTED' && (
                            <button
                              onClick={() => handleCheckInStay(perm.id)}
                              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                            >
                              Check In Guest
                            </button>
                          )}
                          {perm.permissionStatus === 'CHECKED_IN' && (
                            <button
                              onClick={() => handleCheckOutStay(perm.id)}
                              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
                            >
                              Check Out
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === 'guests' && (
        <div className="space-y-5">
          <div>
            <h2 className="font-bold text-lg text-zinc-100">Hotel Guest Directory</h2>
            <p className="text-xs text-zinc-400">All guests who have stayed or booked at your hotel</p>
          </div>

          <div className="bg-[#0f0f18] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
                <tr>
                  <th className="p-4">Guest Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Total Stays</th>
                  <th className="p-4">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {guests.map((g) => (
                  <tr key={g.id} className="hover:bg-zinc-900/50">
                    <td className="p-4 font-bold text-zinc-100">{g.name}</td>
                    <td className="p-4 text-zinc-300">{g.email}</td>
                    <td className="p-4 text-zinc-400">{g.phone}</td>
                    <td className="p-4 font-bold text-amber-400">{g.totalBookings} Stays</td>
                    <td className="p-4 font-bold text-emerald-400">
                      ₹{g.totalSpent.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0f0f18] border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-left"
          >
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-100">{deleteConfirm.title}</h3>
                <p className="text-xs text-zinc-400">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {deleteConfirm.description}
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteConfirm.onConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD ROOM */}
      {/* ------------------------------------------------------------- */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0f0f18] border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4 text-left"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-zinc-100">ADD NEW ROOM TO HOTEL</h3>
              <button
                onClick={() => setIsAddRoomOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {roomError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs">
                {roomError}
              </div>
            )}

            <form onSubmit={handleAddRoomSubmit} className="space-y-3">
              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Room Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 301 or V-10"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Room Type / Category</label>
                <select
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                >
                  <option value="Deluxe Suite">Deluxe Suite</option>
                  <option value="Executive Beach Villa">Executive Beach Villa</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                  <option value="Pool Villa">Pool Villa</option>
                  <option value="Garden Suite">Garden Suite</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Guest Capacity</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  required
                  value={newRoomCapacity}
                  onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Price Per Night (₹)</label>
                <input
                  type="number"
                  min={500}
                  step={100}
                  required
                  value={newRoomPrice}
                  onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-zinc-950 font-bold cursor-pointer"
                >
                  Add Room
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
