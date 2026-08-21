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
  hotelId?: string; // For HOTEL_ADMIN: isolated to specific hotel
  hotelName?: string;
  agencyId?: string; // For TRAVEL_ADMIN: isolated to fleet agency
  agencyName?: string;
  createdAt: string;
}

class Database {
  private users: Map<string, AuthUser> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private hotels: Map<string, Hotel> = new Map();
  private vehicles: Map<string, Vehicle> = new Map();
  private pitstops: Map<string, Pitstop> = new Map();
  private adminRequests: Map<string, AdminRequest> = new Map();

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    const saltRounds = 10;
    // Secure bcrypt password hashes
    const defaultUserHash = bcrypt.hashSync('Travel@2026', saltRounds);
    const mainAdminHash = bcrypt.hashSync('admin@123', saltRounds);
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
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'TGAI-USER-HTL0001',
        userId: 'TGAI-USER-HTL0001',
        name: 'Hotel Manager - The Leela Palace',
        email: 'hotel1@tourguide.com',
        phone: '+91 11 3933 1234',
        passwordHash: hotelAdminHash,
        role: 'HOTEL_ADMIN',
        hotelId: 'hotel-leela-palace',
        hotelName: 'The Leela Palace',
        createdAt: '2026-01-10T00:00:00Z',
      },
      {
        id: 'TGAI-USER-HTL0002',
        userId: 'TGAI-USER-HTL0002',
        name: 'Hotel Manager - Taj Palace',
        email: 'hotel2@tourguide.com',
        phone: '+91 11 2611 0202',
        passwordHash: hotelAdminHash,
        role: 'HOTEL_ADMIN',
        hotelId: 'hotel-taj-palace',
        hotelName: 'Taj Palace Hotel',
        createdAt: '2026-01-12T00:00:00Z',
      },
      {
        id: 'TGAI-USER-TRV0001',
        userId: 'TGAI-USER-TRV0001',
        name: 'TourGuide Travel Agency Operations',
        email: 'agency1@tourguide.com',
        phone: '+91 98000 11223',
        passwordHash: travelAdminHash,
        role: 'TRAVEL_ADMIN',
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
  }

  // --- Auth Methods ---
  public findUserByEmail(email: string): AuthUser | undefined {
    return this.users.get(email.toLowerCase().trim());
  }

  public findUserById(id: string): AuthUser | undefined {
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return undefined;
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
    const existing = this.findUserByEmail(email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }
    const passwordHash = bcrypt.hashSync(passwordPlain, 10);
    const uid = generateUserId();
    const newUser: AuthUser = {
      id: uid,
      userId: uid,
      name,
      email: email.toLowerCase().trim(),
      phone,
      passwordHash,
      role,
      hotelId,
      hotelName,
      agencyId,
      agencyName,
      createdAt: new Date().toISOString(),
    };
    this.users.set(newUser.email, newUser);
    return newUser;
  }

  public verifyPassword(plain: string, hash: string): boolean {
    return bcrypt.compareSync(plain, hash);
  }

  public listPublicAdmins(): Array<Omit<AuthUser, 'passwordHash'>> {
    return Array.from(this.users.values()).map(({ passwordHash, ...rest }) => rest);
  }

  // --- Bookings Methods with Role-Based Isolation ---
  public getBookingsForUser(user: AuthUser | null): Booking[] {
    const all = Array.from(this.bookings.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (!user) {
      return all;
    }

    switch (user.role) {
      case 'MAIN_ADMIN':
        return all;

      case 'HOTEL_ADMIN':
        // Isolated to this specific hotel
        return all.filter((b) => b.hotel && b.hotel.id === user.hotelId);

      case 'TRAVEL_ADMIN':
        // Isolated to travel agency car bookings
        return all.filter((b) => Boolean(b.vehicle));

      case 'USER':
      default:
        // Isolated to traveler's own bookings
        return all.filter(
          (b) => b.user.email.toLowerCase() === user.email.toLowerCase() || b.user.phone === user.phone
        );
    }
  }

  public getBookingById(id: string, user: AuthUser | null = null): Booking | undefined {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    if (user) {
      if (user.role === 'HOTEL_ADMIN' && booking.hotel?.id !== user.hotelId) {
        return undefined;
      }
      if (user.role === 'USER' && booking.user.email.toLowerCase() !== user.email.toLowerCase()) {
        return undefined;
      }
    }
    return booking;
  }

  public saveBooking(booking: Booking): Booking {
    this.bookings.set(booking.id, booking);
    return booking;
  }

  public updateBookingStatus(
    id: string,
    status: 'Confirmed' | 'Pending' | 'Cancelled',
    user: AuthUser | null = null
  ): boolean {
    const booking = this.bookings.get(id);
    if (!booking) return false;

    if (user && user.role === 'HOTEL_ADMIN' && booking.hotel?.id !== user.hotelId) {
      throw new Error('Unauthorized: Hotel sub-admins cannot modify other hotels.');
    }

    booking.status = status;
    this.bookings.set(id, booking);
    return true;
  }

  public deleteBooking(id: string, user: AuthUser | null = null): boolean {
    const booking = this.bookings.get(id);
    if (!booking) return false;

    if (user && user.role === 'HOTEL_ADMIN') {
      throw new Error('Unauthorized: Only Main Admins or Travelers may cancel bookings.');
    }

    return this.bookings.delete(id);
  }

  // --- Admin Requests ---
  public submitAdminRequest(data: Omit<AdminRequest, 'id' | 'status' | 'createdAt'>): AdminRequest {
    const id = `req-${Date.now()}`;
    const newReq: AdminRequest = {
      ...data,
      id,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.adminRequests.set(id, newReq);
    return newReq;
  }

  public getAdminRequests(): AdminRequest[] {
    return Array.from(this.adminRequests.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public approveAdminRequest(
    id: string,
    customEmail?: string,
    customPassword?: string,
    assignedHotelId?: string,
    assignedHotelName?: string,
    assignedAgencyId?: string,
    assignedAgencyName?: string
  ): { request: AdminRequest; user: AuthUser } {
    const req = this.adminRequests.get(id);
    if (!req) throw new Error('Request not found');

    const pass = customPassword || 'Admin@123';
    const cleanEmail = (customEmail || req.email).toLowerCase().trim();
    const isHotel = req.businessType === 'HOTEL_ADMIN';
    const isAgency = req.businessType === 'TRAVEL_ADMIN';

    const hId = assignedHotelId || (isHotel ? `hotel-${Date.now()}` : undefined);
    const hName = assignedHotelName || (isHotel ? req.businessName : undefined);
    const aId = assignedAgencyId || (isAgency ? `agency-${Date.now()}` : undefined);
    const aName = assignedAgencyName || (isAgency ? req.businessName : undefined);

    // Create or update user as partner admin
    let user = this.findUserByEmail(cleanEmail);
    if (!user) {
      user = this.registerUser(
        req.ownerName || req.businessName,
        cleanEmail,
        req.phone || '+91 99000 00000',
        pass,
        req.businessType,
        hId,
        hName,
        aId,
        aName
      );
    } else {
      user.role = req.businessType;
      if (isHotel) {
        user.hotelId = hId || user.hotelId;
        user.hotelName = hName || user.hotelName;
      }
      if (isAgency) {
        user.agencyId = aId || user.agencyId;
        user.agencyName = aName || user.agencyName;
      }
    }

    req.status = 'APPROVED';
    req.assignedHotelId = user.hotelId;
    req.assignedHotelName = user.hotelName;
    req.generatedCredentials = {
      email: user.email,
      temporaryPassword: pass,
    };
    this.adminRequests.set(id, req);

    return { request: req, user };
  }

  public rejectAdminRequest(id: string): AdminRequest {
    const req = this.adminRequests.get(id);
    if (!req) throw new Error('Request not found');
    req.status = 'REJECTED';
    this.adminRequests.set(id, req);
    return req;
  }

  // --- Entities Retrieval ---
  public getHotels(cityFilter?: string): Hotel[] {
    const list = Array.from(this.hotels.values());
    if (!cityFilter) return list;
    const lower = cityFilter.toLowerCase();
    const matched = list.filter((h) => h.location.toLowerCase().includes(lower) || h.name.toLowerCase().includes(lower));
    return matched.length > 0 ? matched : list;
  }

  public getVehicles(): Vehicle[] {
    return Array.from(this.vehicles.values());
  }

  public getPitstops(): Pitstop[] {
    return Array.from(this.pitstops.values());
  }
}

export const db = new Database();
