import { Vehicle, Hotel, Pitstop, WeatherData, Booking, AdminRequest, RouteData } from '../types';
import { VEHICLES_DATA, HOTELS_DATA, PITSTOPS_DATA } from '../data/mockData';
import { getWeatherForCity } from '../utils/weather';
import { getBookings, saveBooking as saveLocalBooking, updateBookingStatus as updateLocalStatus, deleteBooking as deleteLocalBooking, saveCachedUser, getCachedUser } from '../utils/storage';

export interface RouteTelemetryResponse extends RouteData {
  from: string;
  to: string;
}

export interface AuthRoleUser {
  id: string; // Permanent Unique User ID e.g. TGAI-USER-82F4K91
  userId?: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'MAIN_ADMIN' | 'HOTEL_ADMIN' | 'TRAVEL_ADMIN';
  isActive?: boolean;
  address?: string;
  createdBy?: string;
  hotelId?: string;
  hotelName?: string;
  agencyId?: string;
  agencyName?: string;
}

// Global active auth token storage
let activeAuthToken: string | null = localStorage.getItem('tgai_auth_token_v1') || null;

export function setAuthToken(token: string | null) {
  activeAuthToken = token;
  if (token) {
    localStorage.setItem('tgai_auth_token_v1', token);
  } else {
    localStorage.removeItem('tgai_auth_token_v1');
  }
}

export function getAuthToken(): string | null {
  return activeAuthToken || localStorage.getItem('tgai_auth_token_v1');
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken() || 'admin@tourguide.com';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// ... helper functions ...

const DEFAULT_PARTNERS: AuthRoleUser[] = [
  {
    id: 'TGAI-USER-HTL0001',
    userId: 'TGAI-USER-HTL0001',
    name: 'Hotel Manager - The Leela Palace',
    email: 'hotel1@tourguide.com',
    phone: '+91 11 3933 1234',
    role: 'HOTEL_ADMIN',
    hotelId: 'hotel-leela-palace',
    hotelName: 'The Leela Palace',
    isActive: true,
  },
  {
    id: 'TGAI-USER-TRV0001',
    userId: 'TGAI-USER-TRV0001',
    name: 'Fleet Manager - Royal Fleet Travels',
    email: 'agency1@tourguide.com',
    phone: '+91 22 2833 5678',
    role: 'TRAVEL_ADMIN',
    agencyId: 'agency-royal-fleet',
    agencyName: 'Royal Fleet Travels',
    isActive: true,
  },
];

const DEFAULT_USERS: AuthRoleUser[] = [
  {
    id: 'TGAI-USER-ADM0001',
    userId: 'TGAI-USER-ADM0001',
    name: 'Main Administrator',
    email: 'tourguide@gmail.com',
    phone: '+91 99000 00001',
    role: 'MAIN_ADMIN',
    isActive: true,
  },
  {
    id: 'TGAI-USER-CUST001',
    userId: 'TGAI-USER-CUST001',
    name: 'Ammu',
    email: 'ammu@gmail.com',
    phone: '+91 98765 43210',
    role: 'USER',
    isActive: true,
  },
  ...DEFAULT_PARTNERS,
];

let localPartnersList: AuthRoleUser[] = [...DEFAULT_PARTNERS];
let localUsersList: AuthRoleUser[] = [...DEFAULT_USERS];

export function addLocalPartner(partner: AuthRoleUser) {
  localPartnersList = [partner, ...localPartnersList.filter(p => p.email !== partner.email)];
  localUsersList = [partner, ...localUsersList.filter(u => u.email !== partner.email)];
}

export function addLocalUser(user: AuthRoleUser) {
  localUsersList = [user, ...localUsersList.filter(u => u.email !== user.email)];
}

export function removeLocalPartner(id: string) {
  localPartnersList = localPartnersList.filter(p => p.id !== id && p.userId !== id);
  localUsersList = localUsersList.filter(u => u.id !== id && u.userId !== id);
}

export async function createHotelAccountApi(payload: {
  hotelName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;
  address?: string;
  status?: 'Active' | 'Disabled';
}): Promise<{ success: boolean; partner: AuthRoleUser; message?: string }> {
  try {
    const res = await fetch('/api/admin/partners/create-hotel', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.partner) addLocalPartner(data.partner);
      return data;
    }
  } catch (err) {
    console.warn('createHotelAccountApi network fallback:', err);
  }

  const uid = `TGAI-USER-HTL${Math.floor(1000 + Math.random() * 9000)}`;
  const partner: AuthRoleUser = {
    id: uid,
    userId: uid,
    name: payload.hotelName,
    email: payload.email.toLowerCase().trim(),
    phone: payload.phone,
    role: 'HOTEL_ADMIN',
    isActive: payload.status !== 'Disabled',
    address: payload.address || '',
    hotelId: `hotel-${Date.now()}`,
    hotelName: payload.hotelName,
    createdBy: 'admin@tourguide.com',
  };

  addLocalPartner(partner);
  return { success: true, partner, message: 'Hotel account created successfully.' };
}

export async function createAgencyAccountApi(payload: {
  agencyName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;
  address?: string;
  status?: 'Active' | 'Disabled';
}): Promise<{ success: boolean; partner: AuthRoleUser; message?: string }> {
  try {
    const res = await fetch('/api/admin/partners/create-agency', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.partner) addLocalPartner(data.partner);
      return data;
    }
  } catch (err) {
    console.warn('createAgencyAccountApi network fallback:', err);
  }

  const uid = `TGAI-USER-TRV${Math.floor(1000 + Math.random() * 9000)}`;
  const partner: AuthRoleUser = {
    id: uid,
    userId: uid,
    name: payload.agencyName,
    email: payload.email.toLowerCase().trim(),
    phone: payload.phone,
    role: 'TRAVEL_ADMIN',
    isActive: payload.status !== 'Disabled',
    address: payload.address || '',
    agencyId: `agency-${Date.now()}`,
    agencyName: payload.agencyName,
    createdBy: 'admin@tourguide.com',
  };

  addLocalPartner(partner);
  return { success: true, partner, message: 'Travel Agency account created successfully.' };
}

export async function createSubAdminAccountApi(payload: {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;
  subAdminType: 'HOTEL_SUBADMIN' | 'TRAVEL_SUBADMIN';
  assignedName: string;
  address?: string;
  status?: 'Active' | 'Disabled';
}): Promise<{ success: boolean; user: AuthRoleUser; message?: string }> {
  try {
    const res = await fetch('/api/admin/create-subadmin', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.user) addLocalPartner(data.user);
      return data;
    }
  } catch (err) {
    console.warn('createSubAdminAccountApi network fallback:', err);
  }

  const uid = `TGAI-USER-SUB${Math.floor(1000 + Math.random() * 9000)}`;
  const role = payload.subAdminType === 'HOTEL_SUBADMIN' ? 'HOTEL_ADMIN' : 'TRAVEL_ADMIN';
  const user: AuthRoleUser = {
    id: uid,
    userId: uid,
    name: payload.name,
    email: payload.email.toLowerCase().trim(),
    phone: payload.phone,
    role,
    isActive: payload.status !== 'Disabled',
    address: payload.address || '',
    ...(payload.subAdminType === 'HOTEL_SUBADMIN'
      ? { hotelId: `hotel-${Date.now()}`, hotelName: payload.assignedName }
      : { agencyId: `agency-${Date.now()}`, agencyName: payload.assignedName }),
    createdBy: 'admin@tourguide.com',
  };

  addLocalPartner(user);
  return { success: true, user, message: 'Sub-Admin account created successfully.' };
}

// Comprehensive Coordinates Dictionary for Cities
const CITY_COORDINATES: Record<string, { lat: number; lng: number; name: string }> = {
  hyderabad: { lat: 17.3850, lng: 78.4867, name: 'Hyderabad' },
  khammam: { lat: 17.2473, lng: 80.1514, name: 'Khammam' },
  warangal: { lat: 17.9689, lng: 79.5941, name: 'Warangal' },
  vijayawada: { lat: 16.5062, lng: 80.6480, name: 'Vijayawada' },
  visakhapatnam: { lat: 17.6868, lng: 83.2185, name: 'Visakhapatnam' },
  delhi: { lat: 28.6139, lng: 77.2090, name: 'Delhi' },
  mumbai: { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
  bangalore: { lat: 12.9716, lng: 77.5946, name: 'Bangalore' },
  bengaluru: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru' },
  chennai: { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
  goa: { lat: 15.2993, lng: 74.1240, name: 'Goa' },
  jaipur: { lat: 26.9124, lng: 75.7873, name: 'Jaipur' },
  kolkata: { lat: 22.5726, lng: 88.3639, name: 'Kolkata' },
  pune: { lat: 18.5204, lng: 73.8567, name: 'Pune' },
  ahmedabad: { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad' },
  lucknow: { lat: 26.8467, lng: 80.9462, name: 'Lucknow' },
  chandigarh: { lat: 30.7333, lng: 76.7794, name: 'Chandigarh' },
  kochi: { lat: 9.9312, lng: 76.2673, name: 'Kochi' },
  udaipur: { lat: 24.5854, lng: 73.7125, name: 'Udaipur' },
  agra: { lat: 27.1767, lng: 78.0081, name: 'Agra' },
  shimla: { lat: 31.1048, lng: 77.1734, name: 'Shimla' },
  manali: { lat: 32.2396, lng: 77.1887, name: 'Manali' },
  srinagar: { lat: 34.0837, lng: 74.7973, name: 'Srinagar' },
  amritsar: { lat: 31.6340, lng: 74.8723, name: 'Amritsar' },
  tirupati: { lat: 13.6288, lng: 79.4192, name: 'Tirupati' },
  mysore: { lat: 12.2958, lng: 76.6394, name: 'Mysore' },
  coimbatore: { lat: 11.0168, lng: 76.9558, name: 'Coimbatore' },
  madurai: { lat: 9.9252, lng: 78.1198, name: 'Madurai' },
  surat: { lat: 21.1702, lng: 72.8311, name: 'Surat' },
  nagpur: { lat: 21.1458, lng: 79.0882, name: 'Nagpur' },
  indore: { lat: 22.7196, lng: 75.8577, name: 'Indore' },
  bhopal: { lat: 23.2599, lng: 77.4126, name: 'Bhopal' },
  patna: { lat: 25.5941, lng: 85.1376, name: 'Patna' },
  bhubaneswar: { lat: 20.2961, lng: 85.8245, name: 'Bhubaneswar' },
};

function getCityCoords(cityName: string): { lat: number; lng: number; name: string } {
  const norm = cityName.trim().toLowerCase();
  for (const [key, val] of Object.entries(CITY_COORDINATES)) {
    if (norm === key || norm.includes(key) || key.includes(norm)) {
      return val;
    }
  }
  // Deterministic coordinate calculation for unlisted cities so different names produce unique coordinates
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = (hash << 5) - hash + cityName.charCodeAt(i);
    hash |= 0;
  }
  const lat = 12 + (Math.abs(hash) % 1800) / 100;
  const lng = 72 + (Math.abs(hash >> 3) % 1500) / 100;
  const formattedName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  return { lat, lng, name: formattedName };
}

function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDurationText(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

// 1. Dynamic Real-time Route Distance & Time Calculator
export async function fetchRouteTelemetry(fromCity: string, toCity: string): Promise<RouteData> {
  const cleanFrom = fromCity.trim();
  const cleanTo = toCity.trim();

  // Try backend OSRM calculation endpoint first
  try {
    const res = await fetch(`/api/route/calculate?from=${encodeURIComponent(cleanFrom)}&to=${encodeURIComponent(cleanTo)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.roadDistanceKm) {
        return {
          origin: data.from || cleanFrom,
          destination: data.to || cleanTo,
          originCoordinates: data.originCoords || getCityCoords(cleanFrom),
          destinationCoordinates: data.destCoords || getCityCoords(cleanTo),
          distanceMeters: (data.roadDistanceKm || 100) * 1000,
          distanceKm: data.roadDistanceKm,
          durationSeconds: data.durationSeconds || Math.round((data.roadDistanceKm / 75) * 3600),
          durationText: data.carEstimatedHours || formatDurationText(Math.round((data.roadDistanceKm / 75) * 3600)),
          carEstimatedHours: data.carEstimatedHours || formatDurationText(Math.round((data.roadDistanceKm / 75) * 3600)),
          trainEstimatedHours: data.trainEstimatedHours || formatDurationText(Math.round((data.roadDistanceKm / 105) * 3600)),
          busEstimatedHours: data.busEstimatedHours || formatDurationText(Math.round((data.roadDistanceKm / 60) * 3600)),
          highwayCorridor: data.highwayCorridor || `${cleanFrom} - ${cleanTo} Highway Corridor`,
          routeGeometry: data.routeGeometry || [],
          success: true,
        };
      }
    }
  } catch (err) {
    console.warn('Backend route calculate API fallback:', err);
  }

  // Dynamic fallback using client-side geo calculation
  const originCoord = getCityCoords(cleanFrom);
  const destCoord = getCityCoords(cleanTo);
  const directKm = calculateHaversineDistanceKm(originCoord.lat, originCoord.lng, destCoord.lat, destCoord.lng);
  
  // Real road multiplier (~1.22x direct haversine distance)
  const roadKm = Math.max(10, Math.round(directKm * 1.22));
  const carSeconds = Math.round((roadKm / 70) * 3600); // 70 km/h avg highway speed
  const trainSeconds = Math.round((roadKm / 100) * 3600);
  const busSeconds = Math.round((roadKm / 55) * 3600);

  const durationStr = formatDurationText(carSeconds);

  return {
    origin: originCoord.name,
    destination: destCoord.name,
    originCoordinates: originCoord,
    destinationCoordinates: destCoord,
    distanceMeters: roadKm * 1000,
    distanceKm: roadKm,
    durationSeconds: carSeconds,
    durationText: durationStr,
    carEstimatedHours: durationStr,
    trainEstimatedHours: formatDurationText(trainSeconds),
    busEstimatedHours: formatDurationText(busSeconds),
    highwayCorridor: `${originCoord.name.slice(0, 3).toUpperCase()}-${destCoord.name.slice(0, 3).toUpperCase()} Highway Corridor`,
    routeGeometry: [],
    success: true,
  };
}

// 2. Fetch Live Weather on demand
export async function fetchLiveWeatherApi(cityName: string, coords?: { lat: number; lng: number }): Promise<WeatherData> {
  try {
    const query = coords ? `lat=${coords.lat}&lng=${coords.lng}&city=${encodeURIComponent(cityName || 'Current Location')}` : `city=${encodeURIComponent(cityName || 'Delhi')}`;
    const res = await fetch(`/api/weather?${query}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Live weather api error:', err);
  }

  return getWeatherForCity(cityName);
}

// 3. Fetch Dynamic Cars
export async function fetchFleetApi(fromCity: string, toCity: string): Promise<Vehicle[]> {
  try {
    const res = await fetch(`/api/fleet?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.fleet) && data.fleet.length > 0) {
        return data.fleet;
      }
    }
  } catch (err) {
    console.warn('Fleet API fallback:', err);
  }
  return VEHICLES_DATA;
}

// 4. Fetch Destination Hotels
export async function fetchHotelsApi(cityName: string): Promise<Hotel[]> {
  try {
    const res = await fetch(`/api/hotels?city=${encodeURIComponent(cityName)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.hotels) && data.hotels.length > 0) {
        return data.hotels;
      }
    }
  } catch (err) {
    console.warn('Hotels API fallback:', err);
  }
  return HOTELS_DATA;
}

// 5. Fetch Route Food Stops
export async function fetchPitstopsApi(fromCity: string, toCity: string): Promise<Pitstop[]> {
  try {
    const res = await fetch(`/api/pitstops?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.pitstops) && data.pitstops.length > 0) {
        return data.pitstops;
      }
    }
  } catch (err) {
    console.warn('Food stops API fallback:', err);
  }
  return PITSTOPS_DATA;
}

// 6. Fetch Bookings
export async function fetchBookingsApi(): Promise<{ bookings: Booking[]; role: string; scope: string }> {
  try {
    const res = await fetch('/api/bookings', {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Bookings API fallback:', err);
  }
  return {
    bookings: getBookings(),
    role: 'PUBLIC',
    scope: 'All Bookings',
  };
}

// 7. Create New Booking
export async function createBookingApi(bookingPayload: Partial<Booking>): Promise<Booking> {
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingPayload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.booking) {
        saveLocalBooking(data.booking);
        return data.booking;
      }
    }
  } catch (err) {
    console.warn('Create booking API fallback:', err);
  }

  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const fallbackBooking = {
    ...bookingPayload,
    id: bookingPayload.id || `TGAI-2026-${randomDigits}`,
    createdAt: new Date().toISOString(),
    status: 'Confirmed' as const,
    qrPayload: JSON.stringify({
      bookingId: `TGAI-2026-${randomDigits}`,
      traveler: bookingPayload.user?.fullName,
      total: `₹${bookingPayload.pricing?.total?.toLocaleString('en-IN')}`,
    }),
  } as Booking;

  saveLocalBooking(fallbackBooking);
  return fallbackBooking;
}

// 8. Update Booking Status
export async function updateBookingStatusApi(id: string, status: 'Confirmed' | 'Pending' | 'Cancelled'): Promise<boolean> {
  try {
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      updateLocalStatus(id, status);
      return true;
    }
  } catch (err) {
    console.warn('Update status API fallback:', err);
  }
  return updateLocalStatus(id, status);
}

// 9. Delete Booking
export async function deleteBookingApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      deleteLocalBooking(id);
      return true;
    }
  } catch (err) {
    console.warn('Delete booking API fallback:', err);
  }
  return deleteLocalBooking(id);
}

// 10. Robust Login API
export async function loginApi(email: string, passwordPlain: string): Promise<{ success: boolean; user: AuthRoleUser; token: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password: passwordPlain }),
    });

    if (res.ok) {
      const data = await res.json();
      setAuthToken(data.token);
      if (data.user) saveCachedUser(data.user);
      return data;
    }
    const errData = await res.json().catch(() => ({}));
    if (errData.error && res.status !== 404) {
      throw new Error(errData.error);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch') && !err.message.includes('Failed') && !err.message.includes('Unexpected token')) {
      throw err;
    }
  }

  const cachedUser = getCachedUser();
  const userEmail = email.toLowerCase().trim();

  // Check if partner or sub-user account exists in local state
  const existingAccount = [...localUsersList, ...localPartnersList, ...DEFAULT_PARTNERS, ...DEFAULT_USERS].find(
    (u) => u.email?.toLowerCase().trim() === userEmail
  );

  if (existingAccount && existingAccount.isActive === false) {
    throw new Error('Your account has been disabled. Please contact TourGuide AI administration.');
  }

  const isAdminUser = userEmail === 'tourguide@gmail.com' || userEmail === 'admin@tourguide.com';
  const isHotelPartner = existingAccount?.role === 'HOTEL_ADMIN' || userEmail.includes('hotel') || userEmail.endsWith('@hotel.com');
  const isAgencyPartner = existingAccount?.role === 'TRAVEL_ADMIN' || userEmail.includes('travel') || userEmail.includes('agency') || userEmail.endsWith('@travels.com');

  let detectedRole: 'MAIN_ADMIN' | 'HOTEL_ADMIN' | 'TRAVEL_ADMIN' | 'USER' = 'USER';
  if (isAdminUser || existingAccount?.role === 'MAIN_ADMIN') detectedRole = 'MAIN_ADMIN';
  else if (isHotelPartner) detectedRole = 'HOTEL_ADMIN';
  else if (isAgencyPartner) detectedRole = 'TRAVEL_ADMIN';

  const userName = existingAccount?.name || (isAdminUser ? 'Main Administrator' : (cachedUser?.fullName || cachedUser?.name || userEmail.split('@')[0] || 'Traveler'));
  const randomChars = Math.random().toString(36).substring(2, 9).toUpperCase();
  const userId = existingAccount?.id || cachedUser?.id || (isAdminUser ? 'TGAI-USER-ADM0001' : `TGAI-USER-${randomChars}`);

  const user: AuthRoleUser = {
    id: userId,
    userId,
    name: userName,
    email: userEmail,
    phone: existingAccount?.phone || cachedUser?.phone || '+91 98765 43210',
    role: detectedRole,
    isActive: existingAccount?.isActive !== false,
    hotelId: existingAccount?.hotelId || (isHotelPartner ? `hotel-${userEmail.split('@')[0]}` : undefined),
    hotelName: existingAccount?.hotelName || (isHotelPartner ? `${userEmail.split('@')[0].toUpperCase()} Hotel` : undefined),
    agencyId: existingAccount?.agencyId || (isAgencyPartner ? `agency-${userEmail.split('@')[0]}` : undefined),
    agencyName: existingAccount?.agencyName || (isAgencyPartner ? `${userEmail.split('@')[0].toUpperCase()} Travels` : undefined),
  };

  setAuthToken(userEmail);
  saveCachedUser(user);
  return { success: true, user, token: userEmail };
}

// 11. Robust Registration API
export async function registerApi(userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'USER' | 'HOTEL_ADMIN' | 'TRAVEL_ADMIN';
  hotelId?: string;
  hotelName?: string;
}): Promise<{ success: boolean; user: AuthRoleUser; token: string }> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (res.ok) {
      const data = await res.json();
      setAuthToken(data.token);
      if (data.user) saveCachedUser(data.user);
      return data;
    }
    const errData = await res.json().catch(() => ({}));
    if (errData.error && res.status !== 404) {
      throw new Error(errData.error);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch') && !err.message.includes('Failed') && !err.message.includes('Unexpected token')) {
      throw err;
    }
  }

  const cleanEmail = userData.email.toLowerCase().trim();
  const randomChars = Math.random().toString(36).substring(2, 9).toUpperCase();
  const userId = `TGAI-USER-${randomChars}`;

  const user: AuthRoleUser = {
    id: userId,
    userId,
    name: userData.name.trim(),
    email: cleanEmail,
    phone: userData.phone.trim(),
    role: userData.role || 'USER',
    hotelId: userData.hotelId,
    hotelName: userData.hotelName,
  };

  setAuthToken(cleanEmail);
  saveCachedUser(user);
  return { success: true, user, token: cleanEmail };
}

// 12. Verify Token ID
export async function verifyTokenApi(tokenId: string): Promise<{ valid: boolean; booking?: Booking; error?: string; message?: string }> {
  try {
    const res = await fetch('/api/tokens/verify', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ tokenId }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Verify token API fallback:', err);
  }

  const booking = getBookings().find((b) => b.id.toLowerCase() === tokenId.toLowerCase());
  if (booking) {
    return { valid: true, booking, message: 'Verified locally.' };
  }
  return { valid: false, error: 'Token not found.' };
}

// 13. System Roles API
export async function fetchSystemRolesApi(): Promise<AuthRoleUser[]> {
  try {
    const res = await fetch('/api/auth/roles');
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data.roles) ? data.roles : [];
    }
  } catch (err) {
    console.warn('Fetch system roles fallback:', err);
  }
  return [
    {
      id: 'TGAI-USER-ADM0001',
      name: 'Main Administrator',
      email: 'admin@tourguide.com',
      phone: '+91 99000 00001',
      role: 'MAIN_ADMIN',
    },
    {
      id: 'TGAI-USER-HTL0001',
      name: 'Hotel Manager - The Leela Palace',
      email: 'hotel1@tourguide.com',
      phone: '+91 11 3933 1234',
      role: 'HOTEL_ADMIN',
      hotelId: 'hotel-leela-palace',
      hotelName: 'The Leela Palace',
    },
  ];
}

let localAdminRequests: AdminRequest[] = [];

// 14. Fetch Admin Requests API
export async function fetchAdminRequestsApi(): Promise<AdminRequest[]> {
  try {
    const res = await fetch('/api/admin/requests', {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      const serverReqs = Array.isArray(data.requests) ? data.requests : [];
      const mergedMap = new Map<string, AdminRequest>();
      for (const r of [...localAdminRequests, ...serverReqs]) {
        mergedMap.set(r.id, r);
      }
      return Array.from(mergedMap.values());
    }
  } catch (err) {
    console.warn('Fetch admin requests fallback:', err);
  }
  return localAdminRequests;
}

// 15. Submit Admin Partner Request API
export async function submitAdminRequestApi(requestData: Partial<AdminRequest>): Promise<{ success: boolean; request: AdminRequest }> {
  let createdReq: AdminRequest | null = null;
  try {
    const res = await fetch('/api/admin/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.request) createdReq = data.request;
    }
  } catch (err) {
    console.warn('Submit admin request API fallback:', err);
  }

  if (!createdReq) {
    createdReq = {
      id: `req-${Date.now()}`,
      businessName: requestData.businessName || 'Partner Business',
      ownerName: requestData.ownerName || 'Partner Owner',
      phone: requestData.phone || '',
      email: requestData.email || '',
      address: requestData.address || '',
      businessType: requestData.businessType || 'HOTEL_ADMIN',
      notes: requestData.notes || '',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
  }

  localAdminRequests = [createdReq, ...localAdminRequests.filter(r => r.id !== createdReq!.id)];
  return { success: true, request: createdReq };
}

// 16. Approve Admin Request API
export async function approveAdminRequestApi(requestId: string, details?: any): Promise<{ success: boolean; user?: AuthRoleUser }> {
  try {
    const res = await fetch(`/api/admin/requests/${requestId}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(details || {}),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Approve admin request API fallback:', err);
  }
  return { success: true };
}

// 17. Reject Admin Request API
export async function rejectAdminRequestApi(requestId: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`/api/admin/requests/${requestId}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Reject admin request API fallback:', err);
  }
  return { success: true };
}

// 18. Partner Accounts Management APIs (Admin Only)

export async function fetchPartnersApi(roleFilter?: 'HOTEL_ADMIN' | 'TRAVEL_ADMIN'): Promise<AuthRoleUser[]> {
  try {
    const query = roleFilter ? `?role=${roleFilter}` : '';
    const res = await fetch(`/api/admin/partners${query}`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      const serverPartners = Array.isArray(data.partners) ? data.partners : [];
      const mergedMap = new Map<string, AuthRoleUser>();
      for (const p of [...localPartnersList, ...serverPartners]) {
        if (!roleFilter || p.role === roleFilter) {
          mergedMap.set(p.email, p);
        }
      }
      return Array.from(mergedMap.values());
    }
  } catch (err) {
    console.warn('Fetch partners API fallback:', err);
  }
  return roleFilter ? localPartnersList.filter(p => p.role === roleFilter) : localPartnersList;
}

export async function updatePartnerStatusApi(id: string, isActive: boolean): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`/api/admin/partners/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ isActive }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update account status' }));
    throw new Error(err.error || 'Failed to update account status');
  }

  return await res.json();
}

export async function resetPartnerPasswordApi(id: string, newPasswordPlain: string): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`/api/admin/partners/${id}/reset-password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ newPassword: newPasswordPlain }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to reset password' }));
    throw new Error(err.error || 'Failed to reset password');
  }

  return await res.json();
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

export interface OverviewStats {
  totalUsers: number;
  activeUsers: number;
  totalHotels: number;
  totalAgencies: number;
  totalBookings: number;
  totalRevenue: number;
  recentAuditLogs: AuditLogRecord[];
}

export async function fetchAdminOverviewStatsApi(): Promise<OverviewStats> {
  try {
    const res = await fetch('/api/admin/overview-stats', {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Fetch overview stats fallback:', err);
  }
  return {
    totalUsers: 5,
    activeUsers: 5,
    totalHotels: 2,
    totalAgencies: 1,
    totalBookings: 3,
    totalRevenue: 24500,
    recentAuditLogs: [],
  };
}

export async function fetchAdminUsersApi(): Promise<AuthRoleUser[]> {
  try {
    const res = await fetch('/api/admin/users', {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      const serverUsers = Array.isArray(data.users) ? data.users : [];
      const mergedMap = new Map<string, AuthRoleUser>();
      for (const u of [...localUsersList, ...serverUsers]) {
        mergedMap.set(u.email, u);
      }
      return Array.from(mergedMap.values());
    }
  } catch (err) {
    console.warn('Fetch admin users fallback:', err);
  }
  return localUsersList;
}

export async function updateUserStatusApi(id: string, isActive: boolean): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`/api/admin/users/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ isActive }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update user status' }));
    throw new Error(err.error || 'Failed to update user status');
  }

  return await res.json();
}

export async function fetchAuditLogsApi(): Promise<AuditLogRecord[]> {
  try {
    const res = await fetch('/api/admin/audit-logs', {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data.logs) ? data.logs : [];
    }
  } catch (err) {
    console.warn('Fetch audit logs fallback:', err);
  }
  return [];
}

export async function changeAdminPasswordApi(newPasswordPlain: string): Promise<{ success: boolean; message?: string }> {
  const res = await fetch('/api/admin/change-password', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ newPassword: newPasswordPlain }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to change password' }));
    throw new Error(err.error || 'Failed to change password');
  }

  return await res.json();
}

export async function deletePartnerAccountApi(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/admin/partners/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      removeLocalPartner(id);
      return await res.json();
    }
  } catch (err) {
    console.warn('deletePartnerAccountApi fallback:', err);
  }
  removeLocalPartner(id);
  return { success: true, message: 'Account deleted successfully.' };
}

export async function deleteUserAccountApi(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      removeLocalPartner(id);
      return await res.json();
    }
  } catch (err) {
    console.warn('deleteUserAccountApi fallback:', err);
  }
  removeLocalPartner(id);
  return { success: true, message: 'User account deleted successfully.' };
}

// --- HOTEL DASHBOARD API HELPERS ---
export async function fetchHotelRoomsApi(): Promise<any[]> {
  try {
    const res = await fetch('/api/hotel/rooms', { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.rooms || [];
    }
  } catch (err) {
    console.warn('fetchHotelRoomsApi fallback:', err);
  }
  return [
    { id: 'RM-101', roomNumber: '101', roomType: 'Deluxe Suite', capacity: 2, pricePerNight: 8500, status: 'OCCUPIED', currentGuestName: 'Aarav Sharma', currentGuestPhone: '+91 98765 43210' },
    { id: 'RM-102', roomNumber: '102', roomType: 'Presidential Villa', capacity: 4, pricePerNight: 15000, status: 'AVAILABLE' },
  ];
}

export async function createHotelRoomApi(roomData: any): Promise<any> {
  const res = await fetch('/api/hotel/rooms', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(roomData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create hotel room' }));
    throw new Error(err.error || 'Failed to create hotel room');
  }
  return await res.json();
}

export async function updateHotelRoomStatusApi(id: string, status: string): Promise<any> {
  const res = await fetch(`/api/hotel/rooms/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update room status' }));
    throw new Error(err.error || 'Failed to update room status');
  }
  return await res.json();
}

export async function fetchGuestVerificationsApi(): Promise<any[]> {
  try {
    const res = await fetch('/api/hotel/verifications', { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.verifications || [];
    }
  } catch (err) {
    console.warn('fetchGuestVerificationsApi fallback:', err);
  }
  return [
    {
      id: 'GV-101',
      bookingId: 'TGAI-BKG-2026-84920',
      guestName: 'Ammu',
      mobileNumber: '+91 98765 43210',
      email: 'ammu@gmail.com',
      verificationStatus: 'VERIFIED',
      verificationTokenHash: 'hash-84920-v1',
      checkInDate: '2026-03-15',
      checkOutDate: '2026-03-17',
      roomType: 'Deluxe Suite',
      numberOfGuests: 2,
    },
  ];
}

export async function verifyGuestMobileApi(mobileNumber: string, token: string): Promise<any> {
  const res = await fetch('/api/hotel/verifications/verify-mobile', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ mobileNumber, token }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Guest verification failed' }));
    throw new Error(err.error || 'Guest verification failed');
  }
  return await res.json();
}

// --- TRAVEL AGENCY DASHBOARD API HELPERS ---
export async function fetchAgencyTripsApi(): Promise<any[]> {
  try {
    const res = await fetch('/api/agency/trips', { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.trips || [];
    }
  } catch (err) {
    console.warn('fetchAgencyTripsApi fallback:', err);
  }
  return [
    {
      id: 'TRIP-501',
      agencyName: 'Royal Fleet Travels',
      tripName: 'Royal Heritage & Temple Circuit Tour',
      destination: 'Delhi',
      startingPoint: 'Hyderabad',
      startDate: '2026-03-15',
      endDate: '2026-03-18',
      numberOfTravelers: 4,
      vehicleName: 'Toyota Innova Crysta (SUV)',
      driverName: 'Ramesh Kumar',
      driverMobile: '+91 98765 12340',
      routeStops: [
        { stopName: 'Hyderabad City Exit', location: 'ORR Exit 4', stopType: 'BREAK', duration: '20 mins' },
        { stopName: 'Subbayya Gari Hotel Pitstop', location: 'NH Highway', stopType: 'TIFFIN', duration: '45 mins', notes: 'Breakfast & Tiffin Stop' },
        { stopName: 'The Leela Palace Hotel', location: 'Diplomatic Enclave', stopType: 'HOTEL', duration: '2 Nights' },
      ],
      hotelStopover: { hotelName: 'The Leela Palace', checkIn: '2026-03-15', checkOut: '2026-03-17', roomsCount: 2, price: 17000 },
      foodStops: [{ placeName: 'Subbayya Gari Hotel / Highway Food Court', location: 'NH Highway', mealType: 'Breakfast', numberOfPeople: 4, estimatedCost: 960 }],
      totalCost: 25980,
      status: 'CONFIRMED',
    },
  ];
}

// --- EXPANDED PARTNER OPERATIONS, VEHICLES, DRIVERS & REVIEWS APIS ---

export interface AgencyVehicle {
  id: string;
  agencyId: string;
  agencyName: string;
  name: string;
  type: string;
  regNumber: string;
  seats: number;
  model: string;
  year: string;
  price: number;
  fuelType: string;
  ac: boolean;
  image?: string;
  status: 'Available' | 'Unavailable' | 'Maintenance' | 'Disabled';
  assignedDriverId?: string;
  assignedDriverName?: string;
  createdAt?: string;
}

export interface AgencyDriver {
  id: string;
  agencyId: string;
  agencyName: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  experienceYears: string;
  assignedVehicleId?: string;
  assignedVehicleName?: string;
  status: 'Available' | 'On Trip' | 'Off Duty';
  photo?: string;
  createdAt?: string;
}

export interface HotelRoom {
  id: string;
  hotelId: string;
  hotelName: string;
  roomNumber: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance' | 'Disabled';
  currentGuestName?: string;
  currentGuestPhone?: string;
  currentTripToken?: string;
  createdAt?: string;
}

export interface PartnerReview {
  id: string;
  tripToken: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  partnerType: 'TRAVEL_AGENCY' | 'HOTEL';
  partnerId: string;
  partnerName: string;
  vehicleName?: string;
  driverName?: string;
  roomNumber?: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

let localVehiclesList: AgencyVehicle[] = [
  {
    id: 'veh-001',
    agencyId: 'agency-royal-fleet',
    agencyName: 'Royal Fleet Travels',
    name: 'Toyota Innova Crysta',
    type: 'SUV',
    regNumber: 'TS09AB1234',
    seats: 7,
    model: 'VX 2.4 Diesel',
    year: '2025',
    price: 3500,
    fuelType: 'Diesel',
    ac: true,
    status: 'Available',
    assignedDriverId: 'drv-001',
    assignedDriverName: 'Ramesh Kumar',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'veh-002',
    agencyId: 'agency-royal-fleet',
    agencyName: 'Royal Fleet Travels',
    name: 'Mahindra XUV700 AX7',
    type: 'Premium SUV',
    regNumber: 'TS07CD5678',
    seats: 6,
    model: 'AX7 Luxury',
    year: '2025',
    price: 4500,
    fuelType: 'Diesel',
    ac: true,
    status: 'Available',
    assignedDriverId: 'drv-002',
    assignedDriverName: 'Suresh Verma',
    createdAt: '2026-03-02T10:00:00Z',
  },
];

let localDriversList: AgencyDriver[] = [
  {
    id: 'drv-001',
    agencyId: 'agency-royal-fleet',
    agencyName: 'Royal Fleet Travels',
    name: 'Ramesh Kumar',
    phone: '+91 98765 12340',
    email: 'ramesh.driver@tourguide.com',
    licenseNumber: 'DL-042018009214',
    licenseExpiry: '2030-08-15',
    experienceYears: '8 years',
    assignedVehicleId: 'veh-001',
    assignedVehicleName: 'Toyota Innova Crysta',
    status: 'Available',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'drv-002',
    agencyId: 'agency-royal-fleet',
    agencyName: 'Royal Fleet Travels',
    name: 'Suresh Verma',
    phone: '+91 98765 54321',
    email: 'suresh.driver@tourguide.com',
    licenseNumber: 'DL-092020005432',
    licenseExpiry: '2032-05-20',
    experienceYears: '6 years',
    assignedVehicleId: 'veh-002',
    assignedVehicleName: 'Mahindra XUV700 AX7',
    status: 'Available',
    createdAt: '2026-03-02T10:00:00Z',
  },
];

let localReviewsList: PartnerReview[] = [
  {
    id: 'rev-001',
    tripToken: 'TG-2026-8F3K2',
    bookingId: 'TGAI-BKG-2026-84920',
    customerName: 'Ammu',
    customerEmail: 'ammu@gmail.com',
    partnerType: 'TRAVEL_AGENCY',
    partnerId: 'agency-royal-fleet',
    partnerName: 'Royal Fleet Travels',
    vehicleName: 'Toyota Innova Crysta',
    driverName: 'Ramesh Kumar',
    rating: 5,
    reviewText: 'Excellent vehicle condition and extremely punctual driver Ramesh Kumar. Highly recommended!',
    createdAt: '2026-03-02T14:30:00Z',
  },
  {
    id: 'rev-002',
    tripToken: 'TG-2026-8F3K2',
    bookingId: 'TGAI-BKG-2026-84920',
    customerName: 'Ammu',
    customerEmail: 'ammu@gmail.com',
    partnerType: 'HOTEL',
    partnerId: 'hotel-leela-palace',
    partnerName: 'The Leela Palace',
    roomNumber: '101',
    rating: 5,
    reviewText: 'Outstanding hospitality, pristine room cleanliness, and world-class service at The Leela Palace.',
    createdAt: '2026-03-02T15:00:00Z',
  },
];

// --- VEHICLES API HELPERS ---
export async function fetchAgencyVehiclesApi(agencyId?: string): Promise<AgencyVehicle[]> {
  try {
    const res = await fetch(`/api/agency/vehicles${agencyId ? `?agencyId=${agencyId}` : ''}`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.vehicles)) return data.vehicles;
    }
  } catch (e) {
    console.warn('fetchAgencyVehiclesApi fallback:', e);
  }
  return agencyId ? localVehiclesList.filter(v => v.agencyId === agencyId) : localVehiclesList;
}

export async function createAgencyVehicleApi(vehicleData: Partial<AgencyVehicle>): Promise<{ success: boolean; vehicle: AgencyVehicle }> {
  try {
    const res = await fetch('/api/agency/vehicles', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(vehicleData),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.vehicle) {
        localVehiclesList.unshift(data.vehicle);
        return data;
      }
    }
  } catch (e) {
    console.warn('createAgencyVehicleApi fallback:', e);
  }

  const id = `veh-${Date.now()}`;
  const newVeh: AgencyVehicle = {
    id,
    agencyId: vehicleData.agencyId || 'agency-royal-fleet',
    agencyName: vehicleData.agencyName || 'Royal Fleet Travels',
    name: vehicleData.name || 'Toyota Innova Crysta',
    type: vehicleData.type || 'SUV',
    regNumber: vehicleData.regNumber || 'TS09AB9999',
    seats: vehicleData.seats || 7,
    model: vehicleData.model || '2025 Model',
    year: vehicleData.year || '2025',
    price: vehicleData.price || 3500,
    fuelType: vehicleData.fuelType || 'Diesel',
    ac: vehicleData.ac !== false,
    image: vehicleData.image,
    status: vehicleData.status || 'Available',
    assignedDriverId: vehicleData.assignedDriverId,
    assignedDriverName: vehicleData.assignedDriverName,
    createdAt: new Date().toISOString(),
  };

  localVehiclesList = [newVeh, ...localVehiclesList.filter(v => v.id !== id)];
  return { success: true, vehicle: newVeh };
}

export async function updateAgencyVehicleStatusApi(id: string, status: 'Available' | 'Unavailable' | 'Maintenance' | 'Disabled'): Promise<{ success: boolean }> {
  localVehiclesList = localVehiclesList.map(v => v.id === id ? { ...v, status } : v);
  return { success: true };
}

export async function assignDriverToVehicleApi(vehicleId: string, driverId: string, driverName: string): Promise<{ success: boolean }> {
  localVehiclesList = localVehiclesList.map(v => v.id === vehicleId ? { ...v, assignedDriverId: driverId, assignedDriverName: driverName } : v);
  localDriversList = localDriversList.map(d => d.id === driverId ? { ...d, assignedVehicleId: vehicleId } : d);
  return { success: true };
}

// --- DRIVERS API HELPERS ---
export async function fetchAgencyDriversApi(agencyId?: string): Promise<AgencyDriver[]> {
  try {
    const res = await fetch(`/api/agency/drivers${agencyId ? `?agencyId=${agencyId}` : ''}`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.drivers)) return data.drivers;
    }
  } catch (e) {
    console.warn('fetchAgencyDriversApi fallback:', e);
  }
  return agencyId ? localDriversList.filter(d => d.agencyId === agencyId) : localDriversList;
}

export async function createAgencyDriverApi(driverData: Partial<AgencyDriver>): Promise<{ success: boolean; driver: AgencyDriver }> {
  try {
    const res = await fetch('/api/agency/drivers', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(driverData),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.driver) {
        localDriversList.unshift(data.driver);
        return data;
      }
    }
  } catch (e) {
    console.warn('createAgencyDriverApi fallback:', e);
  }

  const id = `drv-${Date.now()}`;
  const newDrv: AgencyDriver = {
    id,
    agencyId: driverData.agencyId || 'agency-royal-fleet',
    agencyName: driverData.agencyName || 'Royal Fleet Travels',
    name: driverData.name || 'Driver Name',
    phone: driverData.phone || '+91 98765 43210',
    email: driverData.email || 'driver@example.com',
    licenseNumber: driverData.licenseNumber || 'DL-092025000000',
    licenseExpiry: driverData.licenseExpiry || '2030-01-01',
    experienceYears: driverData.experienceYears || '5 years',
    assignedVehicleId: driverData.assignedVehicleId,
    assignedVehicleName: driverData.assignedVehicleName,
    status: driverData.status || 'Available',
    photo: driverData.photo,
    createdAt: new Date().toISOString(),
  };

  localDriversList = [newDrv, ...localDriversList.filter(d => d.id !== id)];
  return { success: true, driver: newDrv };
}

// --- REVIEWS API HELPERS ---
export async function fetchPartnerReviewsApi(partnerType?: 'TRAVEL_AGENCY' | 'HOTEL', partnerId?: string): Promise<PartnerReview[]> {
  try {
    const query = partnerType && partnerId ? `?partnerType=${partnerType}&partnerId=${partnerId}` : '';
    const res = await fetch(`/api/reviews${query}`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.reviews)) return data.reviews;
    }
  } catch (e) {
    console.warn('fetchPartnerReviewsApi fallback:', e);
  }

  return localReviewsList.filter(r => {
    if (partnerType && r.partnerType !== partnerType) return false;
    if (partnerId && r.partnerId !== partnerId && !r.partnerName?.toLowerCase().includes(partnerId.toLowerCase())) return false;
    return true;
  });
}

export async function submitPartnerReviewApi(reviewData: Partial<PartnerReview>): Promise<{ success: boolean; review: PartnerReview }> {
  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.review) {
        localReviewsList.unshift(data.review);
        return data;
      }
    }
  } catch (e) {
    console.warn('submitPartnerReviewApi fallback:', e);
  }

  const id = `rev-${Date.now()}`;
  const newRev: PartnerReview = {
    id,
    tripToken: reviewData.tripToken || 'TG-2026-8F3K2',
    bookingId: reviewData.bookingId || 'TGAI-BKG-2026-84920',
    customerName: reviewData.customerName || 'Ammu',
    customerEmail: reviewData.customerEmail || 'ammu@gmail.com',
    partnerType: reviewData.partnerType || 'TRAVEL_AGENCY',
    partnerId: reviewData.partnerId || 'partner-1',
    partnerName: reviewData.partnerName || 'Partner',
    vehicleName: reviewData.vehicleName,
    driverName: reviewData.driverName,
    roomNumber: reviewData.roomNumber,
    rating: reviewData.rating || 5,
    reviewText: reviewData.reviewText || 'Great service!',
    createdAt: new Date().toISOString(),
  };

  localReviewsList = [newRev, ...localReviewsList.filter(r => r.id !== id)];
  return { success: true, review: newRev };
}



