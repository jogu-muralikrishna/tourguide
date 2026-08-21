import React, { useState, useEffect } from 'react';
import {
  Shield,
  Building2,
  Car,
  Users,
  CalendarCheck,
  CreditCard,
  History,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Clock,
  Key,
  X,
  Phone,
  Mail,
  MapPin,
  FileSpreadsheet,
  AlertCircle,
  Eye,
  AlertTriangle,
  ShieldCheck,
  KeyRound,
  Send,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AdminUser,
  AdminRole,
  AdminPermission,
  HotelPartner,
  TravelAgencyPartner,
  AdminBookingRecord,
  AdminCustomerProfile,
  AdminAuditRecord,
  PartnerBookingStatus,
  AdminPreAuthCredential,
  StayPermission,
} from '../../types/admin';
import { AdminService } from '../../services/adminService';

interface SuperAdminDashboardProps {
  currentUser: AdminUser;
  activeTab: string;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  currentUser,
  activeTab,
}) => {
  // Data States
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [hotels, setHotels] = useState<HotelPartner[]>([]);
  const [agencies, setAgencies] = useState<TravelAgencyPartner[]>([]);
  const [bookings, setBookings] = useState<AdminBookingRecord[]>([]);
  const [customers, setCustomers] = useState<AdminCustomerProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditRecord[]>([]);
  const [revenue, setRevenue] = useState<any>(null);
  const [preAuthCredentials, setPreAuthCredentials] = useState<AdminPreAuthCredential[]>([]);
  const [stayPermissionsList, setStayPermissionsList] = useState<StayPermission[]>([]);

  // Pre-Auth Generator Form
  const [isGenerateGrantOpen, setIsGenerateGrantOpen] = useState(false);
  const [grantEmail, setGrantEmail] = useState('');
  const [grantPassword, setGrantPassword] = useState('');
  const [grantTargetRole, setGrantTargetRole] = useState<'HOTEL_ADMIN' | 'AGENCY_ADMIN'>('HOTEL_ADMIN');
  const [grantPartnerName, setGrantPartnerName] = useState('');
  const [grantError, setGrantError] = useState<string | null>(null);
  const [grantSuccess, setGrantSuccess] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false);
  const [isAddAgencyOpen, setIsAddAgencyOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomerProfile | null>(null);

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

  // New Admin Form State
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('SUB_ADMIN');
  const [newAdminHotelId, setNewAdminHotelId] = useState('');
  const [newAdminAgencyId, setNewAdminAgencyId] = useState('');
  const [newAdminPermissions, setNewAdminPermissions] = useState<AdminPermission[]>([
    'VIEW_BOOKINGS',
    'MANAGE_BOOKINGS',
    'VIEW_CUSTOMERS',
  ]);
  const [adminError, setAdminError] = useState<string | null>(null);

  // New Hotel Form State
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelCity, setNewHotelCity] = useState('Goa, India');
  const [newHotelAddress, setNewHotelAddress] = useState('');
  const [newHotelPhone, setNewHotelPhone] = useState('+91 98765 43210');
  const [newHotelRating, setNewHotelRating] = useState(4.9);
  const [newHotelImage, setNewHotelImage] = useState(
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  );

  // New Agency Form State
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyCity, setNewAgencyCity] = useState('Goa, India');
  const [newAgencyContact, setNewAgencyContact] = useState('');
  const [newAgencyPhone, setNewAgencyPhone] = useState('+91 91234 56789');

  // Load and refresh all data
  const refreshAllData = () => {
    try {
      setAdmins(AdminService.getAdmins(currentUser));
      setHotels(AdminService.getHotels(currentUser));
      setAgencies(AdminService.getAgencies(currentUser));
      setBookings(AdminService.getBookings(currentUser));
      setCustomers(AdminService.getCustomers(currentUser));
      setAuditLogs(AdminService.getAuditLogs(currentUser));
      setRevenue(AdminService.calculateRevenue(currentUser));
      setPreAuthCredentials(AdminService.getPreAuthCredentials(currentUser));
      setStayPermissionsList(AdminService.getStayPermissions(currentUser));
    } catch (e) {
      console.error('Error loading admin data', e);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [currentUser]);

  const handleGenerateGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGrantError(null);
    setGrantSuccess(null);
    try {
      const grant = AdminService.generatePartnerCredential(
        currentUser,
        grantEmail,
        grantPassword,
        grantTargetRole,
        grantPartnerName
      );
      setGrantSuccess(`Authorization Passcode generated! Email: ${grant.email} | Password: ${grant.tempPassword}`);
      setGrantEmail('');
      setGrantPassword('');
      setGrantPartnerName('');
      refreshAllData();
    } catch (err: any) {
      setGrantError(err.message || 'Failed to generate pre-authorization credential');
    }
  };

  const handleVerifyPartner = (partnerType: 'HOTEL' | 'AGENCY', partnerId: string, approve: boolean) => {
    try {
      AdminService.verifyPartnerRegistration(currentUser, partnerType, partnerId, approve, 'Verified by Super Admin');
      refreshAllData();
    } catch (err: any) {
      alert(err.message || 'Verification update failed.');
    }
  };

  // --- Handlers ---
  const handleBookingStatusChange = (bookingId: string, newStatus: PartnerBookingStatus) => {
    AdminService.updateBookingStatus(currentUser, bookingId, newStatus);
    refreshAllData();
  };

  const handleCreateAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    const res = AdminService.createAdmin(currentUser, {
      name: newAdminName,
      email: newAdminEmail,
      password: newAdminPassword,
      role: newAdminRole,
      hotelId: newAdminRole === 'HOTEL_ADMIN' ? newAdminHotelId : undefined,
      agencyId: newAdminRole === 'AGENCY_ADMIN' ? newAdminAgencyId : undefined,
      permissions: newAdminPermissions,
    });

    if (res.success) {
      setIsAddAdminOpen(false);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      refreshAllData();
    } else {
      setAdminError(res.error || 'Failed to create administrator account.');
    }
  };

  const handleCreateHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = AdminService.addHotel(currentUser, {
      name: newHotelName,
      city: newHotelCity,
      address: newHotelAddress,
      phone: newHotelPhone,
      email: `concierge@${newHotelName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      rating: Number(newHotelRating),
      image: newHotelImage,
      amenities: ['Private Beachfront', 'Infinity Pool', 'Michelin Respite Dining', 'Spa & Wellness'],
      status: 'ACTIVE',
      roomCount: 12,
    });

    if (res.success) {
      setIsAddHotelOpen(false);
      setNewHotelName('');
      setNewHotelAddress('');
      refreshAllData();
    }
  };

  const handleCreateAgencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = AdminService.addAgency(currentUser, {
      name: newAgencyName,
      city: newAgencyCity,
      address: `${newAgencyCity}, India`,
      contactPerson: newAgencyContact,
      email: `dispatch@${newAgencyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: newAgencyPhone,
      rating: 4.9,
      status: 'ACTIVE',
      vehicleCount: 8,
      driverCount: 6,
    });

    if (res.success) {
      setIsAddAgencyOpen(false);
      setNewAgencyName('');
      setNewAgencyContact('');
      refreshAllData();
    }
  };

  // --- Deletion Actions with Confirmation ---
  const promptDeleteAdmin = (admin: AdminUser) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Delete Administrator',
      description: `Are you sure you want to delete ${admin.name} (${admin.email})? This user will no longer be able to log in.`,
      onConfirm: () => {
        const res = AdminService.deleteAdmin(currentUser, admin.id);
        if (res.success) {
          refreshAllData();
        } else {
          alert(res.error || 'Failed to delete admin');
        }
        setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const promptDeleteHotel = (hotel: HotelPartner) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Delete Hotel Partner',
      description: `Are you sure you want to delete ${hotel.name}? All associated room inventories will also be removed.`,
      onConfirm: () => {
        const res = AdminService.deleteHotel(currentUser, hotel.id);
        if (res.success) {
          refreshAllData();
        } else {
          alert(res.error || 'Failed to delete hotel');
        }
        setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const promptDeleteAgency = (agency: TravelAgencyPartner) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Delete Travel Agency',
      description: `Are you sure you want to delete ${agency.name}? All assigned vehicles and driver profiles will also be removed.`,
      onConfirm: () => {
        const res = AdminService.deleteAgency(currentUser, agency.id);
        if (res.success) {
          refreshAllData();
        } else {
          alert(res.error || 'Failed to delete agency');
        }
        setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const promptDeleteBooking = (booking: AdminBookingRecord) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Delete Booking Record',
      description: `Are you sure you want to delete booking ${booking.bookingCode} for ${booking.customerName}?`,
      onConfirm: () => {
        const res = AdminService.deleteBooking(currentUser, booking.id);
        if (res.success) {
          refreshAllData();
        }
        setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const promptDeleteCustomer = (customer: AdminCustomerProfile) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Delete Customer Profile',
      description: `Are you sure you want to delete customer record for ${customer.name} (${customer.email})?`,
      onConfirm: () => {
        const res = AdminService.deleteCustomer(currentUser, customer.id);
        if (res.success) {
          refreshAllData();
        }
        setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleExportCSV = () => {
    let csv = 'data:text/csv;charset=utf-8,Booking ID,Customer Name,Email,Destination,Total Price,Status,Date\n';
    bookings.forEach((b) => {
      csv += `"${b.bookingCode}","${b.customerName}","${b.customerEmail}","${b.destination}","${b.totalPrice}","${b.bookingStatus}","${b.createdAt}"\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'TourGuide_Bookings_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 hover:border-amber-500/40 transition-all shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                  Total Bookings
                </span>
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <CalendarCheck className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-zinc-100 mt-2">{bookings.length}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-amber-400 font-medium">
                <span>{bookings.filter((b) => b.bookingStatus === 'PENDING').length} Pending review</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 hover:border-emerald-500/40 transition-all shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                  Total Platform Revenue
                </span>
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-400 mt-2">
                ₹{revenue ? revenue.grossRevenue.toLocaleString() : 0}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                <span>Net: ₹{revenue ? revenue.netRevenue.toLocaleString() : 0}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 hover:border-blue-500/40 transition-all shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                  Hotels & Agencies
                </span>
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-400 mt-2">
                {hotels.length + agencies.length}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                <span>{hotels.length} Hotels • {agencies.length} Agencies</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 hover:border-purple-500/40 transition-all shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                  Verified Customers
                </span>
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-purple-400 mt-2">{customers.length}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                <span>Active Profiles</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Bookings */}
          <div className="p-6 rounded-2xl bg-[#0f0f18] border border-zinc-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
              <div>
                <h3 className="font-bold text-base text-zinc-100">
                  Recent Customer Bookings
                </h3>
                <p className="text-xs text-zinc-400">Live booking activity from travelers</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="pb-3 font-semibold">Booking Code</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Hotel / Route</th>
                    <th className="pb-3 font-semibold">Dates</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {bookings.slice(0, 6).map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-900/40">
                      <td className="py-3 font-bold text-amber-400">{b.bookingCode}</td>
                      <td className="py-3">
                        <span className="font-semibold text-zinc-100 block">{b.customerName}</span>
                        <span className="text-zinc-400 text-[11px]">{b.customerEmail}</span>
                      </td>
                      <td className="py-3 text-zinc-300">
                        {b.hotelName || b.vehicleModel || `${b.origin} → ${b.destination}`}
                      </td>
                      <td className="py-3 text-zinc-400">
                        {b.checkInDate || b.travelDate}
                      </td>
                      <td className="py-3 font-bold text-emerald-400">
                        {b.currency}
                        {b.totalPrice.toLocaleString()}
                      </td>
                      <td className="py-3">{renderStatusBadge(b.bookingStatus)}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.bookingStatus === 'PENDING' && (
                            <button
                              onClick={() => handleBookingStatusChange(b.id, 'CONFIRMED')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs cursor-pointer"
                            >
                              Confirm
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
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ADMINISTRATORS (RBAC) TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'admins' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg text-zinc-100">
                Administrator Accounts & Access
              </h2>
              <p className="text-xs text-zinc-400">
                Create and manage passwords, roles, and permissions for all admins and partners
              </p>
            </div>

            <button
              onClick={() => setIsAddAdminOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Admin</span>
            </button>
          </div>

          <div className="bg-[#0f0f18] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
                  <tr>
                    <th className="p-4 font-semibold">Admin Name</th>
                    <th className="p-4 font-semibold">Email & Login</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Assigned Hotel / Agency</th>
                    <th className="p-4 font-semibold">Permissions</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {admins.map((adm) => (
                    <tr key={adm.id} className="hover:bg-zinc-900/50">
                      <td className="p-4">
                        <span className="font-bold text-zinc-100 block">{adm.name}</span>
                        {adm.id === currentUser.id && (
                          <span className="text-[10px] text-amber-400 font-semibold">(Current You)</span>
                        )}
                      </td>
                      <td className="p-4 text-zinc-300">
                        <span className="font-medium block">{adm.email}</span>
                        <span className="text-xs text-[#D4AF37] font-mono font-bold block">Password: {adm.password || 'admin123'}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                            adm.role === 'SUPER_ADMIN'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : adm.role === 'HOTEL_ADMIN'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : adm.role === 'AGENCY_ADMIN'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          {adm.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-300">
                        {adm.hotelName || adm.agencyName || 'Global Platform'}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {adm.permissions?.slice(0, 3).map((p) => (
                            <span
                              key={p}
                              className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-400"
                            >
                              {p}
                            </span>
                          ))}
                          {(adm.permissions?.length || 0) > 3 && (
                            <span className="text-[9px] text-zinc-500">
                              +{(adm.permissions?.length || 0) - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            adm.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {adm.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {adm.id !== currentUser.id && (
                          <button
                            onClick={() => promptDeleteAdmin(adm)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Delete Admin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. SANCTUARY HOTELS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'hotels' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg text-zinc-100">Partner Hotels & Resorts</h2>
              <p className="text-xs text-zinc-400">
                Manage luxury hotel enclaves, addresses, contacts, and room capacities
              </p>
            </div>

            <button
              onClick={() => setIsAddHotelOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Hotel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-3 relative group"
              >
                <div className="h-36 rounded-xl overflow-hidden bg-zinc-800 relative">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/80 text-amber-300 font-bold text-xs backdrop-blur-sm">
                    ★ {hotel.rating}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-100">{hotel.name}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{hotel.address}</p>
                  </div>

                  <button
                    onClick={() => promptDeleteHotel(hotel)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Delete Hotel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <span>Phone: {hotel.phone}</span>
                  <span className="font-bold text-amber-400">{hotel.roomCount || hotel.totalRooms || 0} Rooms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. TRAVEL AGENCIES TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'agencies' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg text-zinc-100">Travel Agencies & Fleet Providers</h2>
              <p className="text-xs text-zinc-400">
                Manage partner transit agencies, chauffeur fleets, and dispatch routes
              </p>
            </div>

            <button
              onClick={() => setIsAddAgencyOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Travel Agency</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agencies.map((agency) => (
              <div
                key={agency.id}
                className="p-5 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-100">{agency.name}</h4>
                      <p className="text-xs text-zinc-400">{agency.city}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => promptDeleteAgency(agency)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Delete Agency"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-zinc-300 space-y-1 pt-1">
                  <p>Contact Person: <span className="text-zinc-100 font-semibold">{agency.contactPerson}</span></p>
                  <p>Direct Line: <span className="text-zinc-400">{agency.phone}</span></p>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold">★ {agency.rating} Rated</span>
                  <span className="text-zinc-400 font-semibold">{agency.vehicleCount || agency.totalFleet || 0} Vehicles in Fleet</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. CUSTOMER DIRECTORY TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'customers' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg text-zinc-100">Customer & Traveler Directory</h2>
              <p className="text-xs text-zinc-400">
                All registered travelers, total bookings placed, and lifetime spend
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-[#0f0f18] border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Total Bookings</th>
                  <th className="p-4">Total Spent</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {customers
                  .filter(
                    (c) =>
                      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.email.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((customer) => (
                    <tr key={customer.id} className="hover:bg-zinc-900/50">
                      <td className="p-4 font-bold text-zinc-100">{customer.name}</td>
                      <td className="p-4 text-zinc-300">{customer.email}</td>
                      <td className="p-4 text-zinc-400">{customer.phone}</td>
                      <td className="p-4 text-zinc-300">{customer.city}</td>
                      <td className="p-4 font-bold text-amber-400">
                        {customer.totalBookings} Trips
                      </td>
                      <td className="p-4 font-bold text-emerald-400">
                        ₹{customer.totalSpent.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-amber-300 cursor-pointer"
                          >
                            View History
                          </button>
                          <button
                            onClick={() => promptDeleteCustomer(customer)}
                            className="p-1 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Delete Customer"
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
      {/* 6. BOOKINGS LEDGER TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'bookings' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg text-zinc-100">All Reservations & Bookings</h2>
              <p className="text-xs text-zinc-400">Complete booking ledger with real-time status controls</p>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>

          <div className="bg-[#0f0f18] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
                <tr>
                  <th className="p-4">Booking Code</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Hotel / Route</th>
                  <th className="p-4">Dates</th>
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
                    <td className="p-4 text-zinc-300">
                      {b.hotelName || b.vehicleModel || `${b.origin} → ${b.destination}`}
                    </td>
                    <td className="p-4 text-zinc-400">
                      {b.checkInDate || b.travelDate}
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
                            onClick={() => handleBookingStatusChange(b.id, 'CONFIRMED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}
                        {b.bookingStatus === 'CONFIRMED' && (
                          <button
                            onClick={() => handleBookingStatusChange(b.id, 'CANCELLED')}
                            className="px-2 py-1 rounded-lg bg-red-950 text-red-300 border border-red-500/30 text-xs cursor-pointer"
                          >
                            Cancel
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
      {/* 7. AUDIT LOGS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'audit' && (
        <div className="space-y-5">
          <div>
            <h2 className="font-bold text-lg text-zinc-100">Security Audit Logs</h2>
            <p className="text-xs text-zinc-400">Complete immutable record of all admin and partner actions</p>
          </div>

          <div className="bg-[#0f0f18] border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Admin / Actor</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Details</th>
                  <th className="p-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {auditLogs.slice(0, 30).map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/50">
                    <td className="p-4 text-zinc-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-zinc-200 block">{log.actorName}</span>
                      <span className="text-zinc-500 text-[10px]">{log.actorEmail}</span>
                    </td>
                    <td className="p-4 font-bold text-amber-300">{log.action}</td>
                    <td className="p-4 text-zinc-300 max-w-md">{log.details}</td>
                    <td className="p-4 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.result === 'SUCCESS'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {log.result}
                      </span>
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
      {/* MODAL: CREATE ADMIN */}
      {/* ------------------------------------------------------------- */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0f0f18] border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-4 text-xs text-left"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-zinc-100">CREATE ADMINISTRATOR ACCOUNT</h3>
              <button
                onClick={() => setIsAddAdminOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {adminError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs">
                {adminError}
              </div>
            )}

            <form onSubmit={handleCreateAdminSubmit} className="space-y-3">
              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Email (Login ID)</label>
                <input
                  type="email"
                  required
                  placeholder="manager@hotel.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter strong password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Role</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as AdminRole)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                >
                  <option value="SUB_ADMIN">Staff / Sub Admin (Granular Permissions)</option>
                  <option value="HOTEL_ADMIN">Hotel Partner Admin (Isolated to Hotel)</option>
                  <option value="AGENCY_ADMIN">Travel Agency Admin (Isolated to Agency)</option>
                  <option value="SUPER_ADMIN">Super Administrator (Full Access)</option>
                </select>
              </div>

              {newAdminRole === 'HOTEL_ADMIN' && (
                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">Select Assigned Hotel</label>
                  <select
                    required
                    value={newAdminHotelId}
                    onChange={(e) => setNewAdminHotelId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                  >
                    <option value="">-- Choose Hotel --</option>
                    {hotels.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.city})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {newAdminRole === 'AGENCY_ADMIN' && (
                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">Select Assigned Agency</label>
                  <select
                    required
                    value={newAdminAgencyId}
                    onChange={(e) => setNewAdminAgencyId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                  >
                    <option value="">-- Choose Agency --</option>
                    {agencies.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.city})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddAdminOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold cursor-pointer"
                >
                  Save & Activate
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CREATE HOTEL */}
      {/* ------------------------------------------------------------- */}
      {isAddHotelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0f0f18] border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4 text-left"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-zinc-100">REGISTER HOTEL PARTNER</h3>
              <button
                onClick={() => setIsAddHotelOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHotelSubmit} className="space-y-3">
              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Hotel Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taj Exotica Resort & Spa"
                  value={newHotelName}
                  onChange={(e) => setNewHotelName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">City / Location</label>
                <input
                  type="text"
                  required
                  value={newHotelCity}
                  onChange={(e) => setNewHotelCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Full Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Benaulim Beach, South Goa"
                  value={newHotelAddress}
                  onChange={(e) => setNewHotelAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newHotelPhone}
                  onChange={(e) => setNewHotelPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddHotelOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold cursor-pointer"
                >
                  Add Hotel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CREATE AGENCY */}
      {/* ------------------------------------------------------------- */}
      {isAddAgencyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0f0f18] border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-4 text-left"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-zinc-100">REGISTER TRAVEL AGENCY</h3>
              <button
                onClick={() => setIsAddAgencyOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAgencySubmit} className="space-y-3">
              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Agency Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Goa Luxury Chariots"
                  value={newAgencyName}
                  onChange={(e) => setNewAgencyName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">City Hub</label>
                <input
                  type="text"
                  required
                  value={newAgencyCity}
                  onChange={(e) => setNewAgencyCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Contact Person</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Deshmukh"
                  value={newAgencyContact}
                  onChange={(e) => setNewAgencyContact(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newAgencyPhone}
                  onChange={(e) => setNewAgencyPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddAgencyOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold cursor-pointer"
                >
                  Add Agency
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MASTER VERIFICATION & CREDENTIAL GENERATOR HUB TAB */}
      {/* ------------------------------------------------------------- */}
      {(activeTab === 'verification' || activeTab === 'credentials') && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
                Master Verification & Credential Passcode Hub
              </h2>
              <p className="text-xs text-zinc-400">
                Issue authorized email & password credentials to new Hotels/Agencies and verify partner registration applications
              </p>
            </div>

            <button
              onClick={() => setIsGenerateGrantOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <KeyRound className="w-4 h-4" />
              <span>Issue Pre-Auth Passcode</span>
            </button>
          </div>

          {/* Active Pre-Authorization Credentials List */}
          <div className="p-6 rounded-2xl bg-[#0f0f18] border border-amber-500/30 space-y-4">
            <h3 className="font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Admin Pre-Authorized Partner Passcodes ({preAuthCredentials.length})
            </h3>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Partner / Business Name</th>
                    <th className="p-3">Target Role</th>
                    <th className="p-3">Authorized Email</th>
                    <th className="p-3">Passcode / Password</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Issued By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {preAuthCredentials.map((cred) => (
                    <tr key={cred.id} className="hover:bg-zinc-900/50">
                      <td className="p-3 font-bold text-zinc-100">{cred.partnerName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cred.targetRole === 'HOTEL_ADMIN' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {cred.targetRole === 'HOTEL_ADMIN' ? 'HOTEL OWNER' : 'TRAVEL AGENCY'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-zinc-300">{cred.email}</td>
                      <td className="p-3 font-mono font-bold text-amber-400">{cred.tempPassword}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cred.status === 'ACTIVE_PENDING_REGISTRATION' ? 'bg-amber-500/20 text-amber-300 animate-pulse' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {cred.status}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-400">{cred.createdByAdminName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Verification Applications */}
          <div className="p-6 rounded-2xl bg-[#0f0f18] border border-zinc-800 space-y-4">
            <h3 className="font-bold text-sm text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Partner Registration & Verification Pipeline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hotels */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="font-bold text-xs text-blue-400 uppercase tracking-wider">Hotels Pending Verification</h4>
                {hotels.map((h) => (
                  <div key={h.id} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-zinc-100">{h.name}</p>
                      <p className="text-[11px] text-zinc-400">{h.city} • {h.email}</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">License: {h.businessLicenseNumber || 'N/A'}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleVerifyPartner('HOTEL', h.id, true)}
                        className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-[11px]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyPartner('HOTEL', h.id, false)}
                        className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[11px]"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Agencies */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">Agencies Pending Verification</h4>
                {agencies.map((a) => (
                  <div key={a.id} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-zinc-100">{a.name}</p>
                      <p className="text-[11px] text-zinc-400">{a.city} • {a.email}</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">License: {a.businessLicenseNumber || 'N/A'}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleVerifyPartner('AGENCY', a.id, true)}
                        className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-[11px]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyPartner('AGENCY', a.id, false)}
                        className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[11px]"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: GENERATE PRE-AUTH PASSCODE */}
      {/* ------------------------------------------------------------- */}
      {isGenerateGrantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0f0f18] border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-4 text-left"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                ISSUE PARTNER PRE-AUTH PASSCODE
              </h3>
              <button
                onClick={() => {
                  setIsGenerateGrantOpen(false);
                  setGrantError(null);
                  setGrantSuccess(null);
                }}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {grantError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs">
                {grantError}
              </div>
            )}

            {grantSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-xs font-mono">
                {grantSuccess}
              </div>
            )}

            <form onSubmit={handleGenerateGrantSubmit} className="space-y-3">
              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Target Partner Role</label>
                <select
                  value={grantTargetRole}
                  onChange={(e) => setGrantTargetRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 font-semibold"
                >
                  <option value="HOTEL_ADMIN">Hotel Owner Portal</option>
                  <option value="AGENCY_ADMIN">Travel Agency Portal</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Partner / Entity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Goa Beachfront Resort"
                  value={grantPartnerName}
                  onChange={(e) => setGrantPartnerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Pre-Authorized Email</label>
                <input
                  type="email"
                  required
                  placeholder="hotel.test@grandresort.com"
                  value={grantEmail}
                  onChange={(e) => setGrantEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Authorized Passcode / Password</label>
                <input
                  type="text"
                  required
                  placeholder="HotelPass2026!"
                  value={grantPassword}
                  onChange={(e) => setGrantPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsGenerateGrantOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold cursor-pointer"
                >
                  Generate Passcode
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="w-full max-w-lg bg-[#0c0c16] border-l border-zinc-800 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto text-left"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="font-bold text-base text-zinc-100">{selectedCustomer.name}</h3>
                  <p className="text-xs text-zinc-400">{selectedCustomer.email}</p>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                <div>
                  <span className="text-zinc-400 block text-[11px]">Phone</span>
                  <span className="text-zinc-100 font-semibold">{selectedCustomer.phone}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Origin City</span>
                  <span className="text-zinc-100 font-semibold">{selectedCustomer.city}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Total Bookings</span>
                  <span className="text-amber-400 font-bold">{selectedCustomer.totalBookings} Trips</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Total Spent</span>
                  <span className="text-emerald-400 font-bold">₹{selectedCustomer.totalSpent.toLocaleString()}</span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
                Booking History
              </h4>

              <div className="space-y-2.5">
                {bookings
                  .filter((b) => b.customerId === selectedCustomer.id)
                  .map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-xl bg-[#0f0f18] border border-zinc-800 text-xs space-y-1"
                    >
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-amber-400">{b.bookingCode}</span>
                        {renderStatusBadge(b.bookingStatus)}
                      </div>
                      <p className="text-zinc-200">{b.hotelName || b.vehicleModel || b.destination}</p>
                      <p className="text-[11px] text-zinc-400">
                        {b.checkInDate || b.travelDate} • ₹{b.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold mt-6 cursor-pointer"
            >
              Close Drawer
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
