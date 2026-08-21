export type AdminRole = 'SUPER_ADMIN' | 'SUB_ADMIN' | 'HOTEL_ADMIN' | 'AGENCY_ADMIN' | 'CUSTOMER';

export type AdminStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type AdminPermission =
  | 'VIEW_CUSTOMERS'
  | 'MANAGE_CUSTOMERS'
  | 'VIEW_BOOKINGS'
  | 'MANAGE_BOOKINGS'
  | 'VIEW_HOTELS'
  | 'MANAGE_HOTELS'
  | 'VIEW_AGENCIES'
  | 'MANAGE_AGENCIES'
  | 'VIEW_VEHICLES'
  | 'MANAGE_VEHICLES'
  | 'VIEW_REVENUE'
  | 'VIEW_REPORTS'
  | 'MANAGE_ADMINS'
  | 'VIEW_AUDIT_LOGS';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string; // Stored securely; validated on login
  role: AdminRole;
  status: AdminStatus;
  hotelId?: string; // Tenant boundary for HOTEL_ADMIN
  hotelName?: string;
  agencyId?: string; // Tenant boundary for AGENCY_ADMIN
  agencyName?: string;
  permissions: AdminPermission[];
  createdAt: string;
  lastLogin?: string;
  createdById?: string;
}

export type HotelRoomStatus = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE' | 'BLOCKED';

export interface HotelRoom {
  id: string;
  hotelId: string;
  roomNumber: string;
  roomType: 'Deluxe Suite' | 'Presidential Villa' | 'Luxury Oceanfront' | 'Heritage Suite' | 'Standard Villa';
  capacity: number;
  pricePerNight: number;
  currency: string;
  status: HotelRoomStatus;
  amenities: string[];
  currentBookingId?: string;
}

export interface HotelPartner {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  verificationStatus?: 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
  businessLicenseNumber?: string;
  taxId?: string;
  authCredentialId?: string;
  assignedAdminId?: string;
  assignedAdminEmail?: string;
  rating: number;
  roomCount: number;
  totalRooms?: number;
  image: string;
  amenities: string[];
  createdAt: string;
}

export type AgencyVehicleStatus = 'AVAILABLE' | 'BOOKED' | 'ON_TRIP' | 'MAINTENANCE' | 'INACTIVE';

export interface AgencyVehicle {
  id: string;
  agencyId: string;
  agencyName: string;
  registrationNumber: string;
  model: string;
  type: 'Luxury Sedan' | 'Executive SUV' | 'VIP Royal Chariot' | 'Premium Coach' | 'Air Charters';
  capacity: number;
  driverId?: string;
  driverName?: string;
  pricePerDay: number;
  currency: string;
  status: AgencyVehicleStatus;
  image?: string;
  features: string[];
  createdAt: string;
}

export type AgencyDriverStatus = 'AVAILABLE' | 'ASSIGNED' | 'ON_TRIP' | 'OFF_DUTY';

export interface AgencyDriver {
  id: string;
  agencyId: string;
  agencyName: string;
  name: string;
  phone: string;
  licenseNumber: string;
  assignedVehicleId?: string;
  assignedVehicleModel?: string;
  rating: number;
  tripsCompleted: number;
  totalTrips?: number;
  status: AgencyDriverStatus;
  createdAt: string;
}

export interface TravelAgencyPartner {
  id: string;
  name: string;
  contactPerson: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  verificationStatus?: 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
  businessLicenseNumber?: string;
  taxId?: string;
  authCredentialId?: string;
  assignedAdminId?: string;
  assignedAdminEmail?: string;
  vehicleCount: number;
  totalFleet?: number;
  driverCount: number;
  rating: number;
  createdAt: string;
}

export type PartnerBookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'NO_SHOW';

export type PartnerPaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface AdminBookingRecord {
  id: string;
  bookingCode: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Hotel details
  hotelId?: string;
  hotelName?: string;
  roomId?: string;
  roomNumber?: string;
  roomType?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;

  // Travel Agency details
  agencyId?: string;
  agencyName?: string;
  vehicleId?: string;
  vehicleModel?: string;
  driverId?: string;
  driverName?: string;
  travelDate?: string;
  origin?: string;
  destination?: string;
  pickupLocation?: string;
  dropLocation?: string;

  // Pricing
  basePrice: number;
  taxes: number;
  serviceFee: number;
  discount: number;
  totalPrice: number;
  currency: string;

  // Status
  bookingStatus: PartnerBookingStatus;
  paymentStatus: PartnerPaymentStatus;
  source: 'AI_RECOMMENDATION' | 'CUSTOMER_BOOKING' | 'ADMIN_CREATED' | 'PARTNER_CREATED';

  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  createdAt: string;
  totalBookings: number;
  totalSpent: number;
  currency: string;
  status: 'ACTIVE' | 'BLOCKED';
}

export interface AdminAuditRecord {
  id: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole: AdminRole;
  action: string;
  targetType: 'ADMIN' | 'HOTEL' | 'AGENCY' | 'ROOM' | 'VEHICLE' | 'DRIVER' | 'BOOKING' | 'CUSTOMER' | 'SECURITY' | 'SESSION';
  targetId: string;
  details: string;
  result: 'SUCCESS' | 'DENIED' | 'FAILED';
  timestamp: string;
  ipAddress?: string;
}

export interface AdminSession {
  token: string;
  user: AdminUser;
  expiresAt: number;
}

export type PreAuthCredentialStatus = 'ACTIVE_PENDING_REGISTRATION' | 'USED' | 'EXPIRED' | 'REVOKED';

export interface AdminPreAuthCredential {
  id: string;
  email: string;
  tempPassword: string;
  targetRole: 'HOTEL_ADMIN' | 'AGENCY_ADMIN';
  partnerName: string;
  status: PreAuthCredentialStatus;
  createdByAdminId: string;
  createdByAdminName: string;
  issuedAt: string;
  expiresAt: string;
  usedAt?: string;
  usedByPartnerId?: string;
}

export type StayPermissionStatus = 'PENDING_APPROVAL' | 'GRANTED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'REVOKED';
export type StayVerificationStatus = 'PENDING_VERIFICATION' | 'VERIFIED_VALID' | 'FLAGGED';

export interface StayPermission {
  id: string;
  stayPassCode: string; // e.g. "STAY-GOA-9821"
  bookingId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  idProofType: 'Aadhaar' | 'Passport' | 'Driver License' | 'Voter ID';
  idProofNumber: string;
  hotelId: string;
  hotelName: string;
  roomId?: string;
  roomNumber?: string;
  roomType?: string;
  agencyId?: string;
  agencyName?: string;
  checkInDate: string;
  checkOutDate: string;
  stayDurationNights: number;
  permissionStatus: StayPermissionStatus;
  verificationStatus: StayVerificationStatus;
  grantedAt?: string;
  verifiedByStaffId?: string;
  verifiedByStaffName?: string;
  checkInTime?: string;
  checkOutTime?: string;
  specialInstructions?: string;
  createdAt: string;
}

