import bcrypt from 'bcryptjs';
import { Booking, Vehicle, Hotel, Pitstop, AdminRequest } from '../src/types';
import { VEHICLES_DATA, HOTELS_DATA, PITSTOPS_DATA, INITIAL_SAMPLE_BOOKINGS } from '../src/data/mockData';

function generateUserId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 7; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TGAI-USER-${code}`;
}

export type UserRole = 'USER' | 'MAIN_ADMIN' | 'HOTEL_ADMIN' | 'TRAVEL_ADMIN';

export interface AuthUser {
  id: string; // Permanent Unique User ID e.g. TGAI-USER-82F4K91
  userId?: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean; // Account status (true = active, false = disabled)
  address?: string;
  createdBy?: string;
  organizationId?: string;
  hotelId?: string; // For HOTEL_ADMIN: isolated to specific hotel
  hotelName?: string;
  agencyId?: string; // For TRAVEL_ADMIN: isolated to fleet agency
  agencyName?: string;
  createdAt: string;
}

export interface AuditLogRecord {
  id: string;
  action: string;
  actorId: string;
  actorEmail: string;
  actorRole: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

class Database {
  private users: Map<string, AuthUser> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private hotels: Map<string, Hotel> = new Map();
  private vehicles: Map<string, Vehicle> = new Map();
  private pitstops: Map<string, Pitstop> = new Map();
  private adminRequests: Map<string, AdminRequest> = new Map();
  private auditLogs: AuditLogRecord[] = [];

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    const saltRounds = 10;
    // Secure bcrypt password hashes
    const defaultUserHash = bcrypt.hashSync('Travel@2026', saltRounds);
    const mainAdminHash = bcrypt.hashSync('admin#123', saltRounds);
    const hotelAdminHash = bcrypt.hashSync('hotel@123', saltRounds);
    const travelAdminHash = bcrypt.hashSync('travel@123', saltRounds);

    const defaultUsers: AuthUser[] = [
      {
        id: 'TGAI-USER-ADM0001',
        userId: 'TGAI-USER-ADM0001',
        name: 'Main Administrator',
        email: 'admin@tourguide.com',
        phone: '+91 99000 00001',
        passwordHash: mainAdminHash,
        role: 'MAIN_ADMIN',
        isActive: true,
        address: 'TourGuide AI HQ, Cyber City, Gurgaon',
        createdBy: 'SYSTEM',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'TGAI-USER-HTL0001',
        userId: 'TGAI-USER-HTL0001',
        name: 'Grand Palace Hotel Admin',
        email: 'hotel1@tourguide.com',
        phone: '+91 11 3933 1234',
        passwordHash: hotelAdminHash,
        role: 'HOTEL_ADMIN',
        isActive: true,
        address: 'Diplomatic Enclave, Chanakyapuri, New Delhi',
        createdBy: 'admin@tourguide.com',
        hotelId: 'hotel-leela-palace',
        hotelName: 'The Leela Palace',
        createdAt: '2026-01-10T00:00:00Z',
      },
      {
        id: 'TGAI-USER-HTL0002',
        userId: 'TGAI-USER-HTL0002',
        name: 'Taj Palace Hotel Manager',
        email: 'hotel2@tourguide.com',
        phone: '+91 11 2611 0202',
        passwordHash: hotelAdminHash,
        role: 'HOTEL_ADMIN',
        isActive: true,
        address: 'Sardar Patel Marg, Diplomatic Enclave, New Delhi',
        createdBy: 'admin@tourguide.com',
        hotelId: 'hotel-taj-palace',
        hotelName: 'Taj Palace Hotel',
        createdAt: '2026-01-12T00:00:00Z',
      },
      {
        id: 'TGAI-USER-TRV0001',
        userId: 'TGAI-USER-TRV0001',
        name: 'WanderWorld Express Agency Admin',
        email: 'agency1@tourguide.com',
        phone: '+91 98000 11223',
        passwordHash: travelAdminHash,
        role: 'TRAVEL_ADMIN',
        isActive: true,
        address: 'Plot 12, Transport Hub, Begumpet, Hyderabad',
        createdBy: 'admin@tourguide.com',
        agencyId: 'agency-express',
        agencyName: 'TourGuide Express Fleet',
        createdAt: '2026-01-20T00:00:00Z',
      },
      {
        id: 'TGAI-USER-82F4K91',
        userId: 'TGAI-USER-82F4K91',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        phone: '+91 98765 43210',
        passwordHash: defaultUserHash,
        role: 'USER',
        isActive: true,
        createdAt: '2026-02-01T00:00:00Z',
      },
    ];

    for (const u of defaultUsers) {
      this.users.set(u.email.toLowerCase(), u);
    }

    for (const h of HOTELS_DATA) {
      this.hotels.set(h.id, h);
    }
    for (const v of VEHICLES_DATA) {
      this.vehicles.set(v.id, v);
    }
    for (const p of PITSTOPS_DATA) {
      this.pitstops.set(p.id, p);
    }
    for (const b of INITIAL_SAMPLE_BOOKINGS) {
      this.bookings.set(b.id, b);
    }

    // Seed sample pending admin request
    const sampleRequest: AdminRequest = {
      id: 'req-101',
      businessName: 'Royal Orchid Luxury Suites',
      ownerName: 'Sunil Verma',
      phone: '+91 98112 33445',
      email: 'sunil.verma@royalorchid.in',
      address: 'Plot 44, Airport Road, New Delhi',
      businessType: 'HOTEL_ADMIN',
      notes: 'We have 45 luxury rooms and wish to partner with TOURGUIDE AI for guest bookings.',
      status: 'PENDING',
      createdAt: '2026-02-20T11:00:00Z',
    };
    this.adminRequests.set(sampleRequest.id, sampleRequest);

    // Initial Audit Logs
    this.recordAuditLog('SYSTEM_INIT', 'SYSTEM', 'system@tourguide.com', 'SYSTEM', 'PLATFORM', 'TG-01', 'Platform database and security roles initialized.');
  }

  // --- Audit Log Methods ---
  public recordAuditLog(
    action: string,
    actorId: string,
    actorEmail: string,
    actorRole: string,
    targetType: string,
    targetId: string,
    details: string
  ): AuditLogRecord {
    const record: AuditLogRecord = {
      id: `AUD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      action,
      actorId,
      actorEmail,
      actorRole,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(record);
    return record;
  }

  public getAuditLogs(): AuditLogRecord[] {
    return this.auditLogs;
  }

  // --- Auth & User Methods ---
  public findUserByEmail(email: string): AuthUser | undefined {
    return this.users.get(email.toLowerCase().trim());
  }

  public findUserById(id: string): AuthUser | undefined {
    for (const user of this.users.values()) {
      if (user.id === id || user.userId === id) return user;
    }
    return undefined;
  }

  public listAllUsers(): Array<Omit<AuthUser, 'passwordHash'>> {
    return Array.from(this.users.values()).map(({ passwordHash, ...rest }) => rest);
  }

  public registerUser(
    name: string,
    email: string,
    phone: string,
    passwordPlain: string,
    role: UserRole = 'USER',
    hotelId?: string,
    hotelName?: string,
    agencyId?: string,
    agencyName?: string
  ): AuthUser {
    const cleanEmail = email.toLowerCase().trim();
    const existing = this.findUserByEmail(cleanEmail);
    if (existing) {
      throw new Error('This email is already registered.');
    }
    const passwordHash = bcrypt.hashSync(passwordPlain, 10);
    const uid = generateUserId();
    const newUser: AuthUser = {
      id: uid,
      userId: uid,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      passwordHash,
      role,
      isActive: true,
      hotelId,
      hotelName,
      agencyId,
      agencyName,
      createdAt: new Date().toISOString(),
    };
    this.users.set(newUser.email, newUser);
    this.recordAuditLog('USER_REGISTER', uid, cleanEmail, role, 'USER', uid, `New user ${name} registered.`);
    return newUser;
  }

  // Admin-Only Partner Account Creation (Hotels & Travel Agencies)
  public createPartnerAccount(data: {
    name: string;
    email: string;
    phone: string;
    passwordPlain: string;
    role: 'HOTEL_ADMIN' | 'TRAVEL_ADMIN';
    address?: string;
    isActive?: boolean;
    hotelId?: string;
    hotelName?: string;
    agencyId?: string;
    agencyName?: string;
    createdBy?: string;
  }): AuthUser {
    const cleanEmail = data.email.toLowerCase().trim();
    if (this.findUserByEmail(cleanEmail)) {
      throw new Error('This email is already registered.');
    }

    if (data.passwordPlain.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const passwordHash = bcrypt.hashSync(data.passwordPlain, 10);
    const uid = generateUserId();
    const orgId = data.role === 'HOTEL_ADMIN' 
      ? (data.hotelId || `hotel-${Date.now()}`) 
      : (data.agencyId || `agency-${Date.now()}`);
    const orgName = data.role === 'HOTEL_ADMIN'
      ? (data.hotelName || data.name)
      : (data.agencyName || data.name);

    const partnerUser: AuthUser = {
      id: uid,
      userId: uid,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      passwordHash,
      role: data.role,
      isActive: data.isActive !== undefined ? data.isActive : true,
      address: data.address || '',
      createdBy: data.createdBy || 'admin@tourguide.com',
      organizationId: orgId,
      ...(data.role === 'HOTEL_ADMIN'
        ? { hotelId: orgId, hotelName: orgName }
        : { agencyId: orgId, agencyName: orgName }),
      createdAt: new Date().toISOString(),
    };

    this.users.set(partnerUser.email, partnerUser);
    this.recordAuditLog(
      data.role === 'HOTEL_ADMIN' ? 'CREATE_HOTEL_ACCOUNT' : 'CREATE_AGENCY_ACCOUNT',
      'ADMIN_SYSTEM',
      data.createdBy || 'admin@tourguide.com',
      'MAIN_ADMIN',
      data.role === 'HOTEL_ADMIN' ? 'HOTEL' : 'TRAVEL_AGENCY',
      uid,
      `Created ${data.role} account for ${data.name} (${cleanEmail}).`
    );
    return partnerUser;
  }

  // Create Sub-Admin Account for Hotel or Travel Agency
  public createSubAdminAccount(data: {
    name: string;
    email: string;
    phone: string;
    passwordPlain: string;
    subAdminType: 'HOTEL_SUBADMIN' | 'TRAVEL_SUBADMIN';
    assignedName: string;
    address?: string;
    isActive?: boolean;
    createdBy?: string;
  }): AuthUser {
    const role: UserRole = data.subAdminType === 'HOTEL_SUBADMIN' ? 'HOTEL_ADMIN' : 'TRAVEL_ADMIN';
    const orgId = data.subAdminType === 'HOTEL_SUBADMIN' ? `hotel-${Date.now()}` : `agency-${Date.now()}`;

    return this.createPartnerAccount({
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordPlain: data.passwordPlain,
      role,
      address: data.address,
      isActive: data.isActive,
      hotelId: data.subAdminType === 'HOTEL_SUBADMIN' ? orgId : undefined,
      hotelName: data.subAdminType === 'HOTEL_SUBADMIN' ? data.assignedName : undefined,
      agencyId: data.subAdminType === 'TRAVEL_SUBADMIN' ? orgId : undefined,
      agencyName: data.subAdminType === 'TRAVEL_SUBADMIN' ? data.assignedName : undefined,
      createdBy: data.createdBy || 'admin@tourguide.com',
    });
  }

  // Set Partner Account Active/Disabled Status
  public setPartnerStatus(userId: string, isActive: boolean, actorEmail: string = 'admin@tourguide.com'): AuthUser {
    const user = this.findUserById(userId);
    if (!user) {
      throw new Error('Account not found.');
    }
    user.isActive = isActive;
    this.users.set(user.email, user);
    this.recordAuditLog(
      'ACCOUNT_STATUS_UPDATED',
      'ADMIN_SYSTEM',
      actorEmail,
      'MAIN_ADMIN',
      user.role,
      user.id,
      `Changed account status of ${user.email} to ${isActive ? 'ACTIVE' : 'DISABLED'}.`
    );
    return user;
  }

  // Reset Partner Password
  public resetPartnerPassword(userId: string, newPasswordPlain: string, actorEmail: string = 'admin@tourguide.com'): boolean {
    const user = this.findUserById(userId);
    if (!user) {
      throw new Error('Account not found.');
    }
    if (newPasswordPlain.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }
    user.passwordHash = bcrypt.hashSync(newPasswordPlain, 10);
    this.users.set(user.email, user);
    this.recordAuditLog(
      'PASSWORD_RESET',
      'ADMIN_SYSTEM',
      actorEmail,
      'MAIN_ADMIN',
      user.role,
      user.id,
      `Reset password for ${user.email}.`
    );
    return true;
  }

  // Admin Change Password
  public changeUserPassword(userId: string, newPasswordPlain: string): boolean {
    const user = this.findUserById(userId);
    if (!user) throw new Error('Account not found.');
    if (newPasswordPlain.length < 8) throw new Error('Password must be at least 8 characters long.');
    user.passwordHash = bcrypt.hashSync(newPasswordPlain, 10);
    this.users.set(user.email, user);
    this.recordAuditLog('ADMIN_PASSWORD_CHANGED', user.id, user.email, user.role, 'USER', user.id, `Password changed for ${user.email}.`);
    return true;
  }

  // Delete Partner Account
  public deletePartnerAccount(userId: string, actorEmail: string = 'admin@tourguide.com'): boolean {
    const user = this.findUserById(userId);
    if (!user) {
      throw new Error('Account not found.');
    }
    if (user.role === 'MAIN_ADMIN') {
      throw new Error('Cannot delete the primary System Administrator account.');
    }
    this.users.delete(user.email);
    this.recordAuditLog(
      'ACCOUNT_DELETED',
      'ADMIN_SYSTEM',
      actorEmail,
      'MAIN_ADMIN',
      user.role,
      user.id,
      `Deleted account for ${user.email}.`
    );
    return true;
  }

  // Delete Customer User Account
  public deleteUserAccount(userId: string, actorEmail: string = 'admin@tourguide.com'): boolean {
    const user = this.findUserById(userId);
    if (!user) {
      throw new Error('User account not found.');
    }
    if (user.role === 'MAIN_ADMIN') {
      throw new Error('Cannot delete the primary System Administrator account.');
    }
    this.users.delete(user.email);
    this.recordAuditLog(
      'USER_DELETED',
      'ADMIN_SYSTEM',
      actorEmail,
      'MAIN_ADMIN',
      user.role,
      user.id,
      `Deleted user account for ${user.name} (${user.email}).`
    );
    return true;
  }

  public verifyPassword(plain: string, hash: string): boolean {
    return bcrypt.compareSync(plain, hash);
  }

  public listPublicAdmins(): Array<Omit<AuthUser, 'passwordHash'>> {
    return Array.from(this.users.values())
      .filter(u => u.role !== 'MAIN_ADMIN') // PRIVACY: Hide main admin identity from public role choices
      .map(({ passwordHash, ...rest }) => rest);
  }

  public listPartnerAccounts(roleFilter?: 'HOTEL_ADMIN' | 'TRAVEL_ADMIN'): Array<Omit<AuthUser, 'passwordHash'>> {
    return Array.from(this.users.values())
      .filter((u) => {
        if (roleFilter) return u.role === roleFilter;
        return u.role === 'HOTEL_ADMIN' || u.role === 'TRAVEL_ADMIN';
      })
      .map(({ passwordHash, ...rest }) => rest);
  }

  // --- Bookings Methods with Role-Based Data Isolation ---
  public getBookingsForUser(user: AuthUser | null): Booking[] {
    const all = Array.from(this.bookings.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    if (!user) return all;

    if (user.role === 'MAIN_ADMIN') return all;

    if (user.role === 'HOTEL_ADMIN') {
      return all.filter((b) => b.hotel?.id === user.hotelId || b.hotel?.name === user.hotelName);
    }

    if (user.role === 'TRAVEL_ADMIN') {
      return all;
    }

    return all.filter((b) => b.user?.email?.toLowerCase() === user.email.toLowerCase() || b.userId === user.id);
  }

  public getBookingById(id: string, user?: AuthUser | null): Booking | undefined {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    if (!user || user.role === 'MAIN_ADMIN') return booking;

    if (user.role === 'HOTEL_ADMIN') {
      if (booking.hotel && (booking.hotel.id === user.hotelId || booking.hotel.name === user.hotelName)) return booking;
      return undefined;
    }

    if (user.role === 'TRAVEL_ADMIN') return booking;

    if (booking.user?.email?.toLowerCase() === user.email.toLowerCase() || booking.userId === user.id) {
      return booking;
    }
    return undefined;
  }

  public createBooking(payload: Partial<Booking>): Booking {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const bookingId = payload.id || `TGAI-2026-${randomDigits}`;
    const newBooking: Booking = {
      ...payload,
      id: bookingId,
      createdAt: new Date().toISOString(),
      status: payload.status || 'Confirmed',
      qrPayload: JSON.stringify({
        bookingId,
        traveler: payload.user?.fullName,
        total: `₹${payload.pricing?.total?.toLocaleString('en-IN')}`,
      }),
    } as Booking;

    this.bookings.set(newBooking.id, newBooking);
    this.recordAuditLog('BOOKING_CREATED', payload.user?.userId || 'USER', payload.user?.email || 'guest@tourguide.com', 'USER', 'BOOKING', bookingId, `Created booking ${bookingId} for route ${payload.from} to ${payload.to}.`);
    return newBooking;
  }

  public updateBookingStatus(id: string, status: 'Confirmed' | 'Pending' | 'Cancelled'): boolean {
    const booking = this.bookings.get(id);
    if (!booking) return false;
    booking.status = status;
    this.bookings.set(id, booking);
    this.recordAuditLog('BOOKING_STATUS_UPDATED', 'ADMIN_SYSTEM', 'admin@tourguide.com', 'MAIN_ADMIN', 'BOOKING', id, `Updated booking ${id} status to ${status}.`);
    return true;
  }

  public deleteBooking(id: string): boolean {
    const ok = this.bookings.delete(id);
    if (ok) {
      this.recordAuditLog('BOOKING_DELETED', 'ADMIN_SYSTEM', 'admin@tourguide.com', 'MAIN_ADMIN', 'BOOKING', id, `Deleted booking ${id}.`);
    }
    return ok;
  }

  // Admin Request Handlers
  public getAdminRequests(): AdminRequest[] {
    return Array.from(this.adminRequests.values());
  }

  public createAdminRequest(req: Partial<AdminRequest>): AdminRequest {
    const newReq: AdminRequest = {
      id: `req-${Date.now()}`,
      businessName: req.businessName || '',
      ownerName: req.ownerName || '',
      phone: req.phone || '',
      email: req.email || '',
      address: req.address || '',
      businessType: req.businessType || 'HOTEL_ADMIN',
      notes: req.notes || '',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.adminRequests.set(newReq.id, newReq);
    return newReq;
  }

  public approveAdminRequest(id: string, customDetails?: { customEmail?: string; customPassword?: string; assignedHotelName?: string; assignedAgencyName?: string }): { success: boolean; user?: AuthUser } {
    const request = this.adminRequests.get(id);
    if (!request) throw new Error('Request not found');

    request.status = 'APPROVED';
    this.adminRequests.set(id, request);

    const email = (customDetails?.customEmail || request.email).toLowerCase().trim();
    const plainPassword = customDetails?.customPassword || 'Partner@2026';
    const role: UserRole = request.businessType === 'TRAVEL_ADMIN' ? 'TRAVEL_ADMIN' : 'HOTEL_ADMIN';

    const newUser = this.createPartnerAccount({
      name: request.ownerName || request.businessName,
      email,
      phone: request.phone,
      passwordPlain: plainPassword.length >= 8 ? plainPassword : `${plainPassword}#123`,
      role,
      address: request.address,
      hotelName: request.businessName,
      agencyName: request.businessName,
      createdBy: 'admin@tourguide.com',
    });

    return { success: true, user: newUser };
  }

  public rejectAdminRequest(id: string): boolean {
    const request = this.adminRequests.get(id);
    if (!request) return false;
    request.status = 'REJECTED';
    this.adminRequests.set(id, request);
    return true;
  }

  // Catalog accessors
  public getVehicles(): Vehicle[] {
    return Array.from(this.vehicles.values());
  }

  public getHotels(destinationCity?: string): Hotel[] {
    const all = Array.from(this.hotels.values());
    if (!destinationCity) return all;
    return all.filter((h) => h.location.toLowerCase().includes(destinationCity.toLowerCase()));
  }

  public getPitstops(): Pitstop[] {
    return Array.from(this.pitstops.values());
  }

  public saveBooking(booking: Booking): Booking {
    this.bookings.set(booking.id, booking);
    return booking;
  }

  public submitAdminRequest(req: Partial<AdminRequest>): AdminRequest {
    return this.createAdminRequest(req);
  }
}

export const db = new Database();
