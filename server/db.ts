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

export interface HotelRoomRecord {
  id: string;
  hotelId: string;
  hotelName: string;
  roomNumber: string;
  roomType: 'Deluxe Suite' | 'Presidential Villa' | 'Luxury Oceanfront' | 'Heritage Suite' | 'Standard Villa';
  capacity: number;
  pricePerNight: number;
  currency: string;
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE';
  amenities: string[];
  currentGuestName?: string;
  currentGuestPhone?: string;
  updatedAt: string;
}

export interface GuestVerificationRecord {
  id: string;
  bookingId: string;
  hotelId: string;
  guestName: string;
  mobileNumber: string;
  email: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'EXPIRED';
  verificationTokenHash: string;
  verificationMethod: string;
  verifiedAt?: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  numberOfGuests: number;
  bookingStatus: string;
  specialRequests?: string;
  createdAt: string;
}

export interface AgencyTripStop {
  stopName: string;
  location: string;
  stopType: 'BREAK' | 'HOTEL' | 'RESTAURANT' | 'TIFFIN' | 'ATTRACTION' | 'FUEL' | 'OTHER';
  arrivalTime?: string;
  departureTime?: string;
  duration?: string;
  notes?: string;
}

export interface AgencyFoodStop {
  placeName: string;
  location: string;
  mealType: 'Breakfast' | 'Tiffin' | 'Lunch' | 'Snacks' | 'Dinner';
  arrivalTime?: string;
  departureTime?: string;
  numberOfPeople: number;
  estimatedCost: number;
  notes?: string;
}

export interface AgencyTripRecord {
  id: string;
  agencyId: string;
  agencyName: string;
  tripName: string;
  destination: string;
  startingPoint: string;
  startDate: string;
  endDate: string;
  numberOfTravelers: number;
  vehicleId: string;
  vehicleName: string;
  driverName?: string;
  driverMobile?: string;
  routeStops: AgencyTripStop[];
  hotelStopover?: {
    hotelId?: string;
    hotelName: string;
    checkIn: string;
    checkOut: string;
    roomsCount: number;
    guestsCount: number;
    roomType: string;
    price: number;
    status: string;
  };
  foodStops: AgencyFoodStop[];
  totalCost: number;
  status: 'PLANNED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
}

class Database {
  private users: Map<string, AuthUser> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private hotels: Map<string, Hotel> = new Map();
  private vehicles: Map<string, Vehicle> = new Map();
  private pitstops: Map<string, Pitstop> = new Map();
  private adminRequests: Map<string, AdminRequest> = new Map();
  private auditLogs: AuditLogRecord[] = [];
  private hotelRooms: Map<string, HotelRoomRecord> = new Map();
  private guestVerifications: Map<string, GuestVerificationRecord> = new Map();
  private agencyTrips: Map<string, AgencyTripRecord> = new Map();

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    const saltRounds = 10;
    // Secure bcrypt password hashes
    const defaultUserHash = bcrypt.hashSync('Travel@2026', saltRounds);
    const mainAdminHash = bcrypt.hashSync('admin!#123', saltRounds);
    const hotelAdminHash = bcrypt.hashSync('hotel@123', saltRounds);
    const travelAdminHash = bcrypt.hashSync('travel@123', saltRounds);

    const defaultUsers: AuthUser[] = [
      {
        id: 'TGAI-USER-ADM0001',
        userId: 'TGAI-USER-ADM0001',
        name: 'Main Administrator',
        email: 'admin@mk.com',
        phone: '+91 99000 00001',
        passwordHash: mainAdminHash,
        role: 'MAIN_ADMIN',
        isActive: true,
        address: 'TourGuide AI HQ, Cyber City, Gurgaon',
        createdBy: 'SYSTEM',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'TGAI-USER-ADM0002',
        userId: 'TGAI-USER-ADM0002',
        name: 'Main Administrator Alias',
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

    // Seed Sample Hotel Rooms
    const sampleRooms: HotelRoomRecord[] = [
      {
        id: 'RM-101',
        hotelId: 'hotel-leela-palace',
        hotelName: 'The Leela Palace',
        roomNumber: '101',
        roomType: 'Deluxe Suite',
        capacity: 2,
        pricePerNight: 8500,
        currency: 'INR',
        status: 'OCCUPIED',
        amenities: ['King Bed', 'Jacuzzi', 'Ocean View', 'Free WiFi', 'Breakfast Included'],
        currentGuestName: 'Aarav Sharma',
        currentGuestPhone: '+91 98765 43210',
        updatedAt: '2026-03-01T10:00:00Z',
      },
      {
        id: 'RM-102',
        hotelId: 'hotel-leela-palace',
        hotelName: 'The Leela Palace',
        roomNumber: '102',
        roomType: 'Presidential Villa',
        capacity: 4,
        pricePerNight: 15000,
        currency: 'INR',
        status: 'AVAILABLE',
        amenities: ['Private Pool', 'Butler Service', 'Garden Access', 'King Bed'],
        updatedAt: '2026-03-01T10:00:00Z',
      },
    ];
    for (const rm of sampleRooms) {
      this.hotelRooms.set(rm.id, rm);
    }

    // Seed Sample Guest Verifications
    const sampleVerifications: GuestVerificationRecord[] = [
      {
        id: 'GV-101',
        bookingId: 'TGAI-BKG-2026-84920',
        hotelId: 'hotel-leela-palace',
        guestName: 'Aarav Sharma',
        mobileNumber: '+91 98765 43210',
        email: 'aarav.sharma@example.com',
        verificationStatus: 'VERIFIED',
        verificationTokenHash: 'hash-84920-v1',
        verificationMethod: 'OTP_SMS',
        verifiedAt: '2026-03-15T08:30:00Z',
        checkInDate: '2026-03-15',
        checkOutDate: '2026-03-17',
        roomType: 'Deluxe Suite',
        numberOfGuests: 2,
        bookingStatus: 'Confirmed',
        specialRequests: 'High floor, early check-in requested.',
        createdAt: '2026-02-15T10:30:00Z',
      },
    ];
    for (const gv of sampleVerifications) {
      this.guestVerifications.set(gv.id, gv);
    }

    // Seed Sample Agency Trips
    const sampleTrips: AgencyTripRecord[] = [
      {
        id: 'TRIP-501',
        agencyId: 'agency-royal-fleet',
        agencyName: 'Royal Fleet Travels',
        tripName: 'Royal Heritage & Temple Circuit Tour',
        destination: 'Delhi',
        startingPoint: 'Hyderabad',
        startDate: '2026-03-15',
        endDate: '2026-03-18',
        numberOfTravelers: 4,
        vehicleId: 'car-innova-crysta',
        vehicleName: 'Toyota Innova Crysta (SUV)',
        driverName: 'Ramesh Kumar',
        driverMobile: '+91 98765 12340',
        routeStops: [
          { stopName: 'Hyderabad City Exit', location: 'ORR Exit 4', stopType: 'BREAK', duration: '20 mins' },
          { stopName: 'Subbayya Gari Hotel Pitstop', location: 'NH Highway', stopType: 'TIFFIN', duration: '45 mins', notes: 'Breakfast & Tiffin Stop' },
          { stopName: 'The Leela Palace Hotel', location: 'Diplomatic Enclave', stopType: 'HOTEL', duration: '2 Nights' },
        ],
        hotelStopover: {
          hotelName: 'The Leela Palace',
          checkIn: '2026-03-15',
          checkOut: '2026-03-17',
          roomsCount: 2,
          guestsCount: 4,
          roomType: 'Deluxe Suite',
          price: 17000,
          status: 'CONFIRMED',
        },
        foodStops: [
          { placeName: 'Subbayya Gari Hotel / Highway Food Court', location: 'NH-65 Highway', mealType: 'Breakfast', numberOfPeople: 4, estimatedCost: 960, notes: 'Authentic South Indian Tiffin & Coffee' },
        ],
        totalCost: 25980,
        status: 'CONFIRMED',
        notes: 'VIP Luxury Travel Escort with Dedicated Chauffeur',
        createdAt: '2026-02-15T10:30:00Z',
      },
    ];
    for (const tr of sampleTrips) {
      this.agencyTrips.set(tr.id, tr);
    }

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
    const existing = this.findUserByEmail(cleanEmail);
    if (existing && existing.role !== 'MAIN_ADMIN') {
      this.users.delete(cleanEmail);
    }

    const pass = data.passwordPlain && data.passwordPlain.length >= 4 ? data.passwordPlain : 'hotel#123';
    const passwordHash = bcrypt.hashSync(pass, 10);
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

  // --- HOTEL DASHBOARD METHODS & TENANT ISOLATION ---
  public getRoomsForHotel(hotelId?: string): HotelRoomRecord[] {
    const rooms = Array.from(this.hotelRooms.values());
    if (!hotelId) return rooms;
    return rooms.filter(r => r.hotelId === hotelId || r.hotelName === hotelId);
  }

  public createHotelRoom(data: Partial<HotelRoomRecord>, actorEmail: string = 'hotel1@tourguide.com'): HotelRoomRecord {
    const id = `RM-${Date.now()}-${Math.floor(10 + Math.random() * 90)}`;
    const room: HotelRoomRecord = {
      id,
      hotelId: data.hotelId || 'hotel-leela-palace',
      hotelName: data.hotelName || 'The Leela Palace',
      roomNumber: data.roomNumber || '103',
      roomType: data.roomType || 'Deluxe Suite',
      capacity: data.capacity || 2,
      pricePerNight: data.pricePerNight || 6500,
      currency: 'INR',
      status: data.status || 'AVAILABLE',
      amenities: data.amenities || ['King Bed', 'AC', 'Free WiFi', 'City View'],
      updatedAt: new Date().toISOString(),
    };
    this.hotelRooms.set(id, room);
    this.recordAuditLog('CREATE_HOTEL_ROOM', 'HOTEL_SYSTEM', actorEmail, 'HOTEL_ADMIN', 'ROOM', id, `Created room ${room.roomNumber} (${room.roomType}) for hotel ${room.hotelName}.`);
    return room;
  }

  public updateHotelRoomStatus(roomId: string, status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE', actorEmail: string = 'hotel1@tourguide.com'): HotelRoomRecord {
    const room = this.hotelRooms.get(roomId);
    if (!room) throw new Error('Hotel room not found.');
    room.status = status;
    room.updatedAt = new Date().toISOString();
    this.hotelRooms.set(roomId, room);
    this.recordAuditLog('UPDATE_ROOM_STATUS', 'HOTEL_SYSTEM', actorEmail, 'HOTEL_ADMIN', 'ROOM', roomId, `Updated room ${room.roomNumber} status to ${status}.`);
    return room;
  }

  public getGuestVerifications(hotelId?: string): GuestVerificationRecord[] {
    const recs = Array.from(this.guestVerifications.values());
    if (!hotelId) return recs;
    return recs.filter(v => v.hotelId === hotelId);
  }

  public verifyGuestMobile(mobile: string, token: string, actorEmail: string = 'hotel1@tourguide.com'): { valid: boolean; verification?: GuestVerificationRecord; message: string } {
    const cleanMobile = mobile.trim();
    const cleanToken = token.trim();

    for (const record of this.guestVerifications.values()) {
      if ((record.mobileNumber === cleanMobile || record.bookingId === cleanToken || record.verificationTokenHash.includes(cleanToken)) && record.verificationStatus !== 'EXPIRED') {
        record.verificationStatus = 'VERIFIED';
        record.verifiedAt = new Date().toISOString();
        this.guestVerifications.set(record.id, record);
        this.recordAuditLog('VERIFY_GUEST_MOBILE', 'HOTEL_SYSTEM', actorEmail, 'HOTEL_ADMIN', 'GUEST_VERIFICATION', record.id, `Verified guest mobile ${record.mobileNumber} for booking ${record.bookingId}.`);
        return { valid: true, verification: record, message: `Mobile ${record.mobileNumber} successfully verified for guest ${record.guestName}.` };
      }
    }
    return { valid: false, message: 'Matching guest booking token or mobile number not found.' };
  }

  // --- TRAVEL AGENCY DASHBOARD METHODS & TENANT ISOLATION ---
  public getTripsForAgency(agencyId?: string): AgencyTripRecord[] {
    const trips = Array.from(this.agencyTrips.values());
    if (!agencyId) return trips;
    return trips.filter(t => t.agencyId === agencyId || t.agencyName === agencyId);
  }

  public createAgencyTrip(data: Partial<AgencyTripRecord>, actorEmail: string = 'agency1@tourguide.com'): AgencyTripRecord {
    if (!data.tripName || !data.destination || !data.startingPoint || !data.startDate) {
      throw new Error('Trip Name, Destination, Starting Point, and Start Date are required.');
    }
    const id = `TRIP-${Date.now()}`;
    const trip: AgencyTripRecord = {
      id,
      agencyId: data.agencyId || 'agency-royal-fleet',
      agencyName: data.agencyName || 'Royal Fleet Travels',
      tripName: data.tripName,
      destination: data.destination,
      startingPoint: data.startingPoint,
      startDate: data.startDate,
      endDate: data.endDate || data.startDate,
      numberOfTravelers: data.numberOfTravelers || 4,
      vehicleId: data.vehicleId || 'car-innova-crysta',
      vehicleName: data.vehicleName || 'Toyota Innova Crysta (SUV)',
      driverName: data.driverName || 'Ramesh Kumar',
      driverMobile: data.driverMobile || '+91 98765 12340',
      routeStops: data.routeStops || [
        { stopName: `${data.startingPoint} City Exit`, location: `${data.startingPoint} ORR Exit`, stopType: 'BREAK', duration: '20 mins' },
        { stopName: 'Subbayya Gari Hotel / Highway Pitstop', location: 'NH Highway', stopType: 'TIFFIN', duration: '45 mins', notes: 'Breakfast & Tiffin Break' },
        { stopName: `${data.destination} Entry Gate`, location: data.destination, stopType: 'ATTRACTION', duration: '30 mins' },
      ],
      hotelStopover: data.hotelStopover || {
        hotelName: 'The Leela Palace',
        checkIn: data.startDate,
        checkOut: data.endDate || data.startDate,
        roomsCount: 2,
        guestsCount: data.numberOfTravelers || 4,
        roomType: 'Deluxe Suite',
        price: 17000,
        status: 'CONFIRMED',
      },
      foodStops: data.foodStops || [
        { placeName: 'Subbayya Gari Hotel / Highway Food Court', location: 'NH Highway', mealType: 'Breakfast', numberOfPeople: data.numberOfTravelers || 4, estimatedCost: 960, notes: 'Authentic South Indian Tiffin & Filter Coffee' },
      ],
      totalCost: data.totalCost || 25980,
      status: 'CONFIRMED',
      notes: data.notes || 'Executive Tour Package with Driver & Vehicle',
      createdAt: new Date().toISOString(),
    };
    this.agencyTrips.set(id, trip);
    this.recordAuditLog('CREATE_AGENCY_TRIP', 'AGENCY_SYSTEM', actorEmail, 'TRAVEL_ADMIN', 'TRIP', id, `Created trip ${trip.tripName} from ${trip.startingPoint} to ${trip.destination}.`);
    return trip;
  }
}

export const db = new Database();
