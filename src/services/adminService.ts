import {
  AdminUser,
  AdminRole,
  AdminStatus,
  AdminPermission,
  HotelPartner,
  HotelRoom,
  TravelAgencyPartner,
  AgencyVehicle,
  AgencyDriver,
  AdminBookingRecord,
  AdminCustomerProfile,
  AdminAuditRecord,
  AdminSession,
  PartnerBookingStatus,
  PartnerPaymentStatus,
  AdminPreAuthCredential,
  StayPermission,
  StayPermissionStatus,
  StayVerificationStatus,
} from '../types/admin';
import { eventBus } from './eventBus';

const STORAGE_KEYS = {
  SESSION: 'tourguide_admin_session',
  ADMINS: 'tourguide_admin_users',
  HOTELS: 'tourguide_admin_hotels',
  ROOMS: 'tourguide_admin_rooms',
  AGENCIES: 'tourguide_admin_agencies',
  VEHICLES: 'tourguide_admin_vehicles',
  DRIVERS: 'tourguide_admin_drivers',
  BOOKINGS: 'tourguide_admin_bookings',
  CUSTOMERS: 'tourguide_admin_customers',
  AUDIT_LOGS: 'tourguide_admin_audit_logs',
  PREAUTH_CREDENTIALS: 'tourguide_admin_preauth_credentials',
  STAY_PERMISSIONS: 'tourguide_admin_stay_permissions',
};

// -------------------------------------------------------------
// INITIAL MOCK DATA (High quality, relational & multi-tenant)
// -------------------------------------------------------------

const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'ADMIN_SUPER_001',
    name: 'Main System Admin',
    email: 'admin@tourguide.com',
    password: 'admin123',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    permissions: [
      'VIEW_CUSTOMERS',
      'MANAGE_CUSTOMERS',
      'VIEW_BOOKINGS',
      'MANAGE_BOOKINGS',
      'VIEW_HOTELS',
      'MANAGE_HOTELS',
      'VIEW_AGENCIES',
      'MANAGE_AGENCIES',
      'VIEW_VEHICLES',
      'MANAGE_VEHICLES',
      'VIEW_REVENUE',
      'VIEW_REPORTS',
      'MANAGE_ADMINS',
      'VIEW_AUDIT_LOGS',
    ],
    createdAt: '2026-01-15T08:00:00.000Z',
    lastLogin: '2026-08-19T09:30:00.000Z',
  },
  {
    id: 'ADMIN_SUPER_002',
    name: 'System Operations Lead',
    email: 'admin.ops@tourguide.ai',
    password: 'admin123',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    permissions: [
      'VIEW_CUSTOMERS',
      'MANAGE_CUSTOMERS',
      'VIEW_BOOKINGS',
      'MANAGE_BOOKINGS',
      'VIEW_HOTELS',
      'MANAGE_HOTELS',
      'VIEW_AGENCIES',
      'MANAGE_AGENCIES',
      'VIEW_VEHICLES',
      'MANAGE_VEHICLES',
      'VIEW_REVENUE',
      'VIEW_REPORTS',
      'MANAGE_ADMINS',
      'VIEW_AUDIT_LOGS',
    ],
    createdAt: '2026-01-15T08:00:00.000Z',
    lastLogin: '2026-08-19T09:45:00.000Z',
  },
  {
    id: 'ADMIN_SUB_001',
    name: 'Vikram Mehta (Operations Lead)',
    email: 'subadmin@example.com',
    password: 'subadmin123',
    role: 'SUB_ADMIN',
    status: 'ACTIVE',
    permissions: [
      'VIEW_CUSTOMERS',
      'VIEW_BOOKINGS',
      'MANAGE_BOOKINGS',
      'VIEW_HOTELS',
      'VIEW_AGENCIES',
      'VIEW_VEHICLES',
      'VIEW_REPORTS',
    ],
    createdAt: '2026-02-10T10:00:00.000Z',
    lastLogin: '2026-08-18T14:20:00.000Z',
  },
  {
    id: 'ADMIN_HOTEL_001',
    name: 'Carlos D’Souza (General Manager)',
    email: 'hoteladmin@example.com',
    password: 'hotel123',
    role: 'HOTEL_ADMIN',
    status: 'ACTIVE',
    hotelId: 'HOTEL_001',
    hotelName: 'Grand Goa Luxury Resort & Spa',
    permissions: ['VIEW_CUSTOMERS', 'VIEW_BOOKINGS', 'MANAGE_BOOKINGS', 'VIEW_HOTELS', 'MANAGE_HOTELS', 'VIEW_REVENUE'],
    createdAt: '2026-03-01T09:00:00.000Z',
    lastLogin: '2026-08-19T08:15:00.000Z',
  },
  {
    id: 'ADMIN_HOTEL_002',
    name: 'Sunita Rao (Sanctuary Director)',
    email: 'hyderabadhotel@example.com',
    password: 'hotel123',
    role: 'HOTEL_ADMIN',
    status: 'ACTIVE',
    hotelId: 'HOTEL_002',
    hotelName: 'Hyderabad Palace Enclave & Suites',
    permissions: ['VIEW_CUSTOMERS', 'VIEW_BOOKINGS', 'MANAGE_BOOKINGS', 'VIEW_HOTELS', 'MANAGE_HOTELS', 'VIEW_REVENUE'],
    createdAt: '2026-03-15T09:00:00.000Z',
    lastLogin: '2026-08-17T11:00:00.000Z',
  },
  {
    id: 'ADMIN_AGENCY_001',
    name: 'Rajesh Varma (Fleet Director)',
    email: 'agencyadmin@example.com',
    password: 'agency123',
    role: 'AGENCY_ADMIN',
    status: 'ACTIVE',
    agencyId: 'AGENCY_001',
    agencyName: 'Goa Royal Transit & Charters',
    permissions: ['VIEW_CUSTOMERS', 'VIEW_BOOKINGS', 'MANAGE_BOOKINGS', 'VIEW_AGENCIES', 'MANAGE_AGENCIES', 'VIEW_VEHICLES', 'MANAGE_VEHICLES', 'VIEW_REVENUE'],
    createdAt: '2026-03-05T11:30:00.000Z',
    lastLogin: '2026-08-19T07:45:00.000Z',
  },
  {
    id: 'ADMIN_AGENCY_002',
    name: 'Kavita Reddy (Deccan Chariots Lead)',
    email: 'deccanagency@example.com',
    password: 'agency123',
    role: 'AGENCY_ADMIN',
    status: 'ACTIVE',
    agencyId: 'AGENCY_002',
    agencyName: 'Deccan Highway Express & Luxury Fleets',
    permissions: ['VIEW_CUSTOMERS', 'VIEW_BOOKINGS', 'MANAGE_BOOKINGS', 'VIEW_AGENCIES', 'MANAGE_AGENCIES', 'VIEW_VEHICLES', 'MANAGE_VEHICLES', 'VIEW_REVENUE'],
    createdAt: '2026-03-20T10:15:00.000Z',
    lastLogin: '2026-08-18T16:00:00.000Z',
  },
];

const INITIAL_PREAUTH_CREDENTIALS: AdminPreAuthCredential[] = [
  {
    id: 'AUTH_GRANT_001',
    email: 'hotel.test@grandresort.com',
    tempPassword: 'HotelPass2026!',
    targetRole: 'HOTEL_ADMIN',
    partnerName: 'Grand Goa Beachfront Suites',
    status: 'ACTIVE_PENDING_REGISTRATION',
    createdByAdminId: 'ADMIN_SUPER_001',
    createdByAdminName: 'Main System Admin',
    issuedAt: '2026-08-01T10:00:00.000Z',
    expiresAt: '2026-12-31T23:59:59.000Z',
  },
  {
    id: 'AUTH_GRANT_002',
    email: 'agency.test@royaltransit.com',
    tempPassword: 'AgencyPass2026!',
    targetRole: 'AGENCY_ADMIN',
    partnerName: 'Royal Deccan Travel Agency',
    status: 'ACTIVE_PENDING_REGISTRATION',
    createdByAdminId: 'ADMIN_SUPER_001',
    createdByAdminName: 'Main System Admin',
    issuedAt: '2026-08-05T14:30:00.000Z',
    expiresAt: '2026-12-31T23:59:59.000Z',
  },
];

const INITIAL_STAY_PERMISSIONS: StayPermission[] = [
  {
    id: 'STAY_PERM_001',
    stayPassCode: 'STAY-GOA-9821',
    bookingId: 'BK_1001',
    guestName: 'Rahul Sharma',
    guestEmail: 'rahul.sharma@example.com',
    guestPhone: '+91 98765 43210',
    idProofType: 'Aadhaar',
    idProofNumber: '4821 9012 3341',
    hotelId: 'HOTEL_001',
    hotelName: 'Grand Goa Luxury Resort & Spa',
    roomId: 'ROOM_101',
    roomNumber: '101',
    roomType: 'Deluxe Suite',
    agencyId: 'AGENCY_001',
    agencyName: 'Goa Royal Transit & Charters',
    checkInDate: '2026-09-10',
    checkOutDate: '2026-09-14',
    stayDurationNights: 4,
    permissionStatus: 'GRANTED',
    verificationStatus: 'VERIFIED_VALID',
    grantedAt: '2026-08-15T10:30:00.000Z',
    verifiedByStaffId: 'ADMIN_HOTEL_001',
    verifiedByStaffName: 'Carlos D’Souza (General Manager)',
    specialInstructions: 'VIP Welcome drink on arrival. Sea-facing villa assigned.',
    createdAt: '2026-08-14T09:00:00.000Z',
  },
  {
    id: 'STAY_PERM_002',
    stayPassCode: 'STAY-HYD-4412',
    bookingId: 'BK_1002',
    guestName: 'Priya Patel',
    guestEmail: 'priya.patel@example.com',
    guestPhone: '+91 91234 56789',
    idProofType: 'Passport',
    idProofNumber: 'Z8941029',
    hotelId: 'HOTEL_002',
    hotelName: 'Hyderabad Palace Enclave & Suites',
    roomId: 'ROOM_201',
    roomNumber: '201',
    roomType: 'Heritage Suite',
    agencyId: 'AGENCY_002',
    agencyName: 'Deccan Highway Express & Luxury Fleets',
    checkInDate: '2026-09-18',
    checkOutDate: '2026-09-21',
    stayDurationNights: 3,
    permissionStatus: 'PENDING_APPROVAL',
    verificationStatus: 'PENDING_VERIFICATION',
    specialInstructions: 'Late check-in requested at 10 PM.',
    createdAt: '2026-08-20T11:20:00.000Z',
  },
];

const INITIAL_HOTELS: HotelPartner[] = [
  {
    id: 'HOTEL_001',
    name: 'Grand Goa Luxury Resort & Spa',
    city: 'Goa',
    address: 'Candolim Beach Road, North Goa, 403515',
    phone: '+91 832 245 8000',
    email: 'concierge@grandgoaresort.com',
    status: 'ACTIVE',
    assignedAdminId: 'ADMIN_HOTEL_001',
    assignedAdminEmail: 'hoteladmin@example.com',
    rating: 4.9,
    roomCount: 12,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    amenities: ['Private Beachfront', 'Infinity Pool', 'Ayurvedic Spa', 'Helipad Access', 'Butler Service'],
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'HOTEL_002',
    name: 'Hyderabad Palace Enclave & Suites',
    city: 'Hyderabad',
    address: 'Banjara Hills Road No. 1, Hyderabad, 500034',
    phone: '+91 40 6629 3333',
    email: 'reservations@hyderabadpalace.com',
    status: 'ACTIVE',
    assignedAdminId: 'ADMIN_HOTEL_002',
    assignedAdminEmail: 'hyderabadhotel@example.com',
    rating: 4.8,
    roomCount: 8,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    amenities: ['Nizami Fine Dining', 'Rooftop Lounge', 'Chauffeur Service', 'Spa & Wellness'],
    createdAt: '2026-01-12T00:00:00.000Z',
  },
  {
    id: 'HOTEL_003',
    name: 'Kerala Backwater Sanctuary Villa',
    city: 'Kochi',
    address: 'Vembanad Lakefront, Kumarakom, Kerala, 686563',
    phone: '+91 481 252 4900',
    email: 'stay@keralasanctuary.com',
    status: 'ACTIVE',
    rating: 4.9,
    roomCount: 10,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    amenities: ['Private Houseboat Jetty', 'Ayurveda Pavilion', 'Lotus Pond', 'Organic Dining'],
    createdAt: '2026-01-20T00:00:00.000Z',
  },
];

const INITIAL_ROOMS: HotelRoom[] = [
  // Grand Goa Rooms
  { id: 'ROOM_101', hotelId: 'HOTEL_001', roomNumber: '101', roomType: 'Deluxe Suite', capacity: 2, pricePerNight: 8500, currency: '₹', status: 'OCCUPIED', amenities: ['Sea View', 'Jacuzzi', 'King Bed'] },
  { id: 'ROOM_102', hotelId: 'HOTEL_001', roomNumber: '102', roomType: 'Presidential Villa', capacity: 4, pricePerNight: 16500, currency: '₹', status: 'AVAILABLE', amenities: ['Private Pool', 'Butler Service', '2 King Beds'] },
  { id: 'ROOM_103', hotelId: 'HOTEL_001', roomNumber: '103', roomType: 'Luxury Oceanfront', capacity: 2, pricePerNight: 11000, currency: '₹', status: 'RESERVED', amenities: ['Balcony', 'Ocean View', 'King Bed'] },
  { id: 'ROOM_104', hotelId: 'HOTEL_001', roomNumber: '104', roomType: 'Heritage Suite', capacity: 3, pricePerNight: 9500, currency: '₹', status: 'AVAILABLE', amenities: ['Garden View', 'Antique Teak Decor'] },
  { id: 'ROOM_105', hotelId: 'HOTEL_001', roomNumber: '105', roomType: 'Standard Villa', capacity: 2, pricePerNight: 7000, currency: '₹', status: 'MAINTENANCE', amenities: ['Courtyard View'] },

  // Hyderabad Rooms
  { id: 'ROOM_201', hotelId: 'HOTEL_002', roomNumber: '201', roomType: 'Heritage Suite', capacity: 2, pricePerNight: 9200, currency: '₹', status: 'OCCUPIED', amenities: ['City View', 'Marble Bath'] },
  { id: 'ROOM_202', hotelId: 'HOTEL_002', roomNumber: '202', roomType: 'Presidential Villa', capacity: 4, pricePerNight: 18000, currency: '₹', status: 'AVAILABLE', amenities: ['Royal Living Area', 'Private Dining'] },
  { id: 'ROOM_203', hotelId: 'HOTEL_002', roomNumber: '203', roomType: 'Deluxe Suite', capacity: 2, pricePerNight: 8000, currency: '₹', status: 'AVAILABLE', amenities: ['Executive Desk', 'Lounge Access'] },

  // Kerala Rooms
  { id: 'ROOM_301', hotelId: 'HOTEL_003', roomNumber: '301', roomType: 'Luxury Oceanfront', capacity: 2, pricePerNight: 10500, currency: '₹', status: 'AVAILABLE', amenities: ['Backwater View', 'Private Deck'] },
  { id: 'ROOM_302', hotelId: 'HOTEL_003', roomNumber: '302', roomType: 'Presidential Villa', capacity: 4, pricePerNight: 19500, currency: '₹', status: 'OCCUPIED', amenities: ['Private Plunge Pool', 'Ayurvedic Tub'] },
];

const INITIAL_AGENCIES: TravelAgencyPartner[] = [
  {
    id: 'AGENCY_001',
    name: 'Goa Royal Transit & Charters',
    contactPerson: 'Rajesh Varma',
    city: 'Goa',
    address: 'Panjim Harbor Terminal, Goa, 403001',
    phone: '+91 832 222 5500',
    email: 'dispatch@goaroyaltransit.com',
    status: 'ACTIVE',
    assignedAdminId: 'ADMIN_AGENCY_001',
    assignedAdminEmail: 'agencyadmin@example.com',
    vehicleCount: 6,
    driverCount: 4,
    rating: 4.9,
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'AGENCY_002',
    name: 'Deccan Highway Express & Luxury Fleets',
    contactPerson: 'Kavita Reddy',
    city: 'Hyderabad',
    address: 'Gachibowli High-Tech Corridor, Hyderabad, 500032',
    phone: '+91 40 4455 8800',
    email: 'fleet@deccanexpress.com',
    status: 'ACTIVE',
    assignedAdminId: 'ADMIN_AGENCY_002',
    assignedAdminEmail: 'deccanagency@example.com',
    vehicleCount: 8,
    driverCount: 6,
    rating: 4.8,
    createdAt: '2026-01-15T00:00:00.000Z',
  },
];

const INITIAL_VEHICLES: AgencyVehicle[] = [
  // Agency 1 (Goa)
  { id: 'VEH_001', agencyId: 'AGENCY_001', agencyName: 'Goa Royal Transit & Charters', registrationNumber: 'GA-03-A-1008', model: 'Mercedes-Benz E-Class VIP', type: 'Luxury Sedan', capacity: 3, driverId: 'DRV_001', driverName: 'Sunil Naik', pricePerDay: 6500, currency: '₹', status: 'ON_TRIP', features: ['WiFi', 'Chilled Beverages', 'Leather Recliners'], createdAt: '2026-01-15T00:00:00.000Z' },
  { id: 'VEH_002', agencyId: 'AGENCY_001', agencyName: 'Goa Royal Transit & Charters', registrationNumber: 'GA-03-E-4521', model: 'Toyota Vellfire Executive Lounge', type: 'Executive SUV', capacity: 6, driverId: 'DRV_002', driverName: 'Ramesh Prabhu', pricePerDay: 9500, currency: '₹', status: 'AVAILABLE', features: ['Ottoman Seats', 'Dual Sunroof', 'Noise Cancelling'], createdAt: '2026-01-15T00:00:00.000Z' },
  { id: 'VEH_003', agencyId: 'AGENCY_001', agencyName: 'Goa Royal Transit & Charters', registrationNumber: 'GA-01-C-9900', model: 'BMW 7 Series Royal Chariot', type: 'VIP Royal Chariot', capacity: 3, pricePerDay: 12000, currency: '₹', status: 'AVAILABLE', features: ['Executive Rear Lounge', 'Massage Seats'], createdAt: '2026-02-01T00:00:00.000Z' },
  { id: 'VEH_004', agencyId: 'AGENCY_001', agencyName: 'Goa Royal Transit & Charters', registrationNumber: 'GA-07-F-3344', model: 'Force Urbania Luxury Coach', type: 'Premium Coach', capacity: 12, driverId: 'DRV_003', driverName: 'Prakash Gaonkar', pricePerDay: 14000, currency: '₹', status: 'MAINTENANCE', features: ['Individual AC', 'Reclining Seats', 'Mic System'], createdAt: '2026-02-10T00:00:00.000Z' },

  // Agency 2 (Hyderabad)
  { id: 'VEH_005', agencyId: 'AGENCY_002', agencyName: 'Deccan Highway Express & Luxury Fleets', registrationNumber: 'TS-09-UB-7777', model: 'Audi A8 L Chauffeur Edition', type: 'Luxury Sedan', capacity: 3, driverId: 'DRV_004', driverName: 'Mohammed Azhar', pricePerDay: 7500, currency: '₹', status: 'AVAILABLE', features: ['Bang & Olufsen Sound', 'Privacy Blinds'], createdAt: '2026-01-20T00:00:00.000Z' },
  { id: 'VEH_006', agencyId: 'AGENCY_002', agencyName: 'Deccan Highway Express & Luxury Fleets', registrationNumber: 'TS-07-EX-2233', model: 'Toyota Innova Hycross ZX', type: 'Executive SUV', capacity: 6, driverId: 'DRV_005', driverName: 'Suresh Kumar', pricePerDay: 5500, currency: '₹', status: 'BOOKED', features: ['Captain Seats', 'Panoramic Sunroof'], createdAt: '2026-01-22T00:00:00.000Z' },
];

const INITIAL_DRIVERS: AgencyDriver[] = [
  { id: 'DRV_001', agencyId: 'AGENCY_001', agencyName: 'Goa Royal Transit & Charters', name: 'Sunil Naik', phone: '+91 98221 44556', licenseNumber: 'GA-2015-88992', assignedVehicleId: 'VEH_001', assignedVehicleModel: 'Mercedes-Benz E-Class VIP', rating: 4.95, tripsCompleted: 142, status: 'ON_TRIP', createdAt: '2026-01-15T00:00:00.000Z' },
  { id: 'DRV_002', agencyId: 'AGENCY_001', agencyName: 'Goa Royal Transit & Charters', name: 'Ramesh Prabhu', phone: '+91 94220 11223', licenseNumber: 'GA-2017-44551', assignedVehicleId: 'VEH_002', assignedVehicleModel: 'Toyota Vellfire Executive Lounge', rating: 4.88, tripsCompleted: 98, status: 'AVAILABLE', createdAt: '2026-01-15T00:00:00.000Z' },
  { id: 'DRV_003', agencyId: 'AGENCY_001', agencyName: 'Goa Royal Transit & Charters', name: 'Prakash Gaonkar', phone: '+91 97654 33221', licenseNumber: 'GA-2019-12345', rating: 4.9, tripsCompleted: 64, status: 'AVAILABLE', createdAt: '2026-02-01T00:00:00.000Z' },
  { id: 'DRV_004', agencyId: 'AGENCY_002', agencyName: 'Deccan Highway Express & Luxury Fleets', name: 'Mohammed Azhar', phone: '+91 98490 66778', licenseNumber: 'TS-2014-99881', assignedVehicleId: 'VEH_005', assignedVehicleModel: 'Audi A8 L Chauffeur Edition', rating: 4.92, tripsCompleted: 185, status: 'AVAILABLE', createdAt: '2026-01-20T00:00:00.000Z' },
  { id: 'DRV_005', agencyId: 'AGENCY_002', agencyName: 'Deccan Highway Express & Luxury Fleets', name: 'Suresh Kumar', phone: '+91 99890 22334', licenseNumber: 'TS-2018-77665', assignedVehicleId: 'VEH_006', assignedVehicleModel: 'Toyota Innova Hycross ZX', rating: 4.85, tripsCompleted: 110, status: 'ASSIGNED', createdAt: '2026-01-22T00:00:00.000Z' },
];

const INITIAL_CUSTOMERS: AdminCustomerProfile[] = [
  { id: 'CUST_001', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+91 99887 76655', city: 'Hyderabad', createdAt: '2026-02-01T00:00:00.000Z', totalBookings: 3, totalSpent: 42500, currency: '₹', status: 'ACTIVE' },
  { id: 'CUST_002', name: 'Rahul Sharma', email: 'rahul.sharma@example.com', phone: '+91 98765 43210', city: 'Mumbai', createdAt: '2026-02-15T00:00:00.000Z', totalBookings: 2, totalSpent: 28000, currency: '₹', status: 'ACTIVE' },
  { id: 'CUST_003', name: 'Priya Patel', email: 'priya.patel@example.com', phone: '+91 98123 45678', city: 'Bengaluru', createdAt: '2026-03-01T00:00:00.000Z', totalBookings: 2, totalSpent: 24500, currency: '₹', status: 'ACTIVE' },
  { id: 'CUST_004', name: 'Ananya Sen', email: 'ananya.sen@example.com', phone: '+91 91234 56789', city: 'Kolkata', createdAt: '2026-03-10T00:00:00.000Z', totalBookings: 1, totalSpent: 12500, currency: '₹', status: 'ACTIVE' },
];

const INITIAL_BOOKINGS: AdminBookingRecord[] = [
  {
    id: 'BK_HTL_001',
    bookingCode: 'TG-GOA-1001',
    customerId: 'CUST_001',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    customerPhone: '+91 99887 76655',
    hotelId: 'HOTEL_001',
    hotelName: 'Grand Goa Luxury Resort & Spa',
    roomId: 'ROOM_101',
    roomNumber: '101',
    roomType: 'Deluxe Suite',
    checkInDate: '2026-09-10',
    checkOutDate: '2026-09-14',
    numberOfGuests: 2,
    numberOfRooms: 1,
    basePrice: 17000,
    taxes: 2040,
    serviceFee: 500,
    discount: 0,
    totalPrice: 19540,
    currency: '₹',
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    source: 'AI_RECOMMENDATION',
    createdAt: '2026-08-15T10:30:00.000Z',
    updatedAt: '2026-08-16T09:00:00.000Z',
  },
  {
    id: 'BK_HTL_002',
    bookingCode: 'TG-GOA-1002',
    customerId: 'CUST_002',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.sharma@example.com',
    customerPhone: '+91 98765 43210',
    hotelId: 'HOTEL_001',
    hotelName: 'Grand Goa Luxury Resort & Spa',
    roomId: 'ROOM_103',
    roomNumber: '103',
    roomType: 'Luxury Oceanfront',
    checkInDate: '2026-08-20',
    checkOutDate: '2026-08-23',
    numberOfGuests: 2,
    numberOfRooms: 1,
    basePrice: 22000,
    taxes: 2640,
    serviceFee: 500,
    discount: 1000,
    totalPrice: 24140,
    currency: '₹',
    bookingStatus: 'PENDING',
    paymentStatus: 'PAID',
    source: 'CUSTOMER_BOOKING',
    createdAt: '2026-08-18T14:15:00.000Z',
    updatedAt: '2026-08-18T14:15:00.000Z',
  },
  {
    id: 'BK_HTL_003',
    bookingCode: 'TG-HYD-2001',
    customerId: 'CUST_001',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    customerPhone: '+91 99887 76655',
    hotelId: 'HOTEL_002',
    hotelName: 'Hyderabad Palace Enclave & Suites',
    roomId: 'ROOM_201',
    roomNumber: '201',
    roomType: 'Heritage Suite',
    checkInDate: '2026-07-05',
    checkOutDate: '2026-07-07',
    numberOfGuests: 2,
    numberOfRooms: 1,
    basePrice: 9200,
    taxes: 1104,
    serviceFee: 300,
    discount: 0,
    totalPrice: 10604,
    currency: '₹',
    bookingStatus: 'CHECKED_OUT',
    paymentStatus: 'PAID',
    source: 'AI_RECOMMENDATION',
    createdAt: '2026-07-01T11:00:00.000Z',
    updatedAt: '2026-07-07T12:00:00.000Z',
  },
  {
    id: 'BK_TRV_001',
    bookingCode: 'TG-TRV-1001',
    customerId: 'CUST_001',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    customerPhone: '+91 99887 76655',
    agencyId: 'AGENCY_001',
    agencyName: 'Goa Royal Transit & Charters',
    vehicleId: 'VEH_001',
    vehicleModel: 'Mercedes-Benz E-Class VIP',
    driverId: 'DRV_001',
    driverName: 'Sunil Naik',
    travelDate: '2026-09-10',
    origin: 'Goa Dabolim Airport',
    destination: 'Candolim Beach Resort',
    pickupLocation: 'Terminal 1 VIP Arrival Gate',
    dropLocation: 'Grand Goa Luxury Resort',
    checkInDate: '2026-09-10',
    checkOutDate: '2026-09-10',
    numberOfGuests: 2,
    numberOfRooms: 0,
    basePrice: 6500,
    taxes: 780,
    serviceFee: 200,
    discount: 0,
    totalPrice: 7480,
    currency: '₹',
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    source: 'AI_RECOMMENDATION',
    createdAt: '2026-08-15T10:35:00.000Z',
    updatedAt: '2026-08-16T09:10:00.000Z',
  },
  {
    id: 'BK_TRV_002',
    bookingCode: 'TG-TRV-2002',
    customerId: 'CUST_003',
    customerName: 'Priya Patel',
    customerEmail: 'priya.patel@example.com',
    customerPhone: '+91 98123 45678',
    agencyId: 'AGENCY_002',
    agencyName: 'Deccan Highway Express & Luxury Fleets',
    vehicleId: 'VEH_006',
    vehicleModel: 'Toyota Innova Hycross ZX',
    driverId: 'DRV_005',
    driverName: 'Suresh Kumar',
    travelDate: '2026-08-25',
    origin: 'Hyderabad, India',
    destination: 'Vijayawada Highway',
    pickupLocation: 'Jubilee Hills Checkpost',
    dropLocation: 'Vijayawada Gate',
    checkInDate: '2026-08-25',
    checkOutDate: '2026-08-25',
    numberOfGuests: 4,
    numberOfRooms: 0,
    basePrice: 5500,
    taxes: 660,
    serviceFee: 200,
    discount: 0,
    totalPrice: 6360,
    currency: '₹',
    bookingStatus: 'PENDING',
    paymentStatus: 'PENDING',
    source: 'CUSTOMER_BOOKING',
    createdAt: '2026-08-19T06:00:00.000Z',
    updatedAt: '2026-08-19T06:00:00.000Z',
  },
];

const INITIAL_AUDIT_LOGS: AdminAuditRecord[] = [
  {
    id: 'AUDIT_001',
    actorId: 'ADMIN_SUPER_001',
    actorName: 'Main System Admin',
    actorEmail: 'superadmin@tourguide.ai',
    actorRole: 'SUPER_ADMIN',
    action: 'ADMIN_LOGIN',
    targetType: 'SESSION',
    targetId: 'ADMIN_SUPER_001',
    details: 'Super Admin successfully authenticated from VIP Terminal.',
    result: 'SUCCESS',
    timestamp: '2026-08-19T09:45:00.000Z',
  },
  {
    id: 'AUDIT_002',
    actorId: 'ADMIN_HOTEL_001',
    actorName: 'Carlos D’Souza',
    actorEmail: 'hoteladmin@example.com',
    actorRole: 'HOTEL_ADMIN',
    action: 'BOOKING_CONFIRMED',
    targetType: 'BOOKING',
    targetId: 'BK_HTL_001',
    details: 'Confirmed reservation for Aarav Sharma (Room 101).',
    result: 'SUCCESS',
    timestamp: '2026-08-16T09:00:00.000Z',
  },
  {
    id: 'AUDIT_003',
    actorId: 'ADMIN_AGENCY_001',
    actorName: 'Rajesh Varma',
    actorEmail: 'agencyadmin@example.com',
    actorRole: 'AGENCY_ADMIN',
    action: 'VEHICLE_ASSIGNED',
    targetType: 'VEHICLE',
    targetId: 'VEH_001',
    details: 'Assigned Driver Sunil Naik to Mercedes-Benz E-Class VIP.',
    result: 'SUCCESS',
    timestamp: '2026-08-15T11:00:00.000Z',
  },
];

// -------------------------------------------------------------
// ADMIN SERVICE IMPLEMENTATION
// -------------------------------------------------------------

export class AdminService {
  // --- STORAGE HELPERS ---
  private static load<T>(key: string, defaultData: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
      }
      return JSON.parse(item);
    } catch {
      return defaultData;
    }
  }

  private static save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving ${key}`, e);
    }
  }

  // --- INITIALIZATION ---
  public static init(): void {
    this.load(STORAGE_KEYS.ADMINS, INITIAL_ADMINS);
    this.load(STORAGE_KEYS.HOTELS, INITIAL_HOTELS);
    this.load(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
    this.load(STORAGE_KEYS.AGENCIES, INITIAL_AGENCIES);
    this.load(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    this.load(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
    this.load(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    this.load(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    this.load(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  // --- AUTHENTICATION & SESSION ---
  public static getActiveSession(): AdminSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!data) return null;
      const session: AdminSession = JSON.parse(data);
      if (session.expiresAt < Date.now()) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  public static login(email: string, password: string): { success: boolean; session?: AdminSession; error?: string } {
    this.init();
    const admins: AdminUser[] = this.load(STORAGE_KEYS.ADMINS, INITIAL_ADMINS);
    const normalizedEmail = email.trim().toLowerCase();

    const user = admins.find((a) => a.email.toLowerCase() === normalizedEmail);

    if (!user) {
      this.recordAudit({
        actorId: 'UNKNOWN',
        actorName: 'Anonymous',
        actorEmail: email,
        actorRole: 'CUSTOMER',
        action: 'FAILED_LOGIN_ATTEMPT',
        targetType: 'SECURITY',
        targetId: 'AUTH',
        details: `Failed login attempt for non-existent admin email: ${email}`,
        result: 'DENIED',
      });
      return { success: false, error: 'Incorrect email or password' };
    }

    if (user.status !== 'ACTIVE') {
      this.recordAudit({
        actorId: user.id,
        actorName: user.name,
        actorEmail: user.email,
        actorRole: user.role,
        action: 'BLOCKED_LOGIN_ATTEMPT',
        targetType: 'SECURITY',
        targetId: user.id,
        details: `Login attempt rejected: Administrator status is ${user.status}`,
        result: 'DENIED',
      });
      return { success: false, error: `Account is currently ${user.status.toLowerCase()}. Please contact Super Admin.` };
    }

    if (user.password !== password) {
      this.recordAudit({
        actorId: user.id,
        actorName: user.name,
        actorEmail: user.email,
        actorRole: user.role,
        action: 'FAILED_PASSWORD_ATTEMPT',
        targetType: 'SECURITY',
        targetId: user.id,
        details: `Invalid password entered for ${user.email}`,
        result: 'DENIED',
      });
      return { success: false, error: 'Incorrect email or password' };
    }

    // Login successful
    const updatedUser: AdminUser = {
      ...user,
      lastLogin: new Date().toISOString(),
    };

    const updatedAdmins = admins.map((a) => (a.id === user.id ? updatedUser : a));
    this.save(STORAGE_KEYS.ADMINS, updatedAdmins);

    const token = `adm_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const safeUser: AdminUser = {
      ...updatedUser,
      password: '[PROTECTED_HASH]',
    };

    const session: AdminSession = {
      token,
      user: safeUser,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));

    this.recordAudit({
      actorId: user.id,
      actorName: user.name,
      actorEmail: user.email,
      actorRole: user.role,
      action: 'ADMIN_LOGIN',
      targetType: 'SESSION',
      targetId: session.token,
      details: `${user.name} (${user.role}) logged in successfully.`,
      result: 'SUCCESS',
    });

    return { success: true, session };
  }

  // --- PUBLIC CATALOG SYNCHRONIZATION HELPERS ---
  public static getPublicVehicles(): AgencyVehicle[] {
    this.init();
    return this.load<AgencyVehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  }

  public static getPublicHotels(): HotelPartner[] {
    this.init();
    return this.load<HotelPartner[]>(STORAGE_KEYS.HOTELS, INITIAL_HOTELS);
  }

  public static getPublicRooms(hotelId?: string): HotelRoom[] {
    this.init();
    const rooms = this.load<HotelRoom[]>(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
    if (hotelId) {
      return rooms.filter((r) => r.hotelId === hotelId);
    }
    return rooms;
  }

  public static logout(): void {
    const session = this.getActiveSession();
    if (session) {
      this.recordAudit({
        actorId: session.user.id,
        actorName: session.user.name,
        actorEmail: session.user.email,
        actorRole: session.user.role,
        action: 'ADMIN_LOGOUT',
        targetType: 'SESSION',
        targetId: session.token,
        details: `${session.user.name} logged out.`,
        result: 'SUCCESS',
      });
    }
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  // --- PERMISSION & TENANT CHECKS ---
  public static hasPermission(user: AdminUser, permission: AdminPermission): boolean {
    if (user.role === 'SUPER_ADMIN') return true;
    if (user.status !== 'ACTIVE') return false;
    return user.permissions?.includes(permission) || false;
  }

  public static verifyTenantAccess(user: AdminUser, resource: { hotelId?: string; agencyId?: string }): boolean {
    if (user.role === 'SUPER_ADMIN') return true;
    if (user.role === 'SUB_ADMIN') return true; // Sub admin permissions are handled by hasPermission
    if (user.role === 'HOTEL_ADMIN') {
      return !!user.hotelId && user.hotelId === resource.hotelId;
    }
    if (user.role === 'AGENCY_ADMIN') {
      return !!user.agencyId && user.agencyId === resource.agencyId;
    }
    return false;
  }

  // --- AUDIT LOGGING ---
  public static recordAudit(entry: Omit<AdminAuditRecord, 'id' | 'timestamp'>): void {
    try {
      const logs = this.load<AdminAuditRecord[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
      const newRecord: AdminAuditRecord = {
        ...entry,
        id: `AUDIT_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
      };
      logs.unshift(newRecord);
      this.save(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 200));
    } catch (e) {
      console.error('Audit logging failed', e);
    }
  }

  public static getAuditLogs(currentUser: AdminUser): AdminAuditRecord[] {
    if (!this.hasPermission(currentUser, 'VIEW_AUDIT_LOGS') && currentUser.role !== 'SUPER_ADMIN') {
      return [];
    }
    return this.load<AdminAuditRecord[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  // --- ADMIN MANAGEMENT (SUPER ADMIN) ---
  public static getAdmins(currentUser: AdminUser): AdminUser[] {
    if (currentUser.role !== 'SUPER_ADMIN' && !this.hasPermission(currentUser, 'MANAGE_ADMINS')) {
      throw new Error('403 Forbidden: Insufficient clearance to view administrator directory.');
    }
    return this.load<AdminUser[]>(STORAGE_KEYS.ADMINS, INITIAL_ADMINS);
  }

  public static createAdmin(
    currentUser: AdminUser,
    data: {
      name: string;
      email: string;
      password: string;
      role: AdminRole;
      hotelId?: string;
      agencyId?: string;
      permissions: AdminPermission[];
    }
  ): { success: boolean; admin?: AdminUser; error?: string } {
    if (currentUser.role !== 'SUPER_ADMIN') {
      return { success: false, error: '403 Forbidden: Only Super Admin can provision administrative accounts.' };
    }

    const admins = this.load<AdminUser[]>(STORAGE_KEYS.ADMINS, INITIAL_ADMINS);
    if (admins.some((a) => a.email.toLowerCase() === data.email.trim().toLowerCase())) {
      return { success: false, error: 'An administrator account with this email address already exists.' };
    }

    let hotelName: string | undefined;
    if (data.hotelId) {
      const hotels = this.getHotels(currentUser);
      hotelName = hotels.find((h) => h.id === data.hotelId)?.name;
    }

    let agencyName: string | undefined;
    if (data.agencyId) {
      const agencies = this.getAgencies(currentUser);
      agencyName = agencies.find((a) => a.id === data.agencyId)?.name;
    }

    const newAdmin: AdminUser = {
      id: `ADMIN_${data.role}_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password.trim(),
      role: data.role,
      status: 'ACTIVE',
      hotelId: data.hotelId,
      hotelName,
      agencyId: data.agencyId,
      agencyName,
      permissions: data.permissions,
      createdAt: new Date().toISOString(),
      createdById: currentUser.id,
    };

    admins.push(newAdmin);
    this.save(STORAGE_KEYS.ADMINS, admins);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'CREATE_ADMIN',
      targetType: 'ADMIN',
      targetId: newAdmin.id,
      details: `Provisioned ${newAdmin.role} account for ${newAdmin.name} (${newAdmin.email})`,
      result: 'SUCCESS',
    });

    return { success: true, admin: newAdmin };
  }

  public static updateAdmin(
    currentUser: AdminUser,
    adminId: string,
    updates: Partial<Pick<AdminUser, 'name' | 'email' | 'password' | 'status' | 'permissions' | 'hotelId' | 'agencyId'>>
  ): { success: boolean; admin?: AdminUser; error?: string } {
    if (currentUser.role !== 'SUPER_ADMIN') {
      return { success: false, error: '403 Forbidden: Only Super Admin can modify administrative accounts.' };
    }

    const admins = this.load<AdminUser[]>(STORAGE_KEYS.ADMINS, INITIAL_ADMINS);
    const index = admins.findIndex((a) => a.id === adminId);
    if (index === -1) return { success: false, error: 'Administrator not found.' };

    const target = admins[index];
    const updated: AdminUser = {
      ...target,
      ...updates,
    };

    admins[index] = updated;
    this.save(STORAGE_KEYS.ADMINS, admins);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'UPDATE_ADMIN',
      targetType: 'ADMIN',
      targetId: adminId,
      details: `Modified credentials or permissions for ${updated.name} (${updated.email})`,
      result: 'SUCCESS',
    });

    return { success: true, admin: updated };
  }

  public static toggleAdminStatus(currentUser: AdminUser, adminId: string, status: AdminStatus): boolean {
    if (currentUser.role !== 'SUPER_ADMIN') return false;
    const res = this.updateAdmin(currentUser, adminId, { status });
    return res.success;
  }

  // --- HOTEL MANAGEMENT (SUPER ADMIN + HOTEL ADMIN) ---
  public static getHotels(currentUser: AdminUser): HotelPartner[] {
    const hotels = this.load<HotelPartner[]>(STORAGE_KEYS.HOTELS, INITIAL_HOTELS);
    if (currentUser.role === 'HOTEL_ADMIN') {
      return hotels.filter((h) => h.id === currentUser.hotelId);
    }
    return hotels;
  }

  public static getHotelById(currentUser: AdminUser, hotelId: string): HotelPartner | null {
    if (currentUser.role === 'HOTEL_ADMIN' && currentUser.hotelId !== hotelId) {
      throw new Error('403 Forbidden: Tenant isolation breach. Cannot access foreign hotel.');
    }
    const hotels = this.getHotels(currentUser);
    return hotels.find((h) => h.id === hotelId) || null;
  }

  public static addHotel(
    currentUser: AdminUser,
    data: Omit<HotelPartner, 'id' | 'createdAt'>
  ): { success: boolean; hotel?: HotelPartner; error?: string } {
    if (currentUser.role !== 'SUPER_ADMIN' && !this.hasPermission(currentUser, 'MANAGE_HOTELS')) {
      return { success: false, error: '403 Forbidden: Insufficient permission to register new sanctuary hotel.' };
    }

    const hotels = this.load<HotelPartner[]>(STORAGE_KEYS.HOTELS, INITIAL_HOTELS);
    const newHotel: HotelPartner = {
      ...data,
      id: `HOTEL_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    hotels.push(newHotel);
    this.save(STORAGE_KEYS.HOTELS, hotels);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'ADD_HOTEL',
      targetType: 'HOTEL',
      targetId: newHotel.id,
      details: `Added new partner hotel: ${newHotel.name} in ${newHotel.city}`,
      result: 'SUCCESS',
    });

    return { success: true, hotel: newHotel };
  }

  public static updateHotel(currentUser: AdminUser, hotelId: string, updates: Partial<HotelPartner>): boolean {
    if (!this.verifyTenantAccess(currentUser, { hotelId }) && currentUser.role !== 'SUPER_ADMIN') {
      return false;
    }
    const hotels = this.load<HotelPartner[]>(STORAGE_KEYS.HOTELS, INITIAL_HOTELS);
    const index = hotels.findIndex((h) => h.id === hotelId);
    if (index === -1) return false;

    hotels[index] = { ...hotels[index], ...updates };
    this.save(STORAGE_KEYS.HOTELS, hotels);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'UPDATE_HOTEL',
      targetType: 'HOTEL',
      targetId: hotelId,
      details: `Updated hotel metadata for ${hotels[index].name}`,
      result: 'SUCCESS',
    });

    return true;
  }

  // --- ROOM MANAGEMENT ---
  public static getRooms(currentUser: AdminUser, hotelId?: string): HotelRoom[] {
    const rooms = this.load<HotelRoom[]>(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
    if (currentUser.role === 'HOTEL_ADMIN') {
      return rooms.filter((r) => r.hotelId === currentUser.hotelId);
    }
    if (hotelId) {
      return rooms.filter((r) => r.hotelId === hotelId);
    }
    return rooms;
  }

  public static addRoom(currentUser: AdminUser, roomData: Omit<HotelRoom, 'id'>): { success: boolean; room?: HotelRoom; error?: string } {
    if (!this.verifyTenantAccess(currentUser, { hotelId: roomData.hotelId })) {
      return { success: false, error: '403 Forbidden: Cannot add room to a foreign hotel.' };
    }

    const rooms = this.load<HotelRoom[]>(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
    if (rooms.some((r) => r.hotelId === roomData.hotelId && r.roomNumber === roomData.roomNumber)) {
      return { success: false, error: `Room ${roomData.roomNumber} already exists in this hotel.` };
    }

    const newRoom: HotelRoom = {
      ...roomData,
      id: `ROOM_${Date.now()}`,
    };

    rooms.push(newRoom);
    this.save(STORAGE_KEYS.ROOMS, rooms);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'ADD_ROOM',
      targetType: 'ROOM',
      targetId: newRoom.id,
      details: `Added Room ${newRoom.roomNumber} (${newRoom.roomType}) to ${roomData.hotelId}`,
      result: 'SUCCESS',
    });

    return { success: true, room: newRoom };
  }

  public static updateRoomStatus(currentUser: AdminUser, roomId: string, status: HotelRoom['status']): boolean {
    const rooms = this.load<HotelRoom[]>(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return false;

    if (!this.verifyTenantAccess(currentUser, { hotelId: room.hotelId })) {
      return false;
    }

    room.status = status;
    this.save(STORAGE_KEYS.ROOMS, rooms);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'UPDATE_ROOM_STATUS',
      targetType: 'ROOM',
      targetId: roomId,
      details: `Updated Room ${room.roomNumber} status to ${status}`,
      result: 'SUCCESS',
    });

    return true;
  }

  // --- TRAVEL AGENCY MANAGEMENT ---
  public static getAgencies(currentUser: AdminUser): TravelAgencyPartner[] {
    const agencies = this.load<TravelAgencyPartner[]>(STORAGE_KEYS.AGENCIES, INITIAL_AGENCIES);
    if (currentUser.role === 'AGENCY_ADMIN') {
      return agencies.filter((a) => a.id === currentUser.agencyId);
    }
    return agencies;
  }

  public static addAgency(currentUser: AdminUser, data: Omit<TravelAgencyPartner, 'id' | 'createdAt'>): { success: boolean; agency?: TravelAgencyPartner; error?: string } {
    if (currentUser.role !== 'SUPER_ADMIN' && !this.hasPermission(currentUser, 'MANAGE_AGENCIES')) {
      return { success: false, error: '403 Forbidden: Insufficient clearance to add travel agency partner.' };
    }

    const agencies = this.load<TravelAgencyPartner[]>(STORAGE_KEYS.AGENCIES, INITIAL_AGENCIES);
    const newAgency: TravelAgencyPartner = {
      ...data,
      id: `AGENCY_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    agencies.push(newAgency);
    this.save(STORAGE_KEYS.AGENCIES, agencies);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'ADD_AGENCY',
      targetType: 'AGENCY',
      targetId: newAgency.id,
      details: `Registered travel agency partner: ${newAgency.name} in ${newAgency.city}`,
      result: 'SUCCESS',
    });

    return { success: true, agency: newAgency };
  }

  // --- VEHICLE & DRIVER FLEET MANAGEMENT ---
  public static getVehicles(currentUser: AdminUser, agencyId?: string): AgencyVehicle[] {
    const vehicles = this.load<AgencyVehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    if (currentUser.role === 'AGENCY_ADMIN') {
      return vehicles.filter((v) => v.agencyId === currentUser.agencyId);
    }
    if (agencyId) {
      return vehicles.filter((v) => v.agencyId === agencyId);
    }
    return vehicles;
  }

  public static addVehicle(currentUser: AdminUser, data: Omit<AgencyVehicle, 'id' | 'createdAt'>): { success: boolean; vehicle?: AgencyVehicle; error?: string } {
    if (!this.verifyTenantAccess(currentUser, { agencyId: data.agencyId })) {
      return { success: false, error: '403 Forbidden: Cannot add vehicle to a foreign travel agency.' };
    }

    const vehicles = this.load<AgencyVehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    if (vehicles.some((v) => v.registrationNumber.toUpperCase() === data.registrationNumber.toUpperCase())) {
      return { success: false, error: `Vehicle with registration ${data.registrationNumber} already registered in platform.` };
    }

    const newVehicle: AgencyVehicle = {
      ...data,
      id: `VEH_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    vehicles.push(newVehicle);
    this.save(STORAGE_KEYS.VEHICLES, vehicles);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'ADD_VEHICLE',
      targetType: 'VEHICLE',
      targetId: newVehicle.id,
      details: `Added ${newVehicle.model} (${newVehicle.registrationNumber}) to ${data.agencyName}`,
      result: 'SUCCESS',
    });

    return { success: true, vehicle: newVehicle };
  }

  public static updateVehicleStatus(currentUser: AdminUser, vehicleId: string, status: AgencyVehicle['status']): boolean {
    const vehicles = this.load<AgencyVehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return false;

    if (!this.verifyTenantAccess(currentUser, { agencyId: vehicle.agencyId })) {
      return false;
    }

    vehicle.status = status;
    this.save(STORAGE_KEYS.VEHICLES, vehicles);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'UPDATE_VEHICLE_STATUS',
      targetType: 'VEHICLE',
      targetId: vehicleId,
      details: `Updated vehicle ${vehicle.registrationNumber} status to ${status}`,
      result: 'SUCCESS',
    });

    return true;
  }

  public static getDrivers(currentUser: AdminUser, agencyId?: string): AgencyDriver[] {
    const drivers = this.load<AgencyDriver[]>(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
    if (currentUser.role === 'AGENCY_ADMIN') {
      return drivers.filter((d) => d.agencyId === currentUser.agencyId);
    }
    if (agencyId) {
      return drivers.filter((d) => d.agencyId === agencyId);
    }
    return drivers;
  }

  public static addDriver(currentUser: AdminUser, data: Omit<AgencyDriver, 'id' | 'createdAt'>): { success: boolean; driver?: AgencyDriver; error?: string } {
    if (!this.verifyTenantAccess(currentUser, { agencyId: data.agencyId })) {
      return { success: false, error: '403 Forbidden: Cannot add driver to a foreign agency.' };
    }

    const drivers = this.load<AgencyDriver[]>(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
    const newDriver: AgencyDriver = {
      ...data,
      id: `DRV_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    drivers.push(newDriver);
    this.save(STORAGE_KEYS.DRIVERS, drivers);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'ADD_DRIVER',
      targetType: 'DRIVER',
      targetId: newDriver.id,
      details: `Added driver ${newDriver.name} (${newDriver.phone}) to ${data.agencyName}`,
      result: 'SUCCESS',
    });

    return { success: true, driver: newDriver };
  }

  // --- BOOKINGS & TENANT ISOLATION ---
  public static getBookings(
    currentUser: AdminUser,
    filters?: {
      status?: PartnerBookingStatus;
      search?: string;
      startDate?: string;
      endDate?: string;
    }
  ): AdminBookingRecord[] {
    let bookings = this.load<AdminBookingRecord[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);

    // Multi-tenant boundary enforcement
    if (currentUser.role === 'HOTEL_ADMIN') {
      bookings = bookings.filter((b) => b.hotelId === currentUser.hotelId);
    } else if (currentUser.role === 'AGENCY_ADMIN') {
      bookings = bookings.filter((b) => b.agencyId === currentUser.agencyId);
    } else if (currentUser.role === 'SUB_ADMIN') {
      if (!this.hasPermission(currentUser, 'VIEW_BOOKINGS')) {
        throw new Error('403 Forbidden: Sub Admin lacks VIEW_BOOKINGS clearance.');
      }
    }

    if (filters?.status) {
      bookings = bookings.filter((b) => b.bookingStatus === filters.status);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      bookings = bookings.filter(
        (b) =>
          b.customerName.toLowerCase().includes(q) ||
          b.customerEmail.toLowerCase().includes(q) ||
          b.customerPhone.includes(q) ||
          b.bookingCode.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q) ||
          (b.hotelName && b.hotelName.toLowerCase().includes(q)) ||
          (b.vehicleModel && b.vehicleModel.toLowerCase().includes(q))
      );
    }

    return bookings;
  }

  public static updateBookingStatus(
    currentUser: AdminUser,
    bookingId: string,
    newStatus: PartnerBookingStatus,
    reason?: string
  ): { success: boolean; booking?: AdminBookingRecord; error?: string } {
    const bookings = this.load<AdminBookingRecord[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    if (!this.verifyTenantAccess(currentUser, { hotelId: booking.hotelId, agencyId: booking.agencyId })) {
      this.recordAudit({
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorEmail: currentUser.email,
        actorRole: currentUser.role,
        action: 'UNAUTHORIZED_BOOKING_UPDATE_ATTEMPT',
        targetType: 'BOOKING',
        targetId: bookingId,
        details: `Rejected attempt by ${currentUser.role} to modify foreign booking ${bookingId}`,
        result: 'DENIED',
      });
      return { success: false, error: '403 Forbidden: Cross-tenant data modification prohibited.' };
    }

    const previousStatus = booking.bookingStatus;
    booking.bookingStatus = newStatus;
    booking.updatedAt = new Date().toISOString();
    if (reason) booking.cancellationReason = reason;

    if (newStatus === 'CONFIRMED' && booking.paymentStatus === 'PENDING') {
      booking.paymentStatus = 'PAID';
    } else if (newStatus === 'CANCELLED' && booking.paymentStatus === 'PAID') {
      booking.paymentStatus = 'REFUNDED';
    }

    this.save(STORAGE_KEYS.BOOKINGS, bookings);

    // Synchronize to customer app state via eventBus
    if (newStatus === 'CONFIRMED') {
      eventBus.emit({
        type: 'BOOKING_CONFIRMED',
        payload: { bookingId: booking.id, transitId: booking.bookingCode, total: booking.totalPrice },
      });
    } else if (newStatus === 'CANCELLED') {
      eventBus.emit({
        type: 'BOOKING_CANCELLED',
        payload: { bookingId: booking.id, reason: reason || 'Partner Admin updated status' },
      });
    }

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: `BOOKING_STATUS_${newStatus}`,
      targetType: 'BOOKING',
      targetId: bookingId,
      details: `Transitioned booking ${booking.bookingCode} from ${previousStatus} to ${newStatus}. Note: ${reason || 'Direct partner action'}`,
      result: 'SUCCESS',
    });

    return { success: true, booking };
  }

  // --- DELETION OPERATIONS (PERSISTENT WITH AUDIT LOGGING) ---

  public static deleteAdmin(
    currentUser: AdminUser,
    adminId: string
  ): { success: boolean; error?: string } {
    if (currentUser.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Only Super Admins can remove administrators.' };
    }
    if (currentUser.id === adminId) {
      return { success: false, error: 'You cannot delete your own active administrator account.' };
    }

    const admins = this.load<AdminUser[]>(STORAGE_KEYS.ADMINS, INITIAL_ADMINS);
    const target = admins.find((a) => a.id === adminId);
    if (!target) return { success: false, error: 'Administrator not found.' };

    const filtered = admins.filter((a) => a.id !== adminId);
    this.save(STORAGE_KEYS.ADMINS, filtered);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'DELETE_ADMIN',
      targetType: 'ADMIN',
      targetId: adminId,
      details: `Removed administrator ${target.name} (${target.email})`,
      result: 'SUCCESS',
    });

    return { success: true };
  }

  public static deleteHotel(
    currentUser: AdminUser,
    hotelId: string
  ): { success: boolean; error?: string } {
    if (currentUser.role !== 'SUPER_ADMIN' && !this.hasPermission(currentUser, 'MANAGE_HOTELS')) {
      return { success: false, error: 'Only Super Admins or authorized managers can delete hotels.' };
    }

    const hotels = this.load<HotelPartner[]>(STORAGE_KEYS.HOTELS, INITIAL_HOTELS);
    const target = hotels.find((h) => h.id === hotelId);
    if (!target) return { success: false, error: 'Hotel not found.' };

    const filteredHotels = hotels.filter((h) => h.id !== hotelId);
    this.save(STORAGE_KEYS.HOTELS, filteredHotels);

    // Also clean up associated rooms
    const rooms = this.load<HotelRoom[]>(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
    const filteredRooms = rooms.filter((r) => r.hotelId !== hotelId);
    this.save(STORAGE_KEYS.ROOMS, filteredRooms);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'DELETE_HOTEL',
      targetType: 'HOTEL',
      targetId: hotelId,
      details: `Deleted hotel partner ${target.name} and removed associated room inventory`,
      result: 'SUCCESS',
    });

    return { success: true };
  }

  public static deleteAgency(
    currentUser: AdminUser,
    agencyId: string
  ): { success: boolean; error?: string } {
    if (currentUser.role !== 'SUPER_ADMIN' && !this.hasPermission(currentUser, 'MANAGE_AGENCIES')) {
      return { success: false, error: 'Only Super Admins can delete travel agency partners.' };
    }

    const agencies = this.load<TravelAgencyPartner[]>(STORAGE_KEYS.AGENCIES, INITIAL_AGENCIES);
    const target = agencies.find((a) => a.id === agencyId);
    if (!target) return { success: false, error: 'Travel agency not found.' };

    const filteredAgencies = agencies.filter((a) => a.id !== agencyId);
    this.save(STORAGE_KEYS.AGENCIES, filteredAgencies);

    // Clean up associated vehicles & drivers
    const vehicles = this.load<AgencyVehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    this.save(STORAGE_KEYS.VEHICLES, vehicles.filter((v) => v.agencyId !== agencyId));

    const drivers = this.load<AgencyDriver[]>(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
    this.save(STORAGE_KEYS.DRIVERS, drivers.filter((d) => d.agencyId !== agencyId));

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'DELETE_AGENCY',
      targetType: 'AGENCY',
      targetId: agencyId,
      details: `Deleted travel agency ${target.name} and related fleet records`,
      result: 'SUCCESS',
    });

    return { success: true };
  }

  public static deleteVehicle(
    currentUser: AdminUser,
    vehicleId: string
  ): { success: boolean; error?: string } {
    const vehicles = this.load<AgencyVehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    const target = vehicles.find((v) => v.id === vehicleId);
    if (!target) return { success: false, error: 'Vehicle not found.' };

    if (!this.verifyTenantAccess(currentUser, { agencyId: target.agencyId })) {
      return { success: false, error: 'Cannot delete vehicle belonging to another agency.' };
    }

    const filtered = vehicles.filter((v) => v.id !== vehicleId);
    this.save(STORAGE_KEYS.VEHICLES, filtered);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'DELETE_VEHICLE',
      targetType: 'VEHICLE',
      targetId: vehicleId,
      details: `Removed vehicle ${target.model} (${target.registrationNumber})`,
      result: 'SUCCESS',
    });

    return { success: true };
  }

  public static deleteDriver(
    currentUser: AdminUser,
    driverId: string
  ): { success: boolean; error?: string } {
    const drivers = this.load<AgencyDriver[]>(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
    const target = drivers.find((d) => d.id === driverId);
    if (!target) return { success: false, error: 'Driver not found.' };

    if (!this.verifyTenantAccess(currentUser, { agencyId: target.agencyId })) {
      return { success: false, error: 'Cannot delete driver from another agency.' };
    }

    const filtered = drivers.filter((d) => d.id !== driverId);
    this.save(STORAGE_KEYS.DRIVERS, filtered);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'DELETE_DRIVER',
      targetType: 'DRIVER',
      targetId: driverId,
      details: `Removed driver ${target.name} (${target.phone})`,
      result: 'SUCCESS',
    });

    return { success: true };
  }

  public static deleteRoom(
    currentUser: AdminUser,
    roomId: string
  ): { success: boolean; error?: string } {
    const rooms = this.load<HotelRoom[]>(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
    const target = rooms.find((r) => r.id === roomId);
    if (!target) return { success: false, error: 'Room not found.' };

    if (!this.verifyTenantAccess(currentUser, { hotelId: target.hotelId })) {
      return { success: false, error: 'Cannot delete room from another hotel.' };
    }

    const filtered = rooms.filter((r) => r.id !== roomId);
    this.save(STORAGE_KEYS.ROOMS, filtered);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'DELETE_ROOM',
      targetType: 'ROOM',
      targetId: roomId,
      details: `Removed Room ${target.roomNumber} (${target.roomType})`,
      result: 'SUCCESS',
    });

    return { success: true };
  }

  public static deleteBooking(
    currentUser: AdminUser,
    bookingId: string
  ): { success: boolean; error?: string } {
    const bookings = this.load<AdminBookingRecord[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return { success: false, error: 'Booking not found.' };

    if (!this.verifyTenantAccess(currentUser, { hotelId: target.hotelId, agencyId: target.agencyId })) {
      return { success: false, error: 'Cannot delete booking from another partner.' };
    }

    const filtered = bookings.filter((b) => b.id !== bookingId);
    this.save(STORAGE_KEYS.BOOKINGS, filtered);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'DELETE_BOOKING',
      targetType: 'BOOKING',
      targetId: bookingId,
      details: `Deleted booking record ${target.bookingCode} for ${target.customerName}`,
      result: 'SUCCESS',
    });

    return { success: true };
  }

  public static deleteCustomer(
    currentUser: AdminUser,
    customerId: string
  ): { success: boolean; error?: string } {
    if (currentUser.role !== 'SUPER_ADMIN' && !this.hasPermission(currentUser, 'MANAGE_CUSTOMERS')) {
      return { success: false, error: 'Only Super Admins can remove customer records.' };
    }

    const customers = this.load<AdminCustomerProfile[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const target = customers.find((c) => c.id === customerId);
    if (!target) return { success: false, error: 'Customer not found.' };

    const filtered = customers.filter((c) => c.id !== customerId);
    this.save(STORAGE_KEYS.CUSTOMERS, filtered);

    this.recordAudit({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'DELETE_CUSTOMER',
      targetType: 'CUSTOMER',
      targetId: customerId,
      details: `Removed customer profile ${target.name} (${target.email})`,
      result: 'SUCCESS',
    });

    return { success: true };
  }

  // --- CUSTOMER & CUSTOMER HISTORY ---
  public static getCustomers(currentUser: AdminUser, search?: string): AdminCustomerProfile[] {
    const customers = this.load<AdminCustomerProfile[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const bookings = this.getBookings(currentUser);

    let accessibleCustomers: AdminCustomerProfile[];

    if (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'SUB_ADMIN') {
      accessibleCustomers = customers;
    } else if (currentUser.role === 'HOTEL_ADMIN') {
      const customerIdsAtHotel = new Set(bookings.map((b) => b.customerId));
      accessibleCustomers = customers.filter((c) => customerIdsAtHotel.has(c.id));
    } else if (currentUser.role === 'AGENCY_ADMIN') {
      const customerIdsAtAgency = new Set(bookings.map((b) => b.customerId));
      accessibleCustomers = customers.filter((c) => customerIdsAtAgency.has(c.id));
    } else {
      return [];
    }

    if (search) {
      const q = search.toLowerCase().trim();
      accessibleCustomers = accessibleCustomers.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
      );
    }

    return accessibleCustomers;
  }

  public static getCustomerHistory(currentUser: AdminUser, customerId: string): { customer: AdminCustomerProfile | null; bookings: AdminBookingRecord[] } {
    const customers = this.load<AdminCustomerProfile[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const customer = customers.find((c) => c.id === customerId) || null;

    // Filter bookings strictly based on tenant clearance
    const bookings = this.getBookings(currentUser).filter((b) => b.customerId === customerId);

    return { customer, bookings };
  }

  // --- REVENUE & FINANCIAL REPORTS (Database-calculated) ---
  public static calculateRevenue(currentUser: AdminUser): {
    grossRevenue: number;
    refunds: number;
    netRevenue: number;
    currency: string;
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    repeatCustomerRate: number;
    popularDestinations: Array<{ name: string; bookings: number; revenue: number }>;
  } {
    const bookings = this.getBookings(currentUser);

    let grossRevenue = 0;
    let refunds = 0;
    let confirmedCount = 0;
    let pendingCount = 0;
    let cancelledCount = 0;

    const customerBookingCounts: Record<string, number> = {};
    const destMap: Record<string, { bookings: number; revenue: number }> = {};

    bookings.forEach((b) => {
      customerBookingCounts[b.customerId] = (customerBookingCounts[b.customerId] || 0) + 1;

      const dest = b.destination || b.hotelName || 'General Route';
      if (!destMap[dest]) destMap[dest] = { bookings: 0, revenue: 0 };
      destMap[dest].bookings += 1;

      if (b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'CHECKED_IN' || b.bookingStatus === 'CHECKED_OUT') {
        grossRevenue += b.totalPrice;
        destMap[dest].revenue += b.totalPrice;
        confirmedCount++;
      } else if (b.bookingStatus === 'PENDING') {
        pendingCount++;
      } else if (b.bookingStatus === 'CANCELLED') {
        cancelledCount++;
        if (b.paymentStatus === 'REFUNDED') {
          refunds += b.totalPrice;
        }
      }
    });

    const netRevenue = Math.max(0, grossRevenue - refunds);

    const totalUniqueCustomers = Object.keys(customerBookingCounts).length;
    const repeatCustomers = Object.values(customerBookingCounts).filter((cnt) => cnt > 1).length;
    const repeatCustomerRate = totalUniqueCustomers > 0 ? Math.round((repeatCustomers / totalUniqueCustomers) * 100) : 0;

    const popularDestinations = Object.entries(destMap)
      .map(([name, data]) => ({ name, bookings: data.bookings, revenue: data.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      grossRevenue,
      refunds,
      netRevenue,
      currency: '₹',
      totalBookings: bookings.length,
      confirmedBookings: confirmedCount,
      pendingBookings: pendingCount,
      cancelledBookings: cancelledCount,
      repeatCustomerRate,
      popularDestinations,
    };
  }

  // --- CONNECT WITH CUSTOMER BOOKINGS IN REAL TIME ---
  public static ingestCustomerBooking(
    customer: { name: string; email: string; phone: string },
    bookingDetails: {
      tripId: string;
      origin: string;
      destination: string;
      hotel?: any;
      vehicle?: any;
      pricing: { total: number; baseCost: number; taxes: number; serviceFee: number; currency: string };
      checkInDate?: string;
      checkOutDate?: string;
    }
  ): AdminBookingRecord {
    this.init();
    const bookings = this.load<AdminBookingRecord[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const customers = this.load<AdminCustomerProfile[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);

    // Find or create customer
    let customerRecord = customers.find((c) => c.email.toLowerCase() === customer.email.toLowerCase());
    if (!customerRecord) {
      customerRecord = {
        id: `CUST_${Date.now()}`,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        city: bookingDetails.origin || 'India',
        createdAt: new Date().toISOString(),
        totalBookings: 1,
        totalSpent: bookingDetails.pricing.total,
        currency: bookingDetails.pricing.currency || '₹',
        status: 'ACTIVE',
      };
      customers.push(customerRecord);
    } else {
      customerRecord.totalBookings += 1;
      customerRecord.totalSpent += bookingDetails.pricing.total;
    }
    this.save(STORAGE_KEYS.CUSTOMERS, customers);

    // Find matching hotel
    const hotels = this.load<HotelPartner[]>(STORAGE_KEYS.HOTELS, INITIAL_HOTELS);
    let matchedHotel = hotels.find((h) => bookingDetails.hotel?.name?.toLowerCase().includes(h.name.toLowerCase()) || h.city.toLowerCase() === bookingDetails.destination.toLowerCase());
    if (!matchedHotel && hotels.length > 0) matchedHotel = hotels[0];

    // Find matching agency
    const agencies = this.load<TravelAgencyPartner[]>(STORAGE_KEYS.AGENCIES, INITIAL_AGENCIES);
    let matchedAgency = agencies.find((a) => a.city.toLowerCase() === bookingDetails.destination.toLowerCase());
    if (!matchedAgency && agencies.length > 0) matchedAgency = agencies[0];

    const newBooking: AdminBookingRecord = {
      id: `BK_${Date.now()}`,
      bookingCode: `TG-${Date.now().toString().slice(-6)}`,
      customerId: customerRecord.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      hotelId: matchedHotel?.id,
      hotelName: matchedHotel?.name || bookingDetails.hotel?.name,
      roomType: bookingDetails.hotel?.suiteType || 'Luxury Sanctuary Villa',
      checkInDate: bookingDetails.checkInDate || '2026-09-10',
      checkOutDate: bookingDetails.checkOutDate || '2026-09-14',
      numberOfGuests: 2,
      numberOfRooms: 1,
      agencyId: matchedAgency?.id,
      agencyName: matchedAgency?.name,
      vehicleModel: bookingDetails.vehicle?.name || 'Mercedes-Benz E-Class VIP',
      travelDate: bookingDetails.checkInDate || '2026-09-10',
      origin: bookingDetails.origin,
      destination: bookingDetails.destination,
      basePrice: bookingDetails.pricing.baseCost || Math.round(bookingDetails.pricing.total * 0.85),
      taxes: bookingDetails.pricing.taxes || Math.round(bookingDetails.pricing.total * 0.12),
      serviceFee: bookingDetails.pricing.serviceFee || Math.round(bookingDetails.pricing.total * 0.03),
      discount: 0,
      totalPrice: bookingDetails.pricing.total,
      currency: bookingDetails.pricing.currency || '₹',
      bookingStatus: 'PENDING',
      paymentStatus: 'PAID',
      source: 'CUSTOMER_BOOKING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    this.save(STORAGE_KEYS.BOOKINGS, bookings);

    this.recordAudit({
      actorId: customerRecord.id,
      actorName: customer.name,
      actorEmail: customer.email,
      actorRole: 'CUSTOMER',
      action: 'NEW_RESERVATION_PLACED',
      targetType: 'BOOKING',
      targetId: newBooking.id,
      details: `Customer placed new reservation ${newBooking.bookingCode} for ${newBooking.destination}`,
      result: 'SUCCESS',
    });

    return newBooking;
  }

  // -------------------------------------------------------------
  // PRE-AUTHORIZED PARTNER CREDENTIAL APIS
  // -------------------------------------------------------------

  public static checkPermission(adminUser: AdminUser, permission: AdminPermission): boolean {
    if (!adminUser) return false;
    if (adminUser.role === 'SUPER_ADMIN') return true;
    return (adminUser.permissions || []).includes(permission);
  }

  public static getPreAuthCredentials(adminUser: AdminUser): AdminPreAuthCredential[] {
    this.checkPermission(adminUser, 'MANAGE_ADMINS');
    return this.load<AdminPreAuthCredential[]>(STORAGE_KEYS.PREAUTH_CREDENTIALS, INITIAL_PREAUTH_CREDENTIALS);
  }

  public static generatePartnerCredential(
    adminUser: AdminUser,
    email: string,
    tempPassword: string,
    targetRole: 'HOTEL_ADMIN' | 'AGENCY_ADMIN',
    partnerName: string
  ): AdminPreAuthCredential {
    this.checkPermission(adminUser, 'MANAGE_ADMINS');
    const credentials = this.load<AdminPreAuthCredential[]>(STORAGE_KEYS.PREAUTH_CREDENTIALS, INITIAL_PREAUTH_CREDENTIALS);

    const normalizedEmail = email.trim().toLowerCase();
    const existing = credentials.find((c) => c.email.toLowerCase() === normalizedEmail && c.status === 'ACTIVE_PENDING_REGISTRATION');
    if (existing) {
      throw new Error(`Active pre-authorization already exists for ${email}`);
    }

    const newGrant: AdminPreAuthCredential = {
      id: `AUTH_GRANT_${Date.now()}`,
      email: normalizedEmail,
      tempPassword,
      targetRole,
      partnerName: partnerName.trim(),
      status: 'ACTIVE_PENDING_REGISTRATION',
      createdByAdminId: adminUser.id,
      createdByAdminName: adminUser.name,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    };

    credentials.unshift(newGrant);
    this.save(STORAGE_KEYS.PREAUTH_CREDENTIALS, credentials);

    this.recordAudit({
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorEmail: adminUser.email,
      actorRole: adminUser.role,
      action: 'PREAUTH_CREDENTIAL_GENERATED',
      targetType: 'ADMIN',
      targetId: newGrant.id,
      details: `Admin issued pre-authorization credential for ${partnerName} (${targetRole}, ${normalizedEmail})`,
      result: 'SUCCESS',
    });

    return newGrant;
  }

  public static revokePartnerCredential(adminUser: AdminUser, credentialId: string): void {
    this.checkPermission(adminUser, 'MANAGE_ADMINS');
    const credentials = this.load<AdminPreAuthCredential[]>(STORAGE_KEYS.PREAUTH_CREDENTIALS, INITIAL_PREAUTH_CREDENTIALS);
    const item = credentials.find((c) => c.id === credentialId);
    if (item) {
      item.status = 'REVOKED';
      this.save(STORAGE_KEYS.PREAUTH_CREDENTIALS, credentials);

      this.recordAudit({
        actorId: adminUser.id,
        actorName: adminUser.name,
        actorEmail: adminUser.email,
        actorRole: adminUser.role,
        action: 'PREAUTH_CREDENTIAL_REVOKED',
        targetType: 'ADMIN',
        targetId: item.id,
        details: `Admin revoked pre-authorization credential for ${item.email}`,
        result: 'SUCCESS',
      });
    }
  }

  public static validatePartnerCredential(
    email: string,
    tempPassword: string,
    targetRole: 'HOTEL_ADMIN' | 'AGENCY_ADMIN'
  ): AdminPreAuthCredential | null {
    const credentials = this.load<AdminPreAuthCredential[]>(STORAGE_KEYS.PREAUTH_CREDENTIALS, INITIAL_PREAUTH_CREDENTIALS);
    const normalizedEmail = email.trim().toLowerCase();
    const grant = credentials.find(
      (c) =>
        c.email.toLowerCase() === normalizedEmail &&
        c.tempPassword === tempPassword &&
        c.targetRole === targetRole &&
        c.status === 'ACTIVE_PENDING_REGISTRATION'
    );
    return grant || null;
  }

  public static registerPartnerWithPreAuth(
    email: string,
    tempPassword: string,
    targetRole: 'HOTEL_ADMIN' | 'AGENCY_ADMIN',
    partnerDetails: {
      name: string;
      phone: string;
      address: string;
      city: string;
      contactPerson?: string;
      businessLicenseNumber?: string;
      taxId?: string;
    }
  ): { user: AdminUser; partner: HotelPartner | TravelAgencyPartner } {
    const grant = this.validatePartnerCredential(email, tempPassword, targetRole);
    if (!grant) {
      throw new Error('Invalid or unauthorized registration credentials. Admin authorization is required to register.');
    }

    const admins = this.load<AdminUser[]>(STORAGE_KEYS.ADMINS, INITIAL_ADMINS);
    const normalizedEmail = email.trim().toLowerCase();

    if (admins.some((a) => a.email.toLowerCase() === normalizedEmail)) {
      throw new Error(`An account with email ${email} already exists.`);
    }

    let partner: HotelPartner | TravelAgencyPartner;
    const newUserId = `ADMIN_${targetRole === 'HOTEL_ADMIN' ? 'HOTEL' : 'AGENCY'}_${Date.now()}`;
    const newPartnerId = `${targetRole === 'HOTEL_ADMIN' ? 'HOTEL' : 'AGENCY'}_${Date.now()}`;

    if (targetRole === 'HOTEL_ADMIN') {
      const hotels = this.load<HotelPartner[]>(STORAGE_KEYS.HOTELS, INITIAL_HOTELS);
      const newHotel: HotelPartner = {
        id: newPartnerId,
        name: partnerDetails.name || grant.partnerName,
        city: partnerDetails.city || 'Goa',
        address: partnerDetails.address || 'Beachfront Boulevard',
        phone: partnerDetails.phone || '+91 99000 11223',
        email: normalizedEmail,
        status: 'ACTIVE',
        verificationStatus: 'PENDING_VERIFICATION',
        businessLicenseNumber: partnerDetails.businessLicenseNumber || `LIC-HTL-${Date.now().toString().slice(-6)}`,
        taxId: partnerDetails.taxId || `GST-IN-${Date.now().toString().slice(-6)}`,
        authCredentialId: grant.id,
        assignedAdminId: newUserId,
        assignedAdminEmail: normalizedEmail,
        rating: 4.8,
        roomCount: 10,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        amenities: ['24/7 Room Service', 'High Speed Wi-Fi', 'Swimming Pool', 'Airport Shuttle'],
        createdAt: new Date().toISOString(),
      };
      hotels.unshift(newHotel);
      this.save(STORAGE_KEYS.HOTELS, hotels);
      partner = newHotel;
    } else {
      const agencies = this.load<TravelAgencyPartner[]>(STORAGE_KEYS.AGENCIES, INITIAL_AGENCIES);
      const newAgency: TravelAgencyPartner = {
        id: newPartnerId,
        name: partnerDetails.name || grant.partnerName,
        contactPerson: partnerDetails.contactPerson || 'Lead Operations Officer',
        city: partnerDetails.city || 'Hyderabad',
        address: partnerDetails.address || 'Tech Park Expressway',
        phone: partnerDetails.phone || '+91 99888 77665',
        email: normalizedEmail,
        status: 'ACTIVE',
        verificationStatus: 'PENDING_VERIFICATION',
        businessLicenseNumber: partnerDetails.businessLicenseNumber || `LIC-AGY-${Date.now().toString().slice(-6)}`,
        taxId: partnerDetails.taxId || `GST-AGY-${Date.now().toString().slice(-6)}`,
        authCredentialId: grant.id,
        assignedAdminId: newUserId,
        assignedAdminEmail: normalizedEmail,
        vehicleCount: 5,
        driverCount: 5,
        rating: 4.7,
        createdAt: new Date().toISOString(),
      };
      agencies.unshift(newAgency);
      this.save(STORAGE_KEYS.AGENCIES, agencies);
      partner = newAgency;
    }

    const newUser: AdminUser = {
      id: newUserId,
      name: partnerDetails.contactPerson || partnerDetails.name || grant.partnerName,
      email: normalizedEmail,
      password: tempPassword,
      role: targetRole,
      status: 'ACTIVE',
      hotelId: targetRole === 'HOTEL_ADMIN' ? newPartnerId : undefined,
      hotelName: targetRole === 'HOTEL_ADMIN' ? partner.name : undefined,
      agencyId: targetRole === 'AGENCY_ADMIN' ? newPartnerId : undefined,
      agencyName: targetRole === 'AGENCY_ADMIN' ? partner.name : undefined,
      permissions:
        targetRole === 'HOTEL_ADMIN'
          ? ['VIEW_CUSTOMERS', 'VIEW_BOOKINGS', 'MANAGE_BOOKINGS', 'VIEW_HOTELS', 'MANAGE_HOTELS', 'VIEW_REVENUE']
          : ['VIEW_CUSTOMERS', 'VIEW_BOOKINGS', 'MANAGE_BOOKINGS', 'VIEW_AGENCIES', 'MANAGE_AGENCIES', 'VIEW_VEHICLES', 'MANAGE_VEHICLES', 'VIEW_REVENUE'],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    admins.push(newUser);
    this.save(STORAGE_KEYS.ADMINS, admins);

    // Update grant status
    const credentials = this.load<AdminPreAuthCredential[]>(STORAGE_KEYS.PREAUTH_CREDENTIALS, INITIAL_PREAUTH_CREDENTIALS);
    const targetGrant = credentials.find((c) => c.id === grant.id);
    if (targetGrant) {
      targetGrant.status = 'USED';
      targetGrant.usedAt = new Date().toISOString();
      targetGrant.usedByPartnerId = newPartnerId;
      this.save(STORAGE_KEYS.PREAUTH_CREDENTIALS, credentials);
    }

    this.recordAudit({
      actorId: newUser.id,
      actorName: newUser.name,
      actorEmail: newUser.email,
      actorRole: targetRole,
      action: 'PARTNER_REGISTERED_WITH_PREAUTH',
      targetType: targetRole === 'HOTEL_ADMIN' ? 'HOTEL' : 'AGENCY',
      targetId: partner.id,
      details: `${targetRole} registered successfully using Admin Pre-Auth credential ${grant.id}`,
      result: 'SUCCESS',
    });

    return { user: newUser, partner };
  }

  // -------------------------------------------------------------
  // STAY PERMISSION & GUEST VERIFICATION APIS
  // -------------------------------------------------------------

  public static getStayPermissions(currentUser: AdminUser): StayPermission[] {
    const list = this.load<StayPermission[]>(STORAGE_KEYS.STAY_PERMISSIONS, INITIAL_STAY_PERMISSIONS);
    if (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'SUB_ADMIN') {
      return list;
    }
    if (currentUser.role === 'HOTEL_ADMIN' && currentUser.hotelId) {
      return list.filter((item) => item.hotelId === currentUser.hotelId);
    }
    if (currentUser.role === 'AGENCY_ADMIN' && currentUser.agencyId) {
      return list.filter((item) => item.agencyId === currentUser.agencyId);
    }
    return list;
  }

  public static createStayPermissionRequest(
    actor: { id: string; name: string; email: string; agencyId?: string; agencyName?: string },
    data: Partial<StayPermission>
  ): StayPermission {
    const list = this.load<StayPermission[]>(STORAGE_KEYS.STAY_PERMISSIONS, INITIAL_STAY_PERMISSIONS);

    const newPerm: StayPermission = {
      id: `STAY_PERM_${Date.now()}`,
      stayPassCode: `STAY-${(data.hotelName || 'TG').slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: data.bookingId || `BK_${Date.now()}`,
      guestName: data.guestName || 'Guest Traveler',
      guestEmail: data.guestEmail || actor.email,
      guestPhone: data.guestPhone || '+91 98000 00000',
      idProofType: data.idProofType || 'Aadhaar',
      idProofNumber: data.idProofNumber || `ID-${Date.now().toString().slice(-8)}`,
      hotelId: data.hotelId || 'HOTEL_001',
      hotelName: data.hotelName || 'Grand Goa Luxury Resort & Spa',
      roomId: data.roomId,
      roomNumber: data.roomNumber,
      roomType: data.roomType || 'Standard Deluxe',
      agencyId: actor.agencyId || data.agencyId,
      agencyName: actor.agencyName || data.agencyName,
      checkInDate: data.checkInDate || new Date().toISOString().split('T')[0],
      checkOutDate: data.checkOutDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      stayDurationNights: data.stayDurationNights || 3,
      permissionStatus: 'PENDING_APPROVAL',
      verificationStatus: 'PENDING_VERIFICATION',
      specialInstructions: data.specialInstructions,
      createdAt: new Date().toISOString(),
    };

    list.unshift(newPerm);
    this.save(STORAGE_KEYS.STAY_PERMISSIONS, list);

    this.recordAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: 'AGENCY_ADMIN',
      action: 'STAY_PERMISSION_REQUESTED',
      targetType: 'ROOM',
      targetId: newPerm.id,
      details: `Stay Permission requested for guest ${newPerm.guestName} at ${newPerm.hotelName}`,
      result: 'SUCCESS',
    });

    return newPerm;
  }

  public static grantStayPermission(
    hotelUser: AdminUser,
    stayPermissionId: string,
    roomId?: string,
    roomNumber?: string
  ): StayPermission {
    this.checkPermission(hotelUser, 'MANAGE_BOOKINGS');
    const list = this.load<StayPermission[]>(STORAGE_KEYS.STAY_PERMISSIONS, INITIAL_STAY_PERMISSIONS);
    const perm = list.find((s) => s.id === stayPermissionId);

    if (!perm) {
      throw new Error(`Stay permission ${stayPermissionId} not found`);
    }

    perm.permissionStatus = 'GRANTED';
    perm.verificationStatus = 'VERIFIED_VALID';
    perm.grantedAt = new Date().toISOString();
    perm.verifiedByStaffId = hotelUser.id;
    perm.verifiedByStaffName = hotelUser.name;
    if (roomId) perm.roomId = roomId;
    if (roomNumber) perm.roomNumber = roomNumber;

    this.save(STORAGE_KEYS.STAY_PERMISSIONS, list);

    if (roomId) {
      const rooms = this.load<HotelRoom[]>(STORAGE_KEYS.ROOMS, []);
      const targetRoom = rooms.find((r) => r.id === roomId);
      if (targetRoom) {
        targetRoom.status = 'RESERVED';
        targetRoom.currentBookingId = perm.bookingId;
        this.save(STORAGE_KEYS.ROOMS, rooms);
      }
    }

    this.recordAudit({
      actorId: hotelUser.id,
      actorName: hotelUser.name,
      actorEmail: hotelUser.email,
      actorRole: hotelUser.role,
      action: 'STAY_PERMISSION_GRANTED',
      targetType: 'ROOM',
      targetId: perm.id,
      details: `Hotel granted Stay Permission ${perm.stayPassCode} for guest ${perm.guestName} (Room: ${perm.roomNumber || 'Unassigned'})`,
      result: 'SUCCESS',
    });

    return perm;
  }

  public static processGuestCheckIn(hotelUser: AdminUser, stayPermissionId: string): StayPermission {
    this.checkPermission(hotelUser, 'MANAGE_BOOKINGS');
    const list = this.load<StayPermission[]>(STORAGE_KEYS.STAY_PERMISSIONS, INITIAL_STAY_PERMISSIONS);
    const perm = list.find((s) => s.id === stayPermissionId);

    if (!perm) throw new Error('Stay permission not found');

    perm.permissionStatus = 'CHECKED_IN';
    perm.checkInTime = new Date().toISOString();
    this.save(STORAGE_KEYS.STAY_PERMISSIONS, list);

    if (perm.roomId) {
      const rooms = this.load<HotelRoom[]>(STORAGE_KEYS.ROOMS, []);
      const targetRoom = rooms.find((r) => r.id === perm.roomId);
      if (targetRoom) {
        targetRoom.status = 'OCCUPIED';
        this.save(STORAGE_KEYS.ROOMS, rooms);
      }
    }

    this.recordAudit({
      actorId: hotelUser.id,
      actorName: hotelUser.name,
      actorEmail: hotelUser.email,
      actorRole: hotelUser.role,
      action: 'GUEST_CHECKED_IN',
      targetType: 'ROOM',
      targetId: perm.id,
      details: `Guest ${perm.guestName} checked in using Stay Pass ${perm.stayPassCode}`,
      result: 'SUCCESS',
    });

    return perm;
  }

  public static processGuestCheckOut(hotelUser: AdminUser, stayPermissionId: string): StayPermission {
    this.checkPermission(hotelUser, 'MANAGE_BOOKINGS');
    const list = this.load<StayPermission[]>(STORAGE_KEYS.STAY_PERMISSIONS, INITIAL_STAY_PERMISSIONS);
    const perm = list.find((s) => s.id === stayPermissionId);

    if (!perm) throw new Error('Stay permission not found');

    perm.permissionStatus = 'CHECKED_OUT';
    perm.checkOutTime = new Date().toISOString();
    this.save(STORAGE_KEYS.STAY_PERMISSIONS, list);

    if (perm.roomId) {
      const rooms = this.load<HotelRoom[]>(STORAGE_KEYS.ROOMS, []);
      const targetRoom = rooms.find((r) => r.id === perm.roomId);
      if (targetRoom) {
        targetRoom.status = 'AVAILABLE';
        targetRoom.currentBookingId = undefined;
        this.save(STORAGE_KEYS.ROOMS, rooms);
      }
    }

    this.recordAudit({
      actorId: hotelUser.id,
      actorName: hotelUser.name,
      actorEmail: hotelUser.email,
      actorRole: hotelUser.role,
      action: 'GUEST_CHECKED_OUT',
      targetType: 'ROOM',
      targetId: perm.id,
      details: `Guest ${perm.guestName} checked out of ${perm.hotelName}`,
      result: 'SUCCESS',
    });

    return perm;
  }

  public static verifyPartnerRegistration(
    adminUser: AdminUser,
    partnerType: 'HOTEL' | 'AGENCY',
    partnerId: string,
    approve: boolean,
    notes?: string
  ): void {
    this.checkPermission(adminUser, 'MANAGE_ADMINS');

    if (partnerType === 'HOTEL') {
      const hotels = this.load<HotelPartner[]>(STORAGE_KEYS.HOTELS, INITIAL_HOTELS);
      const h = hotels.find((item) => item.id === partnerId);
      if (h) {
        h.verificationStatus = approve ? 'VERIFIED' : 'REJECTED';
        h.status = approve ? 'ACTIVE' : 'INACTIVE';
        this.save(STORAGE_KEYS.HOTELS, hotels);
      }
    } else {
      const agencies = this.load<TravelAgencyPartner[]>(STORAGE_KEYS.AGENCIES, INITIAL_AGENCIES);
      const a = agencies.find((item) => item.id === partnerId);
      if (a) {
        a.verificationStatus = approve ? 'VERIFIED' : 'REJECTED';
        a.status = approve ? 'ACTIVE' : 'INACTIVE';
        this.save(STORAGE_KEYS.AGENCIES, agencies);
      }
    }

    this.recordAudit({
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorEmail: adminUser.email,
      actorRole: adminUser.role,
      action: approve ? 'PARTNER_VERIFIED_APPROVED' : 'PARTNER_VERIFIED_REJECTED',
      targetType: partnerType === 'HOTEL' ? 'HOTEL' : 'AGENCY',
      targetId: partnerId,
      details: `Admin ${approve ? 'Approved' : 'Rejected'} verification for ${partnerType} ID ${partnerId}. Notes: ${notes || 'N/A'}`,
      result: 'SUCCESS',
    });
  }

  public static verifyDashboardRolePassword(email: string, pass: string): boolean {
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === 'admin@tourguide.com') return pass === 'admin#123' || pass === 'admin123';
    if (cleanEmail === 'hotel1@tourguide.com' || cleanEmail === 'hotel2@tourguide.com') return pass === 'hotel@123';
    if (cleanEmail === 'agency1@tourguide.com') return pass === 'travel@123';
    return pass.length >= 8;
  }
}
