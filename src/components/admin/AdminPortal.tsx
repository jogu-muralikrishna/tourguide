import React, { useState, useEffect } from 'react';
import {
  Shield,
  Building2,
  Car,
  Users,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  History,
  BedDouble,
  LogOut,
  Compass,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { AdminSession, AdminUser } from '../../types/admin';
import { AdminService } from '../../services/adminService';
import { AdminLogin } from './AdminLogin';
import { AdminLayout, AdminNavItem } from './AdminLayout';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { HotelAdminDashboard } from './HotelAdminDashboard';
import { AgencyAdminDashboard } from './AgencyAdminDashboard';
import { SubAdminDashboard } from './SubAdminDashboard';
import { PartnerRegistrationModal } from './PartnerRegistrationModal';

interface AdminPortalProps {
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose }) => {
  const [session, setSession] = useState<AdminSession | null>(() => {
    AdminService.init();
    return AdminService.getActiveSession();
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isPartnerRegisterOpen, setIsPartnerRegisterOpen] = useState(false);

  useEffect(() => {
    AdminService.init();
    const current = AdminService.getActiveSession();
    setSession(current);
  }, []);

  const handleLoginSuccess = (newSession: AdminSession) => {
    setSession(newSession);
    setActiveTab('overview');
  };

  const handleLogout = () => {
    AdminService.logout();
    setSession(null);
  };

  // If unauthenticated, render the dedicated Admin Login Gateway
  if (!session || !session.user) {
    return (
      <>
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToApp={onClose}
          onOpenPartnerRegister={() => setIsPartnerRegisterOpen(true)}
        />
        <PartnerRegistrationModal
          isOpen={isPartnerRegisterOpen}
          onClose={() => setIsPartnerRegisterOpen(false)}
          onSuccessLogin={(newUser) => {
            const loginRes = AdminService.login(newUser.email, newUser.password);
            if (loginRes.session) handleLoginSuccess(loginRes.session);
          }}
        />
      </>
    );
  }

  const user = session.user;

  // Configure navigation items depending on role
  let navItems: AdminNavItem[] = [];
  let portalTitle = 'Admin Portal';
  let portalSubtitle = 'Manage your operations and bookings';

  if (user.role === 'SUPER_ADMIN') {
    portalTitle = 'Super Admin Verification Hub';
    portalSubtitle = 'Complete platform oversight, pre-auth credentials, hotels, agencies, and verification logs';
    navItems = [
      { id: 'overview', label: 'Platform Overview', icon: LayoutDashboard },
      { id: 'verification', label: 'Master Verification Hub', icon: ShieldCheck },
      { id: 'admins', label: 'Admin Accounts', icon: Shield },
      { id: 'hotels', label: 'Partner Hotels', icon: Building2 },
      { id: 'agencies', label: 'Travel Agencies', icon: Car },
      { id: 'customers', label: 'Customer Directory', icon: Users },
      { id: 'bookings', label: 'All Bookings', icon: CalendarCheck },
      { id: 'audit', label: 'Audit Logs', icon: History },
    ];
  } else if (user.role === 'HOTEL_ADMIN') {
    portalTitle = user.hotelName || 'Hotel Owner Portal';
    portalSubtitle = 'Manage room inventory, grant digital stay permissions, and verify guest check-ins';
    navItems = [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'stay-permissions', label: 'Stay Permissions & Check-In', icon: ShieldCheck },
      { id: 'rooms', label: 'Room Inventory', icon: BedDouble },
      { id: 'bookings', label: 'Guest Bookings', icon: CalendarCheck },
      { id: 'guests', label: 'Guest Directory', icon: Users },
    ];
  } else if (user.role === 'AGENCY_ADMIN') {
    portalTitle = user.agencyName || 'Travel Agency Portal';
    portalSubtitle = 'Manage fleet vehicles, drivers, and request hotel stay permissions for groups';
    navItems = [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'stay-permissions', label: 'Hotel Stay Requests', icon: ShieldCheck },
      { id: 'fleet', label: 'Vehicle Fleet', icon: Car },
      { id: 'drivers', label: 'Drivers Roster', icon: Users },
      { id: 'bookings', label: 'Trip Bookings', icon: CalendarCheck },
    ];
  } else if (user.role === 'SUB_ADMIN') {
    portalTitle = 'Staff Operations Dashboard';
    portalSubtitle = 'Review customer bookings and traveler profiles';
    navItems = [
      { id: 'bookings', label: 'Customer Bookings', icon: CalendarCheck },
      { id: 'customers', label: 'Customer Directory', icon: Users },
    ];
  }

  return (
    <AdminLayout
      currentUser={user}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onLogout={handleLogout}
      onBackToCustomerApp={onClose}
      navItems={navItems}
      title={portalTitle}
      subtitle={portalSubtitle}
    >
      {user.role === 'SUPER_ADMIN' && (
        <SuperAdminDashboard currentUser={user} activeTab={activeTab} />
      )}

      {user.role === 'HOTEL_ADMIN' && (
        <HotelAdminDashboard currentUser={user} activeTab={activeTab} />
      )}

      {user.role === 'AGENCY_ADMIN' && (
        <AgencyAdminDashboard currentUser={user} activeTab={activeTab} />
      )}

      {user.role === 'SUB_ADMIN' && (
        <SubAdminDashboard currentUser={user} activeTab={activeTab} />
      )}
    </AdminLayout>
  );
};
