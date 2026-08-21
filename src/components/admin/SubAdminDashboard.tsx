import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Search,
  CheckCircle2,
  CalendarCheck,
  Users,
} from 'lucide-react';
import {
  AdminUser,
  AdminBookingRecord,
  AdminCustomerProfile,
  PartnerBookingStatus,
} from '../../types/admin';
import { AdminService } from '../../services/adminService';

interface SubAdminDashboardProps {
  currentUser: AdminUser;
  activeTab: string;
}

export const SubAdminDashboard: React.FC<SubAdminDashboardProps> = ({
  currentUser,
  activeTab,
}) => {
  const [bookings, setBookings] = useState<AdminBookingRecord[]>([]);
  const [customers, setCustomers] = useState<AdminCustomerProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const canViewBookings = AdminService.hasPermission(currentUser, 'VIEW_BOOKINGS');
  const canManageBookings = AdminService.hasPermission(currentUser, 'MANAGE_BOOKINGS');
  const canViewCustomers = AdminService.hasPermission(currentUser, 'VIEW_CUSTOMERS');

  const refreshData = () => {
    try {
      if (canViewBookings) {
        setBookings(AdminService.getBookings(currentUser));
      }
      if (canViewCustomers) {
        setCustomers(AdminService.getCustomers(currentUser));
      }
    } catch (e) {
      console.error('Error loading staff admin data', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const handleBookingStatus = (bookingId: string, status: PartnerBookingStatus) => {
    if (!canManageBookings) return;
    AdminService.updateBookingStatus(currentUser, bookingId, status);
    refreshData();
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
    <div className="space-y-6 text-zinc-100 text-left">
      {/* Staff Permissions Summary Banner */}
      <div className="p-5 rounded-2xl bg-[#0f0f18] border border-purple-500/30 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-100">
              Staff Operations Portal
            </h3>
            <p className="text-xs text-zinc-400">
              You have {currentUser.permissions.length} active permissions assigned to your profile
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {currentUser.permissions.map((perm) => (
            <span
              key={perm}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium"
            >
              {perm.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Bookings View */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {canViewBookings ? (
            <div className="bg-[#0f0f18] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <h4 className="font-bold text-sm text-zinc-100">Customer Bookings Ledger</h4>
                <span className="text-xs text-zinc-400">{bookings.length} Total Bookings</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase text-[11px] border-b border-zinc-800">
                    <tr>
                      <th className="p-4">Booking Code</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Hotel / Route</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Status</th>
                      {canManageBookings && <th className="p-4 text-right">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-zinc-900/50">
                        <td className="p-4 text-amber-400 font-bold">{b.bookingCode}</td>
                        <td className="p-4">
                          <span className="font-bold text-zinc-100 block">{b.customerName}</span>
                          <span className="text-zinc-400 text-[11px]">{b.customerEmail}</span>
                        </td>
                        <td className="p-4 text-zinc-300">
                          {b.hotelName || b.vehicleModel || `${b.origin} → ${b.destination}`}
                        </td>
                        <td className="p-4 text-zinc-400">{b.checkInDate || b.travelDate}</td>
                        <td className="p-4 font-bold text-emerald-400">
                          {b.currency}
                          {b.totalPrice.toLocaleString()}
                        </td>
                        <td className="p-4">{renderStatusBadge(b.bookingStatus)}</td>
                        {canManageBookings && (
                          <td className="p-4 text-right">
                            {b.bookingStatus === 'PENDING' && (
                              <button
                                onClick={() => handleBookingStatus(b.id, 'CONFIRMED')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs cursor-pointer"
                              >
                                Accept & Confirm
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center space-y-2">
              <Lock className="w-8 h-8 text-zinc-500 mx-auto" />
              <h4 className="font-bold text-zinc-200">Access Restricted</h4>
              <p className="text-xs text-zinc-500">Your account has not been granted permission to view bookings.</p>
            </div>
          )}
        </div>
      )}

      {/* Customers View */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          {canViewCustomers ? (
            <div className="bg-[#0f0f18] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase text-[11px] border-b border-zinc-800">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Total Bookings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-900/50">
                      <td className="p-4 font-bold text-zinc-100">{c.name}</td>
                      <td className="p-4 text-zinc-300">{c.email}</td>
                      <td className="p-4 text-zinc-400">{c.phone}</td>
                      <td className="p-4 font-bold text-amber-400">{c.totalBookings} Bookings</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center space-y-2">
              <Lock className="w-8 h-8 text-zinc-500 mx-auto" />
              <h4 className="font-bold text-zinc-200">Access Restricted</h4>
              <p className="text-xs text-zinc-500">Your account has not been granted permission to view customer profiles.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
