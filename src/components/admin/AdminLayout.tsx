import React, { useState } from 'react';
import {
  Shield,
  Building2,
  Car,
  Users,
  Compass,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  FileText,
  History,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Lock,
  Search,
  Bell,
  BedDouble,
  UserCheck,
  Key,
} from 'lucide-react';
import { AdminUser, AdminRole } from '../../types/admin';

export interface AdminNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  requiredPermission?: string;
}

interface AdminLayoutProps {
  currentUser: AdminUser;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onLogout: () => void;
  onBackToCustomerApp: () => void;
  navItems: AdminNavItem[];
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onLogout,
  onBackToCustomerApp,
  navItems,
  children,
  title,
  subtitle,
  headerAction,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { label: 'Super Admin', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'SUB_ADMIN':
        return { label: 'Staff Admin', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'HOTEL_ADMIN':
        return { label: 'Hotel Manager', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      case 'AGENCY_ADMIN':
        return { label: 'Agency Manager', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      default:
        return { label: 'Staff', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
    }
  };

  const badge = getRoleBadge(currentUser.role);

  return (
    <div className="min-h-screen bg-[#08080f] text-zinc-100 flex flex-col lg:flex-row font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#0d0d16] border-b border-zinc-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs tracking-wide text-zinc-100">TOURGUIDE ADMIN</span>
            <span className="block text-[10px] text-amber-400 font-medium">{badge.label}</span>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0d0d18] border-r border-zinc-800 flex flex-col justify-between z-50 transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 p-2 flex items-center justify-center text-amber-400 shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-zinc-100 tracking-wide">
                    TOURGUIDE
                  </span>
                  <span className="text-amber-400 text-xs font-bold">ADMIN</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Tenant Name if Partner */}
            {(currentUser.hotelName || currentUser.agencyName) && (
              <div className="mt-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                  {currentUser.hotelName ? 'Your Assigned Hotel' : 'Your Assigned Travel Agency'}
                </span>
                <span className="text-xs font-medium text-amber-300 truncate block mt-0.5">
                  {currentUser.hotelName || currentUser.agencyName}
                </span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-amber-400 text-zinc-950'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer & Actions */}
        <div className="p-4 border-t border-zinc-800 bg-[#0a0a14] space-y-2.5">
          {/* User Profile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-amber-400">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-zinc-200 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-zinc-400 truncate">{currentUser.email}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Switch to Main Website */}
          <button
            onClick={onBackToCustomerApp}
            className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Open Main Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="bg-[#0c0c16]/95 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-zinc-100">
              {title}
            </h1>
            {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {headerAction}

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Live System Connected</span>
            </div>
          </div>
        </header>

        {/* Body Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto text-left">
          {children}
        </main>
      </div>
    </div>
  );
};
