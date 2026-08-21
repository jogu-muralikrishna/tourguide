import { Vehicle, Hotel, Pitstop, WeatherData, Booking, AdminRequest, RouteData } from '../types';
import { VEHICLES_DATA, HOTELS_DATA, PITSTOPS_DATA } from '../data/mockData';
import { getWeatherForCity } from '../utils/weather';
import { getBookings, saveBooking as saveLocalBooking, updateBookingStatus as updateLocalStatus, deleteBooking as deleteLocalBooking } from '../utils/storage';

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
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// 1. Fetch Real Route Distance & Time
export async function fetchRouteTelemetry(fromCity: string, toCity: string): Promise<RouteData> {
  try {
    const res = await fetch(`/api/route/calculate?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}`);
    if (res.ok) {
      const data = await res.json();
      return {
        origin: data.from || fromCity,
        destination: data.to || toCity,
        originCoordinates: data.originCoords || { lat: 17.385, lng: 78.4867, name: fromCity },
        destinationCoordinates: data.destCoords || { lat: 28.6139, lng: 77.209, name: toCity },
        distanceMeters: (data.roadDistanceKm || 100) * 1000,
        distanceKm: data.roadDistanceKm || 100,
        durationSeconds: data.durationSeconds || 3600,
        durationText: data.carEstimatedHours || '2h 00m',
        carEstimatedHours: data.carEstimatedHours || '2h 00m',
        trainEstimatedHours: data.trainEstimatedHours || '1h 30m',
        busEstimatedHours: data.busEstimatedHours || '2h 30m',
        highwayCorridor: data.highwayCorridor || `${fromCity} - ${toCity} Highway Corridor`,
        routeGeometry: data.routeGeometry || [],
        success: true,
      };
    }
  } catch (err) {
    console.warn('Route calculation network fallback:', err);
  }

  const roadDistanceKm = 193;
  return {
    origin: fromCity,
    destination: toCity,
    originCoordinates: { lat: 17.385, lng: 78.4867, name: fromCity },
    destinationCoordinates: { lat: 17.2473, lng: 80.1514, name: toCity },
    distanceMeters: roadDistanceKm * 1000,
    distanceKm: roadDistanceKm,
    durationSeconds: 13500,
    durationText: '3h 45m',
    carEstimatedHours: '3h 45m',
    trainEstimatedHours: '2h 50m',
    busEstimatedHours: '4h 15m',
    highwayCorridor: `${fromCity} - ${toCity} Highway Corridor`,
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

  // Fallback to real weather lookup
  return getWeatherForCity(cityName);
}

// 3. Fetch Dynamic Cars (Cars only)
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

// 6. Fetch Bookings with Role-Based Data Isolation
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

// 7. Create New Booking with Registration Token ID Generation
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

// 10. Login
export async function loginApi(email: string, passwordPlain: string): Promise<{ success: boolean; user: AuthRoleUser; token: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: passwordPlain }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Authentication failed' }));
    throw new Error(err.error || 'Login failed');
  }

  const data = await res.json();
  setAuthToken(data.token);
  return data;
}

// 11. Register User
export async function registerApi(userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'USER' | 'HOTEL_ADMIN' | 'TRAVEL_ADMIN';
  hotelId?: string;
  hotelName?: string;
}): Promise<{ success: boolean; user: AuthRoleUser; token: string }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Registration failed' }));
    throw new Error(err.error || 'Registration failed');
  }

  const data = await res.json();
  setAuthToken(data.token);
  return data;
}

// 12. Verify Token ID
export async function verifyTokenApi(tokenId: string): Promise<{ valid: boolean; booking?: Booking; error?: string; message?: string }> {
  const res = await fetch('/api/tokens/verify', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ tokenId }),
  });

  return await res.json();
}

// 13. Admin Partnership Requests
export async function submitAdminRequestApi(data: {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  businessType: 'HOTEL_ADMIN' | 'TRAVEL_ADMIN';
  notes?: string;
}): Promise<AdminRequest> {
  const res = await fetch('/api/admin/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to submit request' }));
    throw new Error(err.error || 'Failed to submit request');
  }

  const result = await res.json();
  return result.request;
}

export async function fetchAdminRequestsApi(): Promise<AdminRequest[]> {
  const res = await fetch('/api/admin/requests', {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to load requests' }));
    throw new Error(err.error || 'Failed to load requests');
  }

  const data = await res.json();
  return data.requests || [];
}

export async function approveAdminRequestApi(
  id: string,
  approvalPayload?: {
    customEmail?: string;
    customPassword?: string;
    temporaryPassword?: string;
    assignedHotelId?: string;
    assignedHotelName?: string;
    assignedAgencyId?: string;
    assignedAgencyName?: string;
  }
): Promise<any> {
  const res = await fetch(`/api/admin/requests/${id}/approve`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(approvalPayload || {}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Approval failed' }));
    throw new Error(err.error || 'Approval failed');
  }

  return await res.json();
}

export async function rejectAdminRequestApi(id: string): Promise<any> {
  const res = await fetch(`/api/admin/requests/${id}/reject`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Rejection failed' }));
    throw new Error(err.error || 'Rejection failed');
  }

  return await res.json();
}

// 14. Fetch System Roles (Admin Switcher)
export async function fetchSystemRolesApi(): Promise<AuthRoleUser[]> {
  try {
    const res = await fetch('/api/auth/roles');
    if (res.ok) {
      const data = await res.json();
      return data.roles || [];
    }
  } catch (err) {
    console.warn('System roles fallback:', err);
  }

  return [
    {
      id: 'usr-main-admin',
      name: 'Main Admin (Master Control)',
      email: 'admin@tourguide.ai',
      phone: '+91 99999 00001',
      role: 'MAIN_ADMIN',
    },
    {
      id: 'usr-hotel-admin',
      name: 'The Oberoi New Delhi Admin',
      email: 'manager.oberoi@delhihotels.in',
      phone: '+91 99999 00002',
      role: 'HOTEL_ADMIN',
      hotelId: 'htl-del-01',
      hotelName: 'The Oberoi, New Delhi',
    },
    {
      id: 'usr-travel-admin',
      name: 'Apex Luxury Fleet Admin',
      email: 'ops@apexmobility.in',
      phone: '+91 99999 00003',
      role: 'TRAVEL_ADMIN',
      agencyId: 'ag-apex-01',
      agencyName: 'Apex Mobility India',
    },
  ];
}

// 15. Send Chat
export async function sendChatMessageApi(message: string, tripContext: any): Promise<{ reply: string; source: string }> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, tripContext }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Chat API fallback:', err);
  }

  return {
    reply: `I am here to help you with your journey from **${tripContext?.from || 'Starting point'}** to **${tripContext?.to || 'Destination'}**.`,
    source: 'local_fallback',
  };
}
