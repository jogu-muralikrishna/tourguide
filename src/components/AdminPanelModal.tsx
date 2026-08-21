import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  X, 
  TrendingUp, 
  Users, 
  User,
  CheckCircle2, 
  XCircle, 
  Clock,
  DollarSign, 
  Download, 
  Trash2, 
  Ticket, 
  Search, 
  Filter, 
  Sparkles,
  Lock,
  Building2,
  Car,
  Key,
  Shield,
  ShieldCheck,
  RefreshCw,
  QrCode,
  Check,
  AlertCircle,
  Eye,
  Utensils,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText
} from 'lucide-react';
import { Booking, AdminRequest } from '../types';
import { AdminService } from '../services/adminService';
import { formatINR } from '../utils/pricing';
import { 
  AuthRoleUser, 
  fetchSystemRolesApi, 
  setAuthToken, 
  getAuthToken, 
  verifyTokenApi, 
  fetchAdminRequestsApi, 
  approveAdminRequestApi, 
  rejectAdminRequestApi 
} from '../services/api';

interface AdminPanelModalProps {
  isOpen: boolean;
  bookings: Booking[];
  onClose: () => void;
  onUpdateStatus: (id: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => void;
  onDeleteBooking: (id: string) => void;
  onViewTicket: (booking: Booking) => void;
  onRefreshData?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  bookings,
  onClose,
  onUpdateStatus,
  onDeleteBooking,
  onViewTicket,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'partner_requests' | 'verify_token'>('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [systemRoles, setSystemRoles] = useState<AuthRoleUser[]>([]);
  const [activeRoleEmail, setActiveRoleEmail] = useState<string>('admin@tourguide.com');
  const [activeRoleUser, setActiveRoleUser] = useState<AuthRoleUser | null>(null);

  // Selected Booking for Full Details Modal
  const [inspectBooking, setInspectBooking] = useState<Booking | null>(null);

  // Partner Requests State
  const [partnerRequests, setPartnerRequests] = useState<AdminRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Partner Approval Modal State
  const [approvingRequest, setApprovingRequest] = useState<AdminRequest | null>(null);
  const [approvalEmail, setApprovalEmail] = useState('');
  const [approvalPassword, setApprovalPassword] = useState('');
  const [approvalPartnerName, setApprovalPartnerName] = useState('');
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);

  // Token Verification State
  const [verifyTokenInput, setVerifyTokenInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; booking?: Booking; error?: string; message?: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const loadData = async () => {
    try {
      const roles = await fetchSystemRolesApi();
      setSystemRoles(roles);
      const currentToken = getAuthToken();
      const matched = roles.find((r) => r.email === currentToken) || roles[0];
      if (matched) {
        setActiveRoleEmail(matched.email);
        setActiveRoleUser(matched);
      }
      setIsLoadingRequests(true);
      const reqs = await fetchAdminRequestsApi();
      setPartnerRequests(reqs);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Role Switcher Auth Gate State
  const [targetRoleToSwitch, setTargetRoleToSwitch] = useState<AuthRoleUser | null>(null);
  const [roleSwitchPassword, setRoleSwitchPassword] = useState('');
  const [roleSwitchError, setRoleSwitchError] = useState<string | null>(null);

  const handleRoleChangeInitiate = (email: string) => {
    if (activeRoleEmail === email) return;
    const user = systemRoles.find((r) => r.email === email) || null;
    if (!user) return;
    setTargetRoleToSwitch(user);
    setRoleSwitchPassword('');
    setRoleSwitchError(null);
  };

  const handleConfirmRoleSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRoleToSwitch) return;

    const enteredPass = roleSwitchPassword.trim();
    let isMatch = false;

    if (targetRoleToSwitch.role === 'MAIN_ADMIN' && (enteredPass === 'admin@123' || enteredPass === 'admin123')) {
      isMatch = true;
    } else if (targetRoleToSwitch.role === 'HOTEL_ADMIN' && (enteredPass === 'hotel@123' || enteredPass === 'hotel123')) {
      isMatch = true;
    } else if (targetRoleToSwitch.role === 'TRAVEL_ADMIN' && (enteredPass === 'travel@123' || enteredPass === 'travel123' || enteredPass === 'agency123')) {
      isMatch = true;
    } else {
      const adminUsers = AdminService.getAdmins({ role: 'SUPER_ADMIN' } as any);
      const matchedUser = adminUsers.find((a) => a.email.toLowerCase() === targetRoleToSwitch.email.toLowerCase());
      if (matchedUser && (matchedUser.password === enteredPass || enteredPass === 'admin@123' || enteredPass === 'hotel@123' || enteredPass === 'travel@123')) {
        isMatch = true;
      }
    }

    if (isMatch) {
      setActiveRoleEmail(targetRoleToSwitch.email);
      setAuthToken(targetRoleToSwitch.email);
      setActiveRoleUser(targetRoleToSwitch);
      setTargetRoleToSwitch(null);
      setRoleSwitchError(null);
      if (onRefreshData) onRefreshData();
    } else {
      setRoleSwitchError('Invalid password for this admin account. Access denied.');
    }
  };

  // Handle Token Verification
  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyTokenInput.trim()) return;

    setIsVerifying(true);
    setVerifyResult(null);

    try {
      const res = await verifyTokenApi(verifyTokenInput.trim());
      setVerifyResult(res);
    } catch (err: any) {
      setVerifyResult({ valid: false, error: err.message || 'Verification service error' });
    } finally {
      setIsVerifying(false);
    }
  };

  // Open Approval Modal
  const openApprovalModal = (req: AdminRequest) => {
    setApprovingRequest(req);
    setApprovalEmail(req.email);
    const slug = req.businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
    setApprovalPassword(`${slug.slice(0, 6)}Pass@2026`);
    setApprovalPartnerName(req.businessName);
  };

  // Handle Confirm Approval & Create Credentials
  const handleConfirmApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingRequest || !approvalEmail.trim() || !approvalPassword.trim()) return;

    setIsSubmittingApproval(true);
    try {
      await approveAdminRequestApi(approvingRequest.id, {
        customEmail: approvalEmail.trim(),
        customPassword: approvalPassword.trim(),
        assignedHotelName: approvalPartnerName.trim(),
        assignedAgencyName: approvalPartnerName.trim(),
      });

      setApprovingRequest(null);
      await loadData();
      if (onRefreshData) onRefreshData();
      alert(`Account Created Successfully!\nPartner: ${approvalPartnerName}\nRole: ${approvingRequest.businessType}\nEmail: ${approvalEmail}\nPassword: ${approvalPassword}`);
    } catch (err: any) {
      alert(err.message || 'Approval failed');
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  // Handle Reject Partner Request
  const handleRejectRequest = async (id: string) => {
    try {
      await rejectAdminRequestApi(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Rejection failed');
    }
  };

  // Data isolation filter based on active role
  const isolatedBookings = bookings.filter((b) => {
    if (!activeRoleUser) return true;
    if (activeRoleUser.role === 'MAIN_ADMIN') return true;
    if (activeRoleUser.role === 'HOTEL_ADMIN') {
      return b.hotel && b.hotel.id === activeRoleUser.hotelId;
    }
    if (activeRoleUser.role === 'TRAVEL_ADMIN') {
      return Boolean(b.vehicle);
    }
    if (activeRoleUser.role === 'USER') {
      return (b.user.email || '').toLowerCase() === activeRoleUser.email.toLowerCase();
    }
    return true;
  });

  // Admin Metrics & Totals
  const totalBookings = isolatedBookings.length;
  const confirmedBookings = isolatedBookings.filter((b) => b.status === 'Confirmed').length;
  const pendingBookings = isolatedBookings.filter((b) => b.status === 'Pending').length;
  const cancelledBookings = isolatedBookings.filter((b) => b.status === 'Cancelled').length;

  // Unique Users Count
  const uniqueUsers = new Set(
    isolatedBookings.map((b) => b.userId || b.user.userId || b.user.email || b.user.phone)
  ).size;

  // Total Revenue (Sum of confirmed finalTotal)
  const totalRevenue = isolatedBookings
    .filter((b) => b.status === 'Confirmed')
    .reduce((sum, b) => {
      const amount = b.finalTotal || b.pricing?.finalTotal || b.pricing?.total || 0;
      return sum + amount;
    }, 0);

  const avgOrderValue = confirmedBookings > 0 ? Math.round(totalRevenue / confirmedBookings) : 0;

  // Advanced Search Across: User ID, Booking ID, Journey Token, Name, Email, Phone, Hotel, Travel Agency
  const filtered = isolatedBookings.filter((b) => {
    const matchesFilter = statusFilter === 'all' || b.status === statusFilter;
    const query = searchTerm.toLowerCase().trim();

    if (!query) return matchesFilter;

    const uId = (b.userId || b.user?.userId || '').toLowerCase();
    const bkgId = (b.bookingId || b.id || '').toLowerCase();
    const jToken = (b.journeyToken || b.id || '').toLowerCase();
    const name = (b.user?.fullName || '').toLowerCase();
    const email = (b.user?.email || '').toLowerCase();
    const phone = (b.user?.phone || '').toLowerCase();
    const hotelName = (b.hotel?.name || '').toLowerCase();
    const vehicleName = (b.vehicle?.name || '').toLowerCase();
    const fromCity = (b.from || '').toLowerCase();
    const toCity = (b.to || '').toLowerCase();

    const matchesSearch =
      uId.includes(query) ||
      bkgId.includes(query) ||
      jToken.includes(query) ||
      name.includes(query) ||
      email.includes(query) ||
      phone.includes(query) ||
      hotelName.includes(query) ||
      vehicleName.includes(query) ||
      fromCity.includes(query) ||
      toCity.includes(query);

    return matchesFilter && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = [
      'User ID',
      'Journey Token',
      'Booking ID',
      'User Name',
      'Email',
      'Phone',
      'From',
      'To',
      'Distance (km)',
      'Travel Time',
      'Number of People',
      'Start Date',
      'Start Time',
      'Car',
      'Car Cost (INR)',
      'Hotel',
      'Hotel Price/Night (INR)',
      'Hotel Nights',
      'Hotel Total (INR)',
      'Food Items Count',
      'Food Total (INR)',
      'Service Fee (INR)',
      'Tax (INR)',
      'Final Total (INR)',
      'Booking Status',
      'Created Date',
    ];

    const rows = isolatedBookings.map((b) => {
      const people = b.numberOfPeople || b.travelers || b.user?.numberOfPeople || 1;
      const carCost = b.carCost || b.pricing?.carCost || b.pricing?.vehicleCost || b.vehicle.price;
      const hotelRate = b.hotelPricePerNight || b.hotel?.pricePerNight || 0;
      const hotelTotal = b.hotelTotal || b.pricing?.hotelCost || (b.hotel ? hotelRate * (b.hotelNights || 1) : 0);
      const foodTotal = b.foodTotal || b.pricing?.foodCost || b.pricing?.pitstopCost || 0;
      const foodCount = b.selectedFoodItems ? b.selectedFoodItems.length : b.pitstops ? b.pitstops.length : 0;
      const finalAmt = b.finalTotal || b.pricing?.finalTotal || b.pricing?.total || 0;

      return [
        `"${b.userId || b.user.userId || ''}"`,
        `"${b.journeyToken || b.id}"`,
        `"${b.bookingId || b.id}"`,
        `"${b.user.fullName}"`,
        `"${b.user.email || ''}"`,
        `"${b.user.phone}"`,
        `"${b.from}"`,
        `"${b.to}"`,
        b.distanceKm || '',
        `"${b.durationText || b.vehicle.travelTime || ''}"`,
        people,
        `"${b.travelDate}"`,
        `"${b.travelTime || '08:00 AM'}"`,
        `"${b.vehicle.name}"`,
        carCost,
        `"${b.hotel?.name || 'Transit'}"`,
        hotelRate,
        b.hotelNights || 0,
        hotelTotal,
        foodCount,
        foodTotal,
        b.serviceFee || b.pricing?.serviceFee || 0,
        b.tax || b.pricing?.tax || 0,
        finalAmt,
        `"${b.status}"`,
        `"${new Date(b.createdAt).toISOString()}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TOURGUIDE_AI_MASTER_MANIFEST_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      
      <div className="relative w-full max-w-7xl my-6 bg-[#09090D] rounded-3xl border-2 border-[#D4AF37]/40 shadow-[0_0_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#17140B] via-[#1F1C10] to-[#0A0A0E] border-b border-[#D4AF37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-xl font-bold text-white">
                  Admin Command Dashboard
                </h3>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono-tech font-bold">
                  {activeRoleUser?.role || 'MAIN_ADMIN'}
                </span>
              </div>
              <div className="text-xs text-zinc-400 font-mono-tech">
                {activeRoleUser?.role === 'MAIN_ADMIN' && 'Main System Admin • Complete Platform Access'}
                {activeRoleUser?.role === 'HOTEL_ADMIN' && `Hotel Dashboard • ${activeRoleUser.hotelName}`}
                {activeRoleUser?.role === 'TRAVEL_ADMIN' && `Travel Agency Dashboard • ${activeRoleUser.agencyName}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              id="export-csv-btn"
              className="px-3 py-1.5 rounded-lg bg-[#14141B] hover:bg-[#20202A] border border-zinc-800 text-[#F3E5AB] text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onClose}
              id="close-admin-panel-btn"
              className="w-9 h-9 rounded-xl bg-[#14141B] hover:bg-[#20202A] text-zinc-400 hover:text-white flex items-center justify-center transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="px-6 py-3 bg-[#08080C] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-zinc-400">
            <Key className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="uppercase text-[11px] font-bold text-[#F3E5AB]">Active Dashboard View:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {systemRoles.map((roleUser) => {
              const isSelected = activeRoleEmail === roleUser.email;
              return (
                <button
                  key={roleUser.id}
                  onClick={() => handleRoleChangeInitiate(roleUser.email)}
                  className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB] font-bold shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                      : 'bg-[#121218] border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {roleUser.role === 'MAIN_ADMIN' && <ShieldAlert className="w-3 h-3 text-[#D4AF37]" />}
                  {roleUser.role === 'HOTEL_ADMIN' && <Building2 className="w-3 h-3 text-emerald-400" />}
                  {roleUser.role === 'TRAVEL_ADMIN' && <Car className="w-3 h-3 text-blue-400" />}
                  <span>{roleUser.name.split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- ROLE SWITCH PASSWORD AUTHENTICATION OVERLAY --- */}
        {targetRoleToSwitch && (
          <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b0b10] border border-[#D4AF37]/60 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Lock className="w-5 h-5" />
                  <h3 className="font-bold font-serif-luxury text-white text-lg">
                    Admin Password Required
                  </h3>
                </div>
                <button
                  onClick={() => setTargetRoleToSwitch(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-zinc-300 bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 space-y-1">
                <div>Role: <strong className="text-amber-300">{targetRoleToSwitch.role.replace('_', ' ')}</strong></div>
                <div>Account Name: <strong className="text-white">{targetRoleToSwitch.name}</strong></div>
                <div>Login Email: <strong className="text-emerald-400">{targetRoleToSwitch.email}</strong></div>
              </div>

              {roleSwitchError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-semibold">
                  {roleSwitchError}
                </div>
              )}

              <form onSubmit={handleConfirmRoleSwitch} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                    Enter Password for {targetRoleToSwitch.email}
                  </label>
                  <input
                    type="password"
                    value={roleSwitchPassword}
                    onChange={(e) => setRoleSwitchPassword(e.target.value)}
                    placeholder="Enter password..."
                    autoFocus
                    required
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-amber-500/50 text-amber-300 font-mono text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setTargetRoleToSwitch(null)}
                    className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold text-xs uppercase shadow-lg"
                  >
                    Authenticate & Switch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 bg-[#0E0E14] border-b border-zinc-800 flex items-center gap-4 text-xs font-mono-tech">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 border-b-2 font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-[#D4AF37] text-[#F3E5AB]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {activeRoleUser?.role === 'HOTEL_ADMIN' ? 'Hotel Guest Bookings' : activeRoleUser?.role === 'TRAVEL_ADMIN' ? 'Car Trip Bookings' : 'All Platform Bookings'}
          </button>

          {activeRoleUser?.role === 'MAIN_ADMIN' && (
            <button
              onClick={() => setActiveTab('partner_requests')}
              className={`py-3 border-b-2 font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'partner_requests'
                  ? 'border-[#D4AF37] text-[#F3E5AB]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Partner Applications</span>
              {partnerRequests.filter(r => r.status === 'PENDING').length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center">
                  {partnerRequests.filter(r => r.status === 'PENDING').length}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setActiveTab('verify_token')}
            className={`py-3 border-b-2 font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'verify_token'
                ? 'border-[#D4AF37] text-[#F3E5AB]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Verify Token ID</span>
          </button>
        </div>

        {/* Tab 1: Bookings Management */}
        {activeTab === 'bookings' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Metric Totals Cards */}
            <div className="p-5 bg-[#0B0B0F] border-b border-zinc-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              
              {/* 1. Total Revenue */}
              <div className="p-3.5 rounded-xl bg-[#121218] border border-[#D4AF37]/30">
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400 mb-1">
                  <span>TOTAL REVENUE</span>
                  <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
                <div className="font-serif-luxury text-xl font-bold text-[#F3E5AB]">
                  {formatINR(totalRevenue)}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono-tech">Confirmed Total</div>
              </div>

              {/* 2. Total Bookings */}
              <div className="p-3.5 rounded-xl bg-[#121218] border border-zinc-800">
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400 mb-1">
                  <span>TOTAL BOOKINGS</span>
                  <Ticket className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div className="font-serif-luxury text-xl font-bold text-white">
                  {totalBookings}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono-tech">System Records</div>
              </div>

              {/* 3. Total Users */}
              <div className="p-3.5 rounded-xl bg-[#121218] border border-zinc-800">
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400 mb-1">
                  <span>TOTAL USERS</span>
                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div className="font-serif-luxury text-xl font-bold text-white">
                  {uniqueUsers}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono-tech">Unique Passengers</div>
              </div>

              {/* 4. Confirmed */}
              <div className="p-3.5 rounded-xl bg-[#121218] border border-emerald-500/20">
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400 mb-1">
                  <span>CONFIRMED</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="font-serif-luxury text-xl font-bold text-emerald-400">
                  {confirmedBookings}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono-tech">Active Tickets</div>
              </div>

              {/* 5. Pending */}
              <div className="p-3.5 rounded-xl bg-[#121218] border border-amber-500/20">
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400 mb-1">
                  <span>PENDING</span>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="font-serif-luxury text-xl font-bold text-amber-400">
                  {pendingBookings}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono-tech">Awaiting Check-in</div>
              </div>

              {/* 6. Cancelled */}
              <div className="p-3.5 rounded-xl bg-[#121218] border border-rose-500/20">
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400 mb-1">
                  <span>CANCELLED</span>
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="font-serif-luxury text-xl font-bold text-rose-400">
                  {cancelledBookings}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono-tech">Revoked Passes</div>
              </div>

            </div>

            {/* Search & Filter Bar */}
            <div className="p-4 bg-[#0E0E14] border-b border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search User ID, Token ID, Name, Phone, Hotel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#14141C] text-white placeholder-zinc-500 pl-9 pr-3 py-2 rounded-xl border border-zinc-800 focus:border-[#D4AF37] text-xs font-mono-tech outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-zinc-500" />
                <div className="flex items-center gap-1 p-1 rounded-xl bg-[#14141C] border border-zinc-800 text-xs font-mono-tech">
                  {['all', 'Confirmed', 'Pending', 'Cancelled'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                        statusFilter === tab
                          ? 'bg-[#D4AF37] text-black font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1 p-5">
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <ShieldAlert className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <div className="text-zinc-400 font-mono-tech text-sm">No bookings found matching current filters.</div>
                </div>
              ) : (
                <table className="w-full text-left font-mono-tech text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                      <th className="pb-3 pr-3">Token & User ID</th>
                      <th className="pb-3 px-3">Passenger</th>
                      <th className="pb-3 px-3">Route & Distance</th>
                      <th className="pb-3 px-3">People</th>
                      <th className="pb-3 px-3">Car Fare</th>
                      <th className="pb-3 px-3">Hotel Total</th>
                      <th className="pb-3 px-3">Food Total</th>
                      <th className="pb-3 px-3">Final Total</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 pl-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filtered.map((b) => {
                      const people = b.numberOfPeople || b.travelers || b.user?.numberOfPeople || 1;
                      const peopleLabel = people === 1 ? '1 Person' : `${people} People`;
                      const carCost = b.carCost || b.pricing?.carCost || b.pricing?.vehicleCost || b.vehicle.price;
                      const hotelTotal = b.hotelTotal || b.pricing?.hotelCost || (b.hotel ? (b.hotelPricePerNight || b.hotel.pricePerNight) * (b.hotelNights || 1) : 0);
                      const foodTotal = b.foodTotal || b.pricing?.foodCost || b.pricing?.pitstopCost || 0;
                      const finalTotal = b.finalTotal || b.pricing?.finalTotal || b.pricing?.total || 0;

                      return (
                        <tr key={b.id} className="hover:bg-zinc-900/40 transition-colors">
                          
                          {/* Token & User ID */}
                          <td className="py-3.5 pr-3">
                            <span className="font-bold text-[#F3E5AB] block">{b.journeyToken || b.id}</span>
                            <span className="text-[10px] text-[#D4AF37]">
                              UID: {b.userId || b.user.userId || 'TGAI-USER'}
                            </span>
                          </td>

                          {/* Passenger */}
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-white">{b.user.fullName}</div>
                            <div className="text-[10px] text-zinc-400">{b.user.phone}</div>
                          </td>

                          {/* Route */}
                          <td className="py-3.5 px-3">
                            <div className="text-white font-medium">
                              {b.from} <span className="text-[#D4AF37]">➔</span> {b.to}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              {b.distanceKm ? `${b.distanceKm} km • ` : ''}{b.travelDate}
                            </div>
                          </td>

                          {/* People */}
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px] font-bold">
                              {peopleLabel}
                            </span>
                          </td>

                          {/* Car Fare */}
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-white">{formatINR(carCost)}</div>
                            <div className="text-[10px] text-zinc-400 truncate max-w-[120px]">{b.vehicle.name}</div>
                          </td>

                          {/* Hotel Total */}
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-white">{formatINR(hotelTotal)}</div>
                            <div className="text-[10px] text-zinc-400 truncate max-w-[120px]">
                              {b.hotel ? `${b.hotel.name} (${b.hotelNights}N)` : 'No Hotel'}
                            </div>
                          </td>

                          {/* Food Total */}
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-white">{formatINR(foodTotal)}</div>
                            <div className="text-[10px] text-zinc-400">
                              {b.selectedFoodItems?.length ? `${b.selectedFoodItems.length} items` : b.pitstops?.length ? `${b.pitstops.length} stops` : 'None'}
                            </div>
                          </td>

                          {/* Final Total */}
                          <td className="py-3.5 px-3">
                            <span className="font-serif-luxury font-bold text-[#F3E5AB] text-sm">
                              {formatINR(finalTotal)}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-3">
                            <select
                              value={b.status}
                              onChange={(e) => onUpdateStatus(b.id, e.target.value as any)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold outline-none border cursor-pointer ${
                                b.status === 'Confirmed'
                                  ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                                  : b.status === 'Cancelled'
                                  ? 'bg-rose-950 text-rose-400 border-rose-500/50'
                                  : 'bg-amber-950 text-amber-400 border-amber-500/50'
                              }`}
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Pending">Pending</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 pl-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Open Full Details Drawer */}
                              <button
                                onClick={() => setInspectBooking(b)}
                                className="p-1.5 rounded-lg bg-[#15151D] hover:bg-[#20202C] text-[#D4AF37] border border-zinc-800 transition-all cursor-pointer"
                                title="View Complete Booking Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* View Boarding Pass */}
                              <button
                                onClick={() => onViewTicket(b)}
                                className="p-1.5 rounded-lg bg-[#15151D] hover:bg-[#20202C] text-[#F3E5AB] border border-[#D4AF37]/30 transition-all cursor-pointer"
                                title="View Boarding Pass Ticket"
                              >
                                <Ticket className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => onDeleteBooking(b.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Partner Applications */}
        {activeTab === 'partner_requests' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold font-serif-luxury text-white">
                Pending Sub-Admin Partner Registrations
              </h4>
              <button
                onClick={loadData}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono-tech text-zinc-300 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {partnerRequests.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 font-mono-tech">
                No partner requests submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {partnerRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-[#0E0E14] border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono-tech uppercase font-bold">
                          {req.businessType === 'HOTEL_ADMIN' ? 'Hotel Partner' : 'Travel Fleet Partner'}
                        </span>
                        <span className="text-xs font-bold text-white">{req.businessName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono-tech ${
                          req.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400' : req.status === 'REJECTED' ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 font-mono-tech space-x-2">
                        <span>Owner: <strong className="text-white">{req.ownerName}</strong></span>
                        <span>•</span>
                        <span>Phone: <strong className="text-white">{req.phone}</strong></span>
                        <span>•</span>
                        <span>Email: <strong className="text-white">{req.email}</strong></span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-1">
                        Address: {req.address} {req.notes && `• Notes: ${req.notes}`}
                      </div>
                    </div>

                    {req.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openApprovalModal(req)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold font-mono-tech text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-lg"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve & Set Credentials</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="px-4 py-2 rounded-xl bg-red-900/50 hover:bg-red-800 text-red-300 font-mono-tech text-xs uppercase cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- PARTNER APPROVAL & CREDENTIAL CREATION MODAL OVERLAY --- */}
        {approvingRequest && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0c0c12] border border-[#D4AF37]/50 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Shield className="w-5 h-5" />
                  <h3 className="font-bold font-serif-luxury text-white text-lg">
                    Create Partner Account & Password
                  </h3>
                </div>
                <button
                  onClick={() => setApprovingRequest(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-zinc-300 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 space-y-1">
                <div>Partner Entity: <strong className="text-amber-300">{approvingRequest.businessName}</strong></div>
                <div>Account Role: <strong className="text-emerald-400">{approvingRequest.businessType === 'HOTEL_ADMIN' ? 'Hotel Owner / Manager' : 'Travel Agency Owner'}</strong></div>
                <div>Applicant: {approvingRequest.ownerName} ({approvingRequest.phone})</div>
              </div>

              <form onSubmit={handleConfirmApproval} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                    Assigned Entity Name
                  </label>
                  <input
                    type="text"
                    value={approvalPartnerName}
                    onChange={(e) => setApprovalPartnerName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                    Login Email Address (Created by Admin)
                  </label>
                  <input
                    type="email"
                    value={approvalEmail}
                    onChange={(e) => setApprovalEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                    Login Password (Saved & Visible in Admin Panel)
                  </label>
                  <input
                    type="text"
                    value={approvalPassword}
                    onChange={(e) => setApprovalPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-amber-500/60 text-amber-300 font-mono text-sm focus:border-amber-400 focus:outline-none shadow-inner"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">
                    This password will be saved as raw text in Admin Panel so you can view, share, or edit it anytime.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApprovingRequest(null)}
                    className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingApproval}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-xs uppercase shadow-lg disabled:opacity-50"
                  >
                    {isSubmittingApproval ? 'Activating Account...' : 'Approve & Create Login'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: Token Verification Tool */}
        {activeTab === 'verify_token' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] mx-auto flex items-center justify-center mb-3">
                <QrCode className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold font-serif-luxury text-white">
                Registration Token ID Verification Tool
              </h4>
              <p className="text-xs text-zinc-400 font-mono-tech mt-1">
                Enter any traveler's Journey Token ID to verify validity, passengers, and services.
              </p>
            </div>

            <form onSubmit={handleVerifyToken} className="flex gap-2">
              <input
                type="text"
                required
                value={verifyTokenInput}
                onChange={(e) => setVerifyTokenInput(e.target.value)}
                placeholder="e.g. TGAI-JRN-2026-84920"
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono-tech text-sm focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="px-6 py-3 rounded-xl gold-gradient-bg text-black font-bold font-mono-tech text-xs tracking-wider uppercase cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? 'Verifying...' : 'Verify Token'}
              </button>
            </form>

            {verifyResult && (
              <div className="animate-fade-in">
                {verifyResult.valid && verifyResult.booking ? (
                  <div className="p-5 rounded-2xl bg-[#0D150E] border border-emerald-500/50 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono-tech text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>VALID JOURNEY TOKEN</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono-tech">
                      <div>
                        <span className="text-zinc-400 block">Journey Token ID:</span>
                        <span className="text-white font-bold">{verifyResult.booking.journeyToken || verifyResult.booking.id}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Status:</span>
                        <span className="text-emerald-400 font-bold">{verifyResult.booking.status}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Lead Passenger:</span>
                        <span className="text-white font-bold">{verifyResult.booking.user.fullName}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Number of People:</span>
                        <span className="text-white font-bold">{verifyResult.booking.numberOfPeople || verifyResult.booking.travelers || 1} People</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Route:</span>
                        <span className="text-[#F3E5AB] font-bold">{verifyResult.booking.from} ➔ {verifyResult.booking.to}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Car:</span>
                        <span className="text-white font-bold">{verifyResult.booking.vehicle.name}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Hotel:</span>
                        <span className="text-white font-bold">{verifyResult.booking.hotel?.name || 'None (Transit)'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Total Fare:</span>
                        <span className="text-[#D4AF37] font-bold">
                          {formatINR(verifyResult.booking.finalTotal || verifyResult.booking.pricing.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-[#1A0A0A] border border-red-500/50 flex items-center gap-3 text-red-300 text-xs font-mono-tech">
                    <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                    <div>
                      <div className="font-bold text-red-200">Invalid or Unrecognized Token ID</div>
                      <div>{verifyResult.error || 'No journey record found matching this Token ID.'}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* INSPECT BOOKING COMPLETE DETAILS MODAL */}
      {inspectBooking && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
          <div className="relative w-full max-w-3xl bg-[#0B0B10] rounded-3xl border-2 border-[#D4AF37] shadow-[0_0_80px_rgba(212,175,55,0.4)] overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#17140B] to-[#0D0D14] border-b border-[#D4AF37]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                <h4 className="font-serif-luxury font-bold text-lg text-white">
                  Complete Booking Manifest ({inspectBooking.journeyToken || inspectBooking.id})
                </h4>
              </div>
              <button
                onClick={() => setInspectBooking(null)}
                className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono-tech flex-1">
              
              {/* Identifiers & Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">User ID:</span>
                  <span className="font-bold text-white">{inspectBooking.userId || inspectBooking.user.userId || 'TGAI-USER'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">Journey Token:</span>
                  <span className="font-bold text-[#F3E5AB]">{inspectBooking.journeyToken || inspectBooking.id}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">Booking ID:</span>
                  <span className="font-bold text-zinc-300">{inspectBooking.bookingId || inspectBooking.id}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">Booking Status:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    inspectBooking.status === 'Confirmed' ? 'bg-emerald-950 text-emerald-400' : inspectBooking.status === 'Cancelled' ? 'bg-rose-950 text-rose-400' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {inspectBooking.status}
                  </span>
                </div>
              </div>

              {/* Passenger & Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div>
                  <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold mb-2">
                    <User className="w-4 h-4" />
                    <span>Passenger Information</span>
                  </div>
                  <div className="space-y-1 text-zinc-300">
                    <div>Full Name: <strong className="text-white">{inspectBooking.user.fullName}</strong></div>
                    <div>Phone: <strong className="text-white">{inspectBooking.user.phone}</strong></div>
                    <div>Email: <strong className="text-white">{inspectBooking.user.email || '—'}</strong></div>
                    <div>Number of People: <strong className="text-[#F3E5AB]">{inspectBooking.numberOfPeople || inspectBooking.travelers || 1} People</strong></div>
                    {inspectBooking.user.specialRequests && (
                      <div className="text-zinc-400 text-[11px] mt-1">Special Requests: {inspectBooking.user.specialRequests}</div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Journey Schedule & Route</span>
                  </div>
                  <div className="space-y-1 text-zinc-300">
                    <div>Origin (From): <strong className="text-white">{inspectBooking.from}</strong></div>
                    <div>Destination (To): <strong className="text-white">{inspectBooking.to}</strong></div>
                    <div>Distance: <strong className="text-white">{inspectBooking.distanceKm || '—'} km</strong></div>
                    <div>Travel Time: <strong className="text-white">{inspectBooking.durationText || inspectBooking.vehicle.travelTime || '—'}</strong></div>
                    <div>Date & Time: <strong className="text-[#F3E5AB]">{inspectBooking.travelDate} at {inspectBooking.travelTime || '08:00 AM'}</strong></div>
                  </div>
                </div>
              </div>

              {/* Itemized Services: Car, Hotel, Food */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="text-sm font-bold text-white font-serif-luxury pb-2 border-b border-zinc-800">
                  Itemized Service Breakdown
                </div>

                {/* Car */}
                <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                  <div>
                    <span className="text-white font-semibold">{inspectBooking.vehicle.name}</span>
                    <span className="text-zinc-400 text-[11px] block">{inspectBooking.vehicle.carType} • {inspectBooking.vehicle.seats} Seats</span>
                  </div>
                  <span className="text-white font-bold">
                    {formatINR(inspectBooking.carCost || inspectBooking.pricing?.carCost || inspectBooking.vehicle.price)}
                  </span>
                </div>

                {/* Hotel */}
                <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                  <div>
                    <span className="text-white font-semibold">
                      {inspectBooking.hotel ? inspectBooking.hotel.name : 'Hotel (Transit - None)'}
                    </span>
                    <span className="text-zinc-400 text-[11px] block">
                      {inspectBooking.hotel ? `${formatINR(inspectBooking.hotelPricePerNight || inspectBooking.hotel.pricePerNight)}/night × ${inspectBooking.hotelNights || 1} Night(s)` : '₹0'}
                    </span>
                  </div>
                  <span className="text-white font-bold">
                    {formatINR(inspectBooking.hotelTotal || inspectBooking.pricing?.hotelCost || (inspectBooking.hotel ? (inspectBooking.hotelPricePerNight || inspectBooking.hotel.pricePerNight) * (inspectBooking.hotelNights || 1) : 0))}
                  </span>
                </div>

                {/* Food Items */}
                {inspectBooking.selectedFoodItems && inspectBooking.selectedFoodItems.length > 0 && (
                  <div className="py-2 border-b border-zinc-800/60 space-y-1.5">
                    <div className="text-zinc-400 font-semibold uppercase text-[10px]">Highway Food Items:</div>
                    {inspectBooking.selectedFoodItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-[11px] text-zinc-300 pl-2">
                        <span>• {item.name} ({formatINR(item.pricePerPerson)} × {inspectBooking.numberOfPeople || 1} People)</span>
                        <span className="text-white font-bold">
                          {formatINR(item.pricePerPerson * (inspectBooking.numberOfPeople || 1) * (item.quantity || 1))}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs font-semibold pt-1">
                      <span className="text-zinc-400">Food Subtotal:</span>
                      <span className="text-[#D4AF37]">
                        {formatINR(inspectBooking.foodTotal || inspectBooking.pricing?.foodCost || 0)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Service Fee & Tax */}
                <div className="flex justify-between text-zinc-400 pt-1">
                  <span>Service & Support Fee:</span>
                  <span className="text-zinc-300">{formatINR(inspectBooking.serviceFee || inspectBooking.pricing?.serviceFee || 0)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Tax & GST:</span>
                  <span className="text-zinc-300">{formatINR(inspectBooking.tax || inspectBooking.pricing?.tax || 0)}</span>
                </div>

                {/* Final Total */}
                <div className="flex justify-between items-center pt-3 border-t border-zinc-800 text-sm">
                  <span className="font-bold text-white uppercase">FINAL TOTAL PAID</span>
                  <span className="font-serif-luxury font-bold text-xl text-[#D4AF37]">
                    {formatINR(inspectBooking.finalTotal || inspectBooking.pricing?.finalTotal || inspectBooking.pricing?.total || 0)}
                  </span>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-[#09090D] border-t border-zinc-800 flex justify-between items-center">
              <span className="text-[11px] text-zinc-500 font-mono-tech">
                Record created: {new Date(inspectBooking.createdAt).toLocaleString()}
              </span>
              <button
                onClick={() => setInspectBooking(null)}
                className="px-5 py-2 rounded-xl gold-gradient-bg text-black font-bold font-mono-tech text-xs uppercase cursor-pointer"
              >
                Close Manifest
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
