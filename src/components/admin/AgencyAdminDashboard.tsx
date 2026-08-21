import React, { useState, useEffect } from 'react';
import {
  Car,
  UserCheck,
  CalendarCheck,
  CreditCard,
  Plus,
  Trash2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  AlertTriangle,
  Building2,
  ShieldCheck,
  Send,
  FileText,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  AdminUser,
  TravelAgencyPartner,
  AgencyVehicle,
  AgencyDriver,
  AdminBookingRecord,
  PartnerBookingStatus,
  HotelPartner,
  StayPermission,
} from '../../types/admin';
import { AdminService } from '../../services/adminService';

interface AgencyAdminDashboardProps {
  currentUser: AdminUser;
  activeTab: string;
}

export const AgencyAdminDashboard: React.FC<AgencyAdminDashboardProps> = ({
  currentUser,
  activeTab,
}) => {
  const [agency, setAgency] = useState<TravelAgencyPartner | null>(null);
  const [vehicles, setVehicles] = useState<AgencyVehicle[]>([]);
  const [drivers, setDrivers] = useState<AgencyDriver[]>([]);
  const [bookings, setBookings] = useState<AdminBookingRecord[]>([]);
  const [revenue, setRevenue] = useState<any>(null);
  const [stayPermissions, setStayPermissions] = useState<StayPermission[]>([]);
  const [hotelsList, setHotelsList] = useState<HotelPartner[]>([]);

  // Modals
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isRequestStayOpen, setIsRequestStayOpen] = useState(false);

  // New Stay Request Form
  const [stayGuestName, setStayGuestName] = useState('');
  const [stayGuestEmail, setStayGuestEmail] = useState('');
  const [stayGuestPhone, setStayGuestPhone] = useState('+91 ');
  const [stayIdType, setStayIdType] = useState<'Aadhaar' | 'Passport' | 'Driver License' | 'Voter ID'>('Aadhaar');
  const [stayIdNumber, setStayIdNumber] = useState('');
  const [stayHotelId, setStayHotelId] = useState('');
  const [stayCheckIn, setStayCheckIn] = useState('2026-09-10');
  const [stayCheckOut, setStayCheckOut] = useState('2026-09-14');
  const [stayNights, setStayNights] = useState(4);
  const [staySpecial, setStaySpecial] = useState('');

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

  // Vehicle Form State
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newVehicleReg, setNewVehicleReg] = useState('');
  const [newVehicleType, setNewVehicleType] = useState<AgencyVehicle['type']>('Luxury Sedan');
  const [newVehicleSeats, setNewVehicleSeats] = useState(4);
  const [vehicleError, setVehicleError] = useState<string | null>(null);

  // Driver Form State
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('+91 ');
  const [newDriverLicense, setNewDriverLicense] = useState('');
  const [driverError, setDriverError] = useState<string | null>(null);

  const refreshData = () => {
    if (!currentUser.agencyId) return;
    try {
      const agencies = AdminService.getAgencies(currentUser);
      const myAgency = agencies.find((a) => a.id === currentUser.agencyId) || null;
      setAgency(myAgency);
      setVehicles(AdminService.getVehicles(currentUser, currentUser.agencyId));
      setDrivers(AdminService.getDrivers(currentUser, currentUser.agencyId));
      setBookings(AdminService.getBookings(currentUser));
      setRevenue(AdminService.calculateRevenue(currentUser));
      setStayPermissions(AdminService.getStayPermissions(currentUser));
      setHotelsList(AdminService.getHotels(currentUser));
    } catch (e) {
      console.error('Failed to load agency data', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const handleCreateStayRequest = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedHotel = hotelsList.find((h) => h.id === stayHotelId) || hotelsList[0];
      AdminService.createStayPermissionRequest(
        {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          agencyId: agency?.id,
          agencyName: agency?.name,
        },
        {
          guestName: stayGuestName,
          guestEmail: stayGuestEmail,
          guestPhone: stayGuestPhone,
          idProofType: stayIdType,
          idProofNumber: stayIdNumber,
          hotelId: selectedHotel?.id || 'HOTEL_001',
          hotelName: selectedHotel?.name || 'Grand Goa Luxury Resort & Spa',
          checkInDate: stayCheckIn,
          checkOutDate: stayCheckOut,
          stayDurationNights: stayNights,
          specialInstructions: staySpecial,
        }
      );
      setIsRequestStayOpen(false);
      refreshData();
      alert('Stay permission request submitted successfully to hotel owner!');
    } catch (err: any) {
      alert(err.message || 'Failed to submit stay permission request.');
    }
  };

  const handleBookingStatus = (bookingId: string, status: PartnerBookingStatus) => {
    AdminService.updateBookingStatus(currentUser, bookingId, status);
    refreshData();
  };

  const handleVehicleStatusChange = (vehicleId: string, status: AgencyVehicle['status']) => {
    AdminService.updateVehicleStatus(currentUser, vehicleId, status);
    refreshData();
  };

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicleError(null);
    if (!currentUser.agencyId || !agency) return;

    const res = AdminService.addVehicle(currentUser, {
      agencyId: currentUser.agencyId,
      agencyName: agency.name,
      model: newVehicleModel.trim(),
      registrationNumber: newVehicleReg.trim().toUpperCase(),
      type: newVehicleType as any,
      capacity: Number(newVehicleSeats),
      pricePerDay: 5000,
      currency: '₹',
      features: ['Air Conditioning', 'Leather Seating', 'Live GPS Tracking'],
      status: 'AVAILABLE',
    });

    if (res.success) {
      setIsAddVehicleOpen(false);
      setNewVehicleModel('');
      setNewVehicleReg('');
      refreshData();
    } else {
      setVehicleError(res.error || 'Failed to add vehicle');
    }
  };

  const handleAddDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDriverError(null);
    if (!currentUser.agencyId || !agency) return;

    const res = AdminService.addDriver(currentUser, {
      agencyId: currentUser.agencyId,
      agencyName: agency.name,
      name: newDriverName.trim(),
      phone: newDriverPhone.trim(),
      licenseNumber: newDriverLicense.trim().toUpperCase(),
      status: 'AVAILABLE',
      rating: 5.0,
      tripsCompleted: 0,
    });

    if (res.success) {
      setIsAddDriverOpen(false);
      setNewDriverName('');
      setNewDriverPhone('+91 ');
      setNewDriverLicense('');
      refreshData();
    } else {
      setDriverError(res.error || 'Failed to add driver');
    }
  };

  // Delete Handlers
  const promptDeleteVehicle = (vehicle: AgencyVehicle) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Delete Vehicle',
      description: `Are you sure you want to remove ${vehicle.model} (${vehicle.registrationNumber}) from your fleet?`,
      onConfirm: () => {
        const res = AdminService.deleteVehicle(currentUser, vehicle.id);
        if (res.success) {
          refreshData();
        } else {
          alert(res.error || 'Failed to delete vehicle');
        }
        setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const promptDeleteDriver = (driver: AgencyDriver) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Delete Driver',
      description: `Are you sure you want to remove driver ${driver.name} (${driver.phone}) from your agency roster?`,
      onConfirm: () => {
        const res = AdminService.deleteDriver(currentUser, driver.id);
        if (res.success) {
          refreshData();
        } else {
          alert(res.error || 'Failed to delete driver');
        }
        setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const promptDeleteBooking = (booking: AdminBookingRecord) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Delete Booking Record',
      description: `Are you sure you want to delete dispatch booking ${booking.bookingCode} for ${booking.customerName}?`,
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
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">In Transit</span>;
      case 'CHECKED_OUT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">Completed</span>;
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
          {/* Agency Header Card */}
          {agency && (
            <div className="p-6 rounded-2xl bg-[#0f0f18] border border-zinc-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Car className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-100">{agency.name}</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {agency.city} • Contact: {agency.contactPerson} ({agency.phone})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddVehicleOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>
            </div>
          )}

          {/* Metric Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400 uppercase">Available Vehicles</span>
              <p className="text-3xl font-bold text-emerald-400 mt-2">
                {vehicles.filter((v) => v.status === 'AVAILABLE').length}
                <span className="text-xs text-zinc-500 font-normal ml-2">/ {vehicles.length} fleet</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400 uppercase">Active Chauffeurs</span>
              <p className="text-3xl font-bold text-blue-400 mt-2">{drivers.length}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400 uppercase">Dispatch Bookings</span>
              <p className="text-3xl font-bold text-amber-400 mt-2">{bookings.length}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400 uppercase">Total Revenue</span>
              <p className="text-3xl font-bold text-zinc-100 mt-2">
                ₹{revenue ? revenue.grossRevenue.toLocaleString() : 0}
              </p>
            </div>
          </div>

          {/* Vehicles Quick View */}
          <div className="p-6 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-zinc-100">Fleet Quick Status</h3>
              <button
                onClick={() => setIsAddVehicleOpen(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                + Add Vehicle
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 group hover:border-zinc-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-100">{v.model}</h4>
                      <span className="text-xs text-amber-400 font-bold">{v.registrationNumber}</span>
                    </div>
                    <button
                      onClick={() => promptDeleteVehicle(v)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 p-1 cursor-pointer transition-opacity"
                      title="Delete Vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800">
                    <span className="text-zinc-400">{v.capacity} Seater</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.status === 'AVAILABLE'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. FLEET (VEHICLES) TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'fleet' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg text-zinc-100">Vehicle Fleet Roster</h2>
              <p className="text-xs text-zinc-400">Manage vehicles, license plates, seating capacities, and delete options</p>
            </div>

            <button
              onClick={() => setIsAddVehicleOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>

          <div className="bg-[#0f0f18] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
                <tr>
                  <th className="p-4">Vehicle Model</th>
                  <th className="p-4">License Plate</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Seats</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Update Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-zinc-900/50">
                    <td className="p-4 font-bold text-zinc-100">{v.model}</td>
                    <td className="p-4 font-bold text-amber-400">{v.registrationNumber}</td>
                    <td className="p-4 text-zinc-300">{v.type.replace('_', ' ')}</td>
                    <td className="p-4 text-zinc-300">{v.capacity} Passengers</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          v.status === 'AVAILABLE'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : v.status === 'ON_TRIP'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={v.status}
                        onChange={(e) =>
                          handleVehicleStatusChange(v.id, e.target.value as AgencyVehicle['status'])
                        }
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="ON_TRIP">On Trip</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => promptDeleteVehicle(v)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Delete Vehicle"
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
      {/* 3. DRIVERS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'drivers' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg text-zinc-100">Professional Chauffeurs & Drivers</h2>
              <p className="text-xs text-zinc-400">Driver profiles, license records, and ratings</p>
            </div>

            <button
              onClick={() => setIsAddDriverOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Driver</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-3 relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 text-amber-400 font-bold flex items-center justify-center text-sm">
                      {d.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-100">{d.name}</h4>
                      <p className="text-xs text-zinc-400">{d.phone}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => promptDeleteDriver(d)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Delete Driver"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-zinc-300 space-y-1">
                  <p>Commercial License: <span className="font-mono text-zinc-200">{d.licenseNumber}</span></p>
                  <p>Completed Trips: <span className="font-bold text-zinc-100">{d.tripsCompleted || d.totalTrips || 0}</span></p>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-bold">★ {d.rating} Rating</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.status === 'AVAILABLE'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. STAY PERMISSION REQUESTER TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'stay-permissions' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Hotel Stay Permission Requests
              </h2>
              <p className="text-xs text-zinc-400">Request and track digital room stay permits for your group travelers at partner hotels</p>
            </div>

            <button
              onClick={() => setIsRequestStayOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Request Hotel Stay Permission</span>
            </button>
          </div>

          <div className="bg-[#0f0f18] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
                <tr>
                  <th className="p-4">Stay Pass Code</th>
                  <th className="p-4">Traveler / Guest</th>
                  <th className="p-4">ID Proof</th>
                  <th className="p-4">Partner Hotel</th>
                  <th className="p-4">Stay Dates</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {stayPermissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500">
                      No stay permission requests created yet. Click "Request Hotel Stay Permission" to submit.
                    </td>
                  </tr>
                ) : (
                  stayPermissions.map((perm) => (
                    <tr key={perm.id} className="hover:bg-zinc-900/50">
                      <td className="p-4 font-mono font-bold text-amber-400">{perm.stayPassCode}</td>
                      <td className="p-4">
                        <span className="font-bold text-zinc-100 block">{perm.guestName}</span>
                        <span className="text-zinc-400 text-[11px]">{perm.guestPhone}</span>
                      </td>
                      <td className="p-4 text-zinc-300">
                        <span className="block font-medium">{perm.idProofType}</span>
                        <span className="text-zinc-500 font-mono text-[11px]">{perm.idProofNumber}</span>
                      </td>
                      <td className="p-4 font-semibold text-zinc-200">
                        {perm.hotelName}
                        {perm.roomNumber && <span className="block text-emerald-400 text-[11px]">Room #{perm.roomNumber}</span>}
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
                      <td className="p-4 text-xs font-semibold text-emerald-400">
                        {perm.verificationStatus}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. DISPATCH BOOKINGS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'bookings' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg text-zinc-100">Transit & Tour Bookings</h2>
              <p className="text-xs text-zinc-400">All customer transport bookings assigned to your agency</p>
            </div>
          </div>

          <div className="bg-[#0f0f18] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
                <tr>
                  <th className="p-4">Booking Code</th>
                  <th className="p-4">Passenger</th>
                  <th className="p-4">Vehicle Model</th>
                  <th className="p-4">Route / Date</th>
                  <th className="p-4">Amount</th>
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
                    <td className="p-4 text-zinc-300">{b.vehicleModel || 'Luxury Chariot'}</td>
                    <td className="p-4 text-zinc-400">
                      {b.origin} → {b.destination} ({b.travelDate})
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
                            Start Trip
                          </button>
                        )}
                        {b.bookingStatus === 'CHECKED_IN' && (
                          <button
                            onClick={() => handleBookingStatus(b.id, 'CHECKED_OUT')}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
                          >
                            Complete
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
      {/* MODAL: ADD VEHICLE */}
      {/* ------------------------------------------------------------- */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0f0f18] border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-4 text-left"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-zinc-100">ADD VEHICLE TO FLEET</h3>
              <button
                onClick={() => setIsAddVehicleOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {vehicleError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs">
                {vehicleError}
              </div>
            )}

            <form onSubmit={handleAddVehicleSubmit} className="space-y-3">
              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Vehicle Make & Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mercedes-Benz E-Class or Toyota Innova Hycross"
                  value={newVehicleModel}
                  onChange={(e) => setNewVehicleModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Registration / License Plate</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GA-07-VIP-9999"
                  value={newVehicleReg}
                  onChange={(e) => setNewVehicleReg(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Vehicle Category</label>
                <select
                  value={newVehicleType}
                  onChange={(e) => setNewVehicleType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                >
                  <option value="LUXURY_SEDAN">Luxury Sedan</option>
                  <option value="EXECUTIVE_SUV">Executive SUV</option>
                  <option value="ROYAL_COACH">Royal Coach / Sprinter</option>
                  <option value="PREMIUM_VAN">Premium Van</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Passenger Seating Capacity</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={newVehicleSeats}
                  onChange={(e) => setNewVehicleSeats(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddVehicleOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold cursor-pointer"
                >
                  Register Vehicle
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD DRIVER */}
      {/* ------------------------------------------------------------- */}
      {isAddDriverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0f0f18] border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4 text-left"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-zinc-100">REGISTER NEW DRIVER</h3>
              <button
                onClick={() => setIsAddDriverOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {driverError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs">
                {driverError}
              </div>
            )}

            <form onSubmit={handleAddDriverSubmit} className="space-y-3">
              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Driver Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Naik"
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newDriverPhone}
                  onChange={(e) => setNewDriverPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Commercial Driving License No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL-GA-07-2024-8899"
                  value={newDriverLicense}
                  onChange={(e) => setNewDriverLicense(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddDriverOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-zinc-950 font-bold cursor-pointer"
                >
                  Add Driver
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* REQUEST STAY PERMISSION MODAL */}
      {/* ------------------------------------------------------------- */}
      {isRequestStayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0f0f18] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Request Hotel Stay Permission
              </h3>
              <button
                onClick={() => setIsRequestStayOpen(false)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStayRequest} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">Traveler / Guest Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={stayGuestName}
                    onChange={(e) => setStayGuestName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">Guest Phone</label>
                  <input
                    type="text"
                    required
                    value={stayGuestPhone}
                    onChange={(e) => setStayGuestPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Guest Email</label>
                <input
                  type="email"
                  required
                  placeholder="rahul.sharma@example.com"
                  value={stayGuestEmail}
                  onChange={(e) => setStayGuestEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">ID Proof Type</label>
                  <select
                    value={stayIdType}
                    onChange={(e) => setStayIdType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver License">Driver License</option>
                    <option value="Voter ID">Voter ID</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">ID Proof Number</label>
                  <input
                    type="text"
                    required
                    placeholder="4821 9012 3341"
                    value={stayIdNumber}
                    onChange={(e) => setStayIdNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Select Partner Hotel</label>
                <select
                  value={stayHotelId}
                  onChange={(e) => setStayHotelId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 font-semibold"
                >
                  <option value="">Select Hotel...</option>
                  {hotelsList.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">Check-In</label>
                  <input
                    type="date"
                    required
                    value={stayCheckIn}
                    onChange={(e) => setStayCheckIn(e.target.value)}
                    className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">Check-Out</label>
                  <input
                    type="date"
                    required
                    value={stayCheckOut}
                    onChange={(e) => setStayCheckOut(e.target.value)}
                    className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">Nights</label>
                  <input
                    type="number"
                    min={1}
                    value={stayNights}
                    onChange={(e) => setStayNights(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Special Instructions / Preferences</label>
                <input
                  type="text"
                  placeholder="e.g. VIP guest, late check-in at 10 PM"
                  value={staySpecial}
                  onChange={(e) => setStaySpecial(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsRequestStayOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Stay Request</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
