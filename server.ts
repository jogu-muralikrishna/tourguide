import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { db, AuthUser } from './server/db';
import { computeRouteDistanceAsync } from './server/geoService';
import { fetchLiveWeather } from './server/weatherService';
import { getDynamicFleetAsync, getDestinationHotels, getCorridorPitstopsAsync } from './server/catalogService';
import { Booking } from './src/types';

dotenv.config();

// Extend Express Request interface for Authenticated User
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

// Helper to extract authenticated user
function getAuthenticatedUser(req: Request): AuthUser | null {
  const authHeader = req.headers.authorization;
  let email = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    email = authHeader.replace('Bearer ', '').trim();
  } else if (req.query.userEmail && typeof req.query.userEmail === 'string') {
    email = req.query.userEmail.trim();
  }

  if (!email) return null;
  return db.findUserByEmail(email) || null;
}

// --- REUSABLE AUTHORIZATION GUARDS & MIDDLEWARE ---
function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Authentication required. Please log in.' });
    return;
  }
  if (user.isActive === false) {
    res.status(403).json({ error: 'Your account has been disabled. Please contact the administrator.' });
    return;
  }
  req.user = user;
  next();
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user = req.user || getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  if (user.isActive === false) {
    res.status(403).json({ error: 'Your account has been disabled. Please contact the administrator.' });
    return;
  }
  if (user.role !== 'MAIN_ADMIN') {
    res.status(403).json({ error: '403 Forbidden: Admin privileges required.' });
    return;
  }
  req.user = user;
  next();
}

function requireHotel(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user = req.user || getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  if (user.isActive === false) {
    res.status(403).json({ error: 'Your account has been disabled. Please contact the administrator.' });
    return;
  }
  if (user.role !== 'HOTEL_ADMIN' && user.role !== 'MAIN_ADMIN') {
    res.status(403).json({ error: '403 Forbidden: Hotel Partner access required.' });
    return;
  }
  req.user = user;
  next();
}

function requireTravelAgency(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user = req.user || getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  if (user.isActive === false) {
    res.status(403).json({ error: 'Your account has been disabled. Please contact the administrator.' });
    return;
  }
  if (user.role !== 'TRAVEL_ADMIN' && user.role !== 'MAIN_ADMIN') {
    res.status(403).json({ error: '403 Forbidden: Travel Agency access required.' });
    return;
  }
  req.user = user;
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'TOURGUIDE AI Travel System',
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // --- AUTHENTICATION & RBAC ENDPOINTS ---

  // List public accounts/roles metadata
  app.get('/api/auth/roles', (_req: Request, res: Response) => {
    const roles = db.listPublicAdmins();
    res.json({ roles });
  });

  // Unified Login (Role-based authentication & status check)
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Account disability check
    if (user.isActive === false) {
      res.status(403).json({ error: 'Your account has been disabled. Please contact the administrator.' });
      return;
    }

    const isMatch = db.verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const { passwordHash, ...safeUser } = user;
    res.json({
      success: true,
      user: safeUser,
      token: safeUser.email,
    });
  });

  // Public User Register (Customer signup ONLY)
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, password, role = 'USER' } = req.body;

    if (!name || !email || !password || !phone) {
      res.status(400).json({ error: 'Name, email, phone, and password are required' });
      return;
    }

    // Public signup is restricted to standard USER role
    if (role !== 'USER') {
      res.status(403).json({ error: 'Hotels and Travel Agencies cannot sign up publicly. Partner accounts are created exclusively by the Administrator.' });
      return;
    }

    try {
      const newUser = db.registerUser(name, email, phone, password, 'USER');
      const { passwordHash, ...safeUser } = newUser;
      res.status(201).json({
        success: true,
        user: safeUser,
        token: safeUser.email,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Registration failed' });
    }
  });

  // Get current user profile
  app.get('/api/auth/me', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const { passwordHash, ...safeUser } = req.user;
    res.json({ user: safeUser });
  });

  // --- ADMIN PARTNER ACCOUNTS MANAGEMENT (ADMIN ONLY) ---

  // List Partner Accounts (Hotels & Travel Agencies)
  app.get('/api/admin/partners', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const roleFilter = req.query.role as 'HOTEL_ADMIN' | 'TRAVEL_ADMIN' | undefined;
    const partners = db.listPartnerAccounts(roleFilter);
    res.json({ partners });
  });

  // Create Hotel Account (Admin Only)
  app.post('/api/admin/partners/create-hotel', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { hotelName, email, password, confirmPassword, phone, address, status = 'Active' } = req.body;

    if (!hotelName || !email || !password || !phone) {
      res.status(400).json({ error: 'Hotel Name, Email, Password, and Phone are required.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match.' });
      return;
    }

    if (password.length < 4) {
      res.status(400).json({ error: 'Password must be at least 4 characters long.' });
      return;
    }

    try {
      const partner = db.createPartnerAccount({
        name: hotelName,
        email,
        phone,
        passwordPlain: password,
        role: 'HOTEL_ADMIN',
        address,
        isActive: status === 'Active',
        hotelName,
        createdBy: req.user?.email || 'admin@tourguide.com',
      });

      const { passwordHash, ...safeUser } = partner;
      res.status(201).json({
        success: true,
        message: 'Hotel account created successfully.',
        partner: safeUser,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create Hotel account.' });
    }
  });

  // Create Travel Agency Account (Admin Only)
  app.post('/api/admin/partners/create-agency', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { agencyName, email, password, confirmPassword, phone, address, status = 'Active' } = req.body;

    if (!agencyName || !email || !password || !phone) {
      res.status(400).json({ error: 'Agency Name, Email, Password, and Phone are required.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match.' });
      return;
    }

    if (password.length < 4) {
      res.status(400).json({ error: 'Password must be at least 4 characters long.' });
      return;
    }

    try {
      const partner = db.createPartnerAccount({
        name: agencyName,
        email,
        phone,
        passwordPlain: password,
        role: 'TRAVEL_ADMIN',
        address,
        isActive: status === 'Active',
        agencyName,
        createdBy: req.user?.email || 'admin@tourguide.com',
      });

      const { passwordHash, ...safeUser } = partner;
      res.status(201).json({
        success: true,
        message: 'Travel Agency account created successfully.',
        partner: safeUser,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create Travel Agency account.' });
    }
  });

  // Create Sub-Admin Account for Hotel or Travel Agency (Admin Only)
  app.post('/api/admin/create-subadmin', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { name, email, password, confirmPassword, phone, subAdminType, assignedName, address, status = 'Active' } = req.body;

    if (!name || !email || !password || !phone || !subAdminType || !assignedName) {
      res.status(400).json({ error: 'Name, Email, Password, Phone, Sub-Admin Type, and Assigned Organization Name are required.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match.' });
      return;
    }

    if (password.length < 4) {
      res.status(400).json({ error: 'Password must be at least 4 characters long.' });
      return;
    }

    try {
      const subAdmin = db.createSubAdminAccount({
        name,
        email,
        phone,
        passwordPlain: password,
        subAdminType,
        assignedName,
        address,
        isActive: status === 'Active',
        createdBy: req.user?.email || 'admin@tourguide.com',
      });

      const { passwordHash, ...safeUser } = subAdmin;
      res.status(201).json({
        success: true,
        message: `${subAdminType === 'HOTEL_SUBADMIN' ? 'Hotel Manager Sub-Admin' : 'Travel Agency Fleet Sub-Admin'} created successfully.`,
        user: safeUser,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create Sub-Admin account.' });
    }
  });

  // Toggle Partner Account Active/Disabled Status
  app.put('/api/admin/partners/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      res.status(400).json({ error: 'Status (isActive boolean) is required.' });
      return;
    }

    try {
      const updated = db.setPartnerStatus(id, isActive);
      const { passwordHash, ...safeUser } = updated;
      res.json({
        success: true,
        message: `Account status updated to ${isActive ? 'Active' : 'Disabled'}.`,
        partner: safeUser,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update status.' });
    }
  });

  // Reset Partner Credentials / Password
  app.put('/api/admin/partners/:id/reset-password', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters long.' });
      return;
    }

    try {
      db.resetPartnerPassword(id, newPassword);
      res.json({ success: true, message: 'Password reset successfully.' });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to reset password.' });
    }
  });

  // Delete Partner Account
  app.delete('/api/admin/partners/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      db.deletePartnerAccount(id);
      res.json({ success: true, message: 'Account deleted successfully.' });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to delete account.' });
    }
  });

  // --- ADMIN SYSTEM MANAGEMENT (OVERVIEW, USERS, AUDIT LOGS, CHANGE PASSWORD) ---

  // Admin Dashboard Overview Metrics
  app.get('/api/admin/overview-stats', requireAdmin, (_req: Request, res: Response) => {
    const allUsers = db.listAllUsers();
    const allBookings = db.getBookingsForUser(null);
    const hotels = db.listPartnerAccounts('HOTEL_ADMIN');
    const agencies = db.listPartnerAccounts('TRAVEL_ADMIN');
    const auditLogs = db.getAuditLogs().slice(0, 15);

    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter((u) => u.isActive !== false).length;
    const totalHotels = hotels.length;
    const totalAgencies = agencies.length;
    const totalBookings = allBookings.length;
    const totalRevenue = allBookings
      .filter((b) => b.status === 'Confirmed')
      .reduce((sum, b) => sum + (b.pricing?.total || b.finalTotal || 0), 0);

    res.json({
      totalUsers,
      activeUsers,
      totalHotels,
      totalAgencies,
      totalBookings,
      totalRevenue,
      recentAuditLogs: auditLogs,
    });
  });

  // List All Platform Users (Admin Only)
  app.get('/api/admin/users', requireAdmin, (_req: Request, res: Response) => {
    const users = db.listAllUsers();
    res.json({ users });
  });

  // Toggle Customer User Status (Admin Only)
  app.put('/api/admin/users/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      res.status(400).json({ error: 'Status (isActive boolean) is required.' });
      return;
    }

    try {
      const updated = db.setPartnerStatus(id, isActive);
      const { passwordHash, ...safeUser } = updated;
      res.json({
        success: true,
        message: `User status updated to ${isActive ? 'Active' : 'Disabled'}.`,
        user: safeUser,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update user status.' });
    }
  });

  // Delete User Account (Admin Only)
  app.delete('/api/admin/users/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      db.deleteUserAccount(id);
      res.json({ success: true, message: 'User account deleted successfully.' });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to delete user account.' });
    }
  });

  // Get Audit Logs (Admin Only)
  app.get('/api/admin/audit-logs', requireAdmin, (_req: Request, res: Response) => {
    const logs = db.getAuditLogs();
    res.json({ logs });
  });

  // Admin Change Own Password (Admin Only)
  app.post('/api/admin/change-password', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters long.' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }

    try {
      db.changeUserPassword(req.user.id, newPassword);
      res.json({ success: true, message: 'Admin password changed successfully.' });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to change password.' });
    }
  });

  // --- REAL-TIME ROUTING & TELEMETRY ---

  app.get('/api/route/calculate', async (req: Request, res: Response) => {
    const fromCity = (req.query.from as string) || 'Hyderabad';
    const toCity = (req.query.to as string) || 'Delhi';

    try {
      const telemetry = await computeRouteDistanceAsync(fromCity, toCity);
      res.json(telemetry);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to calculate route', details: err.message });
    }
  });

  // Weather Endpoint
  app.get('/api/weather', async (req: Request, res: Response) => {
    const city = req.query.city as string;
    const lat = req.query.lat ? Number(req.query.lat) : undefined;
    const lng = req.query.lng ? Number(req.query.lng) : undefined;

    let weather;
    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      weather = await fetchLiveWeather({ lat, lng, city: city || 'Current Location' });
    } else if (city && city.trim()) {
      weather = await fetchLiveWeather(city.trim());
    } else {
      res.status(400).json({ error: 'Please specify city or location coordinates.' });
      return;
    }

    if (!weather) {
      res.status(404).json({ error: 'Weather is not available right now.' });
      return;
    }

    res.json(weather);
  });

  // Dynamic Fleet Search
  app.get('/api/fleet', async (req: Request, res: Response) => {
    const fromCity = (req.query.from as string) || 'Hyderabad';
    const toCity = (req.query.to as string) || 'Delhi';

    try {
      const fleet = await getDynamicFleetAsync(fromCity, toCity);
      res.json({ fleet });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch fleet', details: err.message });
    }
  });

  // Destination Hotels
  app.get('/api/hotels', (req: Request, res: Response) => {
    const city = (req.query.city as string) || 'Delhi';
    const hotels = getDestinationHotels(city);
    res.json({ hotels });
  });

  // Route Food Stops
  app.get('/api/pitstops', async (req: Request, res: Response) => {
    const fromCity = (req.query.from as string) || 'Hyderabad';
    const toCity = (req.query.to as string) || 'Delhi';

    try {
      const pitstops = await getCorridorPitstopsAsync(fromCity, toCity);
      res.json({ pitstops });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch food stops', details: err.message });
    }
  });

  // --- BOOKINGS & STRICT DATA ISOLATION ---

  // List Bookings (Enforces role-based isolation)
  app.get('/api/bookings', (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    if (user && user.isActive === false) {
      res.status(403).json({ error: 'Your account has been disabled. Please contact the administrator.' });
      return;
    }
    const bookings = db.getBookingsForUser(user);
    res.json({
      bookings,
      role: user?.role || 'PUBLIC',
      scope: user?.hotelName || user?.agencyName || 'All Bookings',
    });
  });

  // Get Single Booking
  app.get('/api/bookings/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const user = getAuthenticatedUser(req);
    if (user && user.isActive === false) {
      res.status(403).json({ error: 'Your account has been disabled. Please contact the administrator.' });
      return;
    }
    const booking = db.getBookingById(id, user);

    if (!booking) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }
    res.json({ booking });
  });

  // Token Verification
  app.post('/api/tokens/verify', (req: Request, res: Response) => {
    const { tokenId } = req.body;
    if (!tokenId || typeof tokenId !== 'string') {
      res.status(400).json({ error: 'Registration Token ID is required' });
      return;
    }

    const cleanToken = tokenId.trim();
    const user = getAuthenticatedUser(req);
    if (user && user.isActive === false) {
      res.status(403).json({ error: 'Your account has been disabled. Please contact the administrator.' });
      return;
    }

    const booking = db.getBookingById(cleanToken, user);

    if (!booking) {
      res.status(404).json({ valid: false, error: 'Registration Token ID not found in system.' });
      return;
    }

    if (user?.role === 'HOTEL_ADMIN') {
      if (!booking.hotel || (booking.hotel.id !== user.hotelId && booking.hotel.name !== user.hotelName)) {
        res.json({
          valid: false,
          error: `Token ID ${cleanToken} does not belong to ${user.hotelName || 'this hotel'}.`,
        });
        return;
      }
    }

    res.json({
      valid: true,
      booking,
      message: 'Registration Token ID verified successfully.',
    });
  });

  // Create Booking
  app.post('/api/bookings', (req: Request, res: Response) => {
    const payload = req.body as Partial<Booking>;

    if (!payload.from || !payload.to || !payload.vehicle || !payload.user?.fullName) {
      res.status(400).json({ error: 'Please provide all required trip details.' });
      return;
    }

    const tokenChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let tokenSuffix = '';
    for (let i = 0; i < 5; i++) {
      tokenSuffix += tokenChars.charAt(Math.floor(Math.random() * tokenChars.length));
    }
    const bookingId = payload.id || `TGAI-BKG-2026-${tokenSuffix}`;
    const journeyToken = payload.journeyToken || `TGAI-JRN-2026-${tokenSuffix}`;
    const user = getAuthenticatedUser(req);
    const userId = user?.id || payload.userId || payload.user?.userId || `TGAI-USER-${tokenSuffix}`;
    const numberOfPeople = Math.max(1, payload.numberOfPeople || payload.user?.numberOfPeople || payload.user?.travelersCount || payload.travelers || 1);

    const carCost = payload.carCost || payload.pricing?.carCost || payload.pricing?.vehicleCost || payload.vehicle.price || 0;
    const hotelCost = payload.hotelTotal || payload.pricing?.hotelCost || (payload.hotel ? payload.hotel.pricePerNight * (payload.hotelNights || 1) : 0);
    const foodCost = payload.foodTotal || payload.pricing?.foodCost || payload.pricing?.pitstopCost || 0;
    const serviceFee = payload.serviceFee || payload.pricing?.serviceFee || 500;
    const tax = payload.tax || payload.pricing?.tax || 0;
    const finalTotal = payload.finalTotal || payload.pricing?.finalTotal || payload.pricing?.total || (carCost + hotelCost + foodCost + serviceFee + tax);

    const qrPayload = JSON.stringify({
      bookingId,
      journeyToken,
      userId,
      traveler: payload.user.fullName,
      phone: payload.user.phone,
      route: `${payload.from} to ${payload.to}`,
      vehicle: payload.vehicle.name,
      hotel: payload.hotel ? `${payload.hotel.name} (${payload.hotelNights || 1} Nights)` : 'No Hotel (Transit)',
      numberOfPeople,
      total: `₹${finalTotal.toLocaleString('en-IN')}`,
      status: 'CONFIRMED',
      timestamp: new Date().toISOString(),
    });

    const newBooking: Booking = {
      id: bookingId,
      bookingId,
      journeyToken,
      userId,
      from: payload.from,
      to: payload.to,
      distanceKm: payload.distanceKm || 0,
      durationText: payload.durationText || '',
      travelDate: payload.travelDate || new Date().toISOString().split('T')[0],
      travelTime: payload.travelTime || '08:00 AM',
      returnDate: payload.returnDate,
      numberOfPeople,
      vehicle: payload.vehicle,
      hotel: payload.hotel || null,
      hotelNights: payload.hotelNights || 0,
      pitstops: payload.pitstops || [],
      selectedFoodItems: payload.selectedFoodItems || [],
      user: payload.user,
      pricing: {
        vehicleCost: carCost,
        carCost,
        hotelCost,
        foodCost,
        pitstopCost: foodCost,
        numberOfPeople,
        serviceFee,
        tax,
        finalTotal,
        total: finalTotal,
      },
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      qrPayload,
    };

    const saved = db.createBooking(newBooking);
    res.status(201).json({ success: true, booking: saved });
  });

  // Update Booking Status
  app.put('/api/bookings/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = getAuthenticatedUser(req);

    if (user && user.isActive === false) {
      res.status(403).json({ error: 'Your account has been disabled. Please contact the administrator.' });
      return;
    }

    if (!['Confirmed', 'Pending', 'Cancelled'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    try {
      const ok = db.updateBookingStatus(id, status);
      if (!ok) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }
      res.json({ success: true, status });
    } catch (err: any) {
      res.status(403).json({ error: err.message || 'Unauthorized action' });
    }
  });

  // Cancel Booking
  app.delete('/api/bookings/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const user = getAuthenticatedUser(req);

    if (user && user.isActive === false) {
      res.status(403).json({ error: 'Your account has been disabled. Please contact the administrator.' });
      return;
    }

    try {
      const ok = db.deleteBooking(id);
      if (!ok) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(403).json({ error: err.message || 'Unauthorized action' });
    }
  });

  // Metrics Endpoint
  app.get('/api/admin/metrics', (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    if (user && user.isActive === false) {
      res.status(403).json({ error: 'Your account has been disabled. Please contact the administrator.' });
      return;
    }

    const bookings = db.getBookingsForUser(user);

    const totalCount = bookings.length;
    const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
    const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;
    const revenue = bookings
      .filter((b) => b.status === 'Confirmed')
      .reduce((sum, b) => sum + (b.pricing?.total || 0), 0);

    res.json({
      role: user?.role || 'MAIN_ADMIN',
      scope: user?.hotelName || user?.agencyName || 'All Bookings',
      totalCount,
      confirmedCount,
      cancelledCount,
      revenue,
      avgOrderValue: confirmedCount > 0 ? Math.round(revenue / confirmedCount) : 0,
    });
  });

  // --- ADMIN PARTNER REQUESTS ---

  app.post('/api/admin/requests', (req: Request, res: Response) => {
    const { businessName, ownerName, phone, email, address, businessType, notes } = req.body;
    if (!businessName || !ownerName || !phone || !email || !address || !businessType) {
      res.status(400).json({ error: 'All fields are required to submit an admin partnership request.' });
      return;
    }

    try {
      const request = db.createAdminRequest({
        businessName,
        ownerName,
        phone,
        email,
        address,
        businessType,
        notes,
      });
      res.status(201).json({ success: true, request });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to submit request' });
    }
  });

  app.get('/api/admin/requests', requireAdmin, (_req: Request, res: Response) => {
    const requests = db.getAdminRequests();
    res.json({ requests });
  });

  app.post('/api/admin/requests/:id/approve', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const { customEmail, customPassword, temporaryPassword } = req.body;

    try {
      const pass = customPassword || temporaryPassword;
      const result = db.approveAdminRequest(id, { customEmail, customPassword: pass });
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Approval failed' });
    }
  });

  app.post('/api/admin/requests/:id/reject', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const ok = db.rejectAdminRequest(id);
    res.json({ success: ok });
  });

  // Vite SSR / Static Asset Handler
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }

      try {
        let template = await vite.transformIndexHtml(url, '');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 TourGuide AI Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
