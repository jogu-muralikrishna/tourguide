import express, { Request, Response } from 'express';
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

  // Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'User not found or invalid email address.' });
      return;
    }

    const isMatch = db.verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Incorrect password entered.' });
      return;
    }

    const { passwordHash, ...safeUser } = user;
    res.json({
      success: true,
      user: safeUser,
      token: safeUser.email,
    });
  });

  // Register
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, password, role = 'USER', hotelId, hotelName, agencyId, agencyName } = req.body;

    if (!name || !email || !password || !phone) {
      res.status(400).json({ error: 'Name, email, phone, and password are required' });
      return;
    }

    try {
      const newUser = db.registerUser(name, email, phone, password, role, hotelId, hotelName, agencyId, agencyName);
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
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    if (!user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const { passwordHash, ...safeUser } = user;
    res.json({ user: safeUser });
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

  // Real Weather (Called only when user clicks Weather button)
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

  // Dynamic Fleet Search (Cars only)
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
    const booking = db.getBookingById(id, user);

    if (!booking) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }
    res.json({ booking });
  });

  // Token Verification Tool for Users, Hotel Admins, and Travel Agency Admins
  app.post('/api/tokens/verify', (req: Request, res: Response) => {
    const { tokenId } = req.body;
    if (!tokenId || typeof tokenId !== 'string') {
      res.status(400).json({ error: 'Registration Token ID is required' });
      return;
    }

    const cleanToken = tokenId.trim();
    const user = getAuthenticatedUser(req);
    const booking = db.getBookingById(cleanToken);

    if (!booking) {
      res.status(404).json({ valid: false, error: 'Registration Token ID not found in system.' });
      return;
    }

    // Role-specific check
    if (user?.role === 'HOTEL_ADMIN') {
      if (!booking.hotel || booking.hotel.id !== user.hotelId) {
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

  // Create Booking (Generates unique Registration Token ID)
  app.post('/api/bookings', (req: Request, res: Response) => {
    const payload = req.body as Partial<Booking>;

    if (!payload.from || !payload.to || !payload.vehicle || !payload.user?.fullName) {
      res.status(400).json({ error: 'Please provide all required trip details.' });
      return;
    }

    // Generate unique Journey Token ID (e.g. TGAI-JRN-2026-92K81)
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
      travelers: numberOfPeople,
      vehicle: payload.vehicle,
      carCost,
      hotel: payload.hotel || null,
      hotelNights: payload.hotelNights || (payload.hotel ? 1 : 0),
      hotelPricePerNight: payload.hotel ? payload.hotel.pricePerNight : 0,
      hotelTotal: hotelCost,
      checkInDate: payload.checkInDate || payload.travelDate || new Date().toISOString().split('T')[0],
      checkOutDate: payload.checkOutDate || payload.returnDate || payload.travelDate || new Date().toISOString().split('T')[0],
      pitstops: payload.pitstops || [],
      selectedFoodItems: payload.selectedFoodItems || [],
      foodTotal: foodCost,
      serviceFee,
      tax,
      finalTotal,
      user: {
        ...payload.user,
        userId,
        numberOfPeople,
        travelersCount: numberOfPeople,
      },
      pricing: payload.pricing || {
        carCost,
        vehicleCost: carCost,
        hotelCost,
        hotelNights: payload.hotelNights || (payload.hotel ? 1 : 0),
        hotelPricePerNight: payload.hotel ? payload.hotel.pricePerNight : 0,
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

    const saved = db.saveBooking(newBooking);
    res.status(201).json({ success: true, booking: saved });
  });

  // Update Booking Status
  app.put('/api/bookings/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = getAuthenticatedUser(req);

    if (!['Confirmed', 'Pending', 'Cancelled'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    try {
      const ok = db.updateBookingStatus(id, status, user);
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

    try {
      const ok = db.deleteBooking(id, user);
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
      const request = db.submitAdminRequest({
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

  app.get('/api/admin/requests', (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    if (!user || user.role !== 'MAIN_ADMIN') {
      res.status(403).json({ error: 'Only Main Admin can view partner requests.' });
      return;
    }

    const requests = db.getAdminRequests();
    res.json({ requests });
  });

  app.post('/api/admin/requests/:id/approve', (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    if (!user || user.role !== 'MAIN_ADMIN') {
      res.status(403).json({ error: 'Only Main Admin can approve requests.' });
      return;
    }

    const { id } = req.params;
    const { customEmail, customPassword, temporaryPassword, assignedHotelId, assignedHotelName, assignedAgencyId, assignedAgencyName } = req.body;

    try {
      const pass = customPassword || temporaryPassword;
      const result = db.approveAdminRequest(
        id,
        customEmail,
        pass,
        assignedHotelId,
        assignedHotelName,
        assignedAgencyId,
        assignedAgencyName
      );
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Approval failed' });
    }
  });

  app.post('/api/admin/requests/:id/reject', (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    if (!user || user.role !== 'MAIN_ADMIN') {
      res.status(403).json({ error: 'Only Main Admin can reject requests.' });
      return;
    }

    const { id } = req.params;
    try {
      const result = db.rejectAdminRequest(id);
      res.json({ success: true, request: result });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Rejection failed' });
    }
  });

  // AI Chatbot endpoint with Simple Indian English
  app.post('/api/chat', async (req: Request, res: Response) => {
    const { message, tripContext } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        const systemPrompt = `You are the friendly AI Travel Assistant for TOURGUIDE AI.
You speak in clear, polite, and simple Indian English.
Do not use complicated travel words or marketing hype.
We offer private car bookings (Sedans, SUVs, Luxury cars), hotel bookings, and food stops.

Current Trip Details:
- Starting Location: ${tripContext?.from || 'Not chosen yet'}
- Destination: ${tripContext?.to || 'Not chosen yet'}
- Calculated Distance: ${tripContext?.distanceKm || 1480} km (${tripContext?.travelTime || '18h 30m'})
- Selected Car: ${tripContext?.vehicle?.name || 'None selected'} (₹${tripContext?.vehicle?.price || 0})
- Selected Hotel: ${tripContext?.hotel ? `${tripContext.hotel.name} (${tripContext.hotelNights || 1} Nights @ ₹${tripContext.hotel.pricePerNight}/night)` : 'No hotel selected'}
- Food Stops: ${tripContext?.pitstops && tripContext.pitstops.length > 0 ? tripContext.pitstops.map((p: any) => `${p.name} (₹${p.price})`).join(', ') : 'None'}
- Total Cost: ₹${tripContext?.pricing?.total || 0}
- Weather: ${tripContext?.weather?.temp || 28}°C, ${tripContext?.weather?.condition || 'Clear'}

Guidelines:
1. Provide short, helpful, and polite answers in simple English.
2. If the user asks about cars, hotels, food stops, or pricing, answer with real numbers from the trip.
3. Keep responses under 100 words.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] },
          ],
          config: {
            temperature: 0.7,
            maxOutputTokens: 400,
          },
        });

        const reply = response.text || "How can I help you with your trip planning today?";
        res.json({ reply, source: 'gemini' });
        return;
      } catch (err: any) {
        console.warn('Gemini API call fallback:', err?.message || err);
      }
    }

    // Local Fallback Engine in Simple English
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('hotel') || lower.includes('stay') || lower.includes('room') || lower.includes('cheap') || lower.includes('price')) {
      if (lower.includes('cheapest') || lower.includes('budget') || lower.includes('lowest')) {
        reply = `For a budget-friendly stay, **Ginger Hotel** is available at **₹2,800/night**. For premium comfort, you can select **The Leela Palace** at **₹8,500/night**.`;
      } else if (tripContext?.hotel) {
        reply = `You have selected **${tripContext.hotel.name}** for **${tripContext.hotelNights || 1} night(s)**, which costs **₹${(tripContext.hotel.pricePerNight * (tripContext.hotelNights || 1)).toLocaleString('en-IN')}**. You can change your choice in Step 3.`;
      } else {
        reply = `You haven't selected a hotel yet. In Step 3, you can choose if you want a hotel stay or skip it if you are only taking a car ride.`;
      }
    } else if (lower.includes('car') || lower.includes('vehicle') || lower.includes('cab') || lower.includes('taxi') || lower.includes('suv') || lower.includes('sedan')) {
      if (tripContext?.vehicle) {
        reply = `You have selected the **${tripContext.vehicle.name}** (${tripContext.vehicle.carType}) for **₹${tripContext.vehicle.price.toLocaleString('en-IN')}**. Estimated travel time is **${tripContext.vehicle.travelTime}**.`;
      } else {
        reply = `In Step 2, you can choose from Sedans (Dzire), comfortable SUVs (Innova Crysta, XUV700, Fortuner), and Luxury Cars (Mercedes-Benz).`;
      }
    } else if (lower.includes('food') || lower.includes('dhaba') || lower.includes('eat') || lower.includes('restaurant') || lower.includes('lunch') || lower.includes('dinner')) {
      if (tripContext?.pitstops && tripContext.pitstops.length > 0) {
        reply = `You have added **${tripContext.pitstops.length} food stop(s)**: ${tripContext.pitstops.map((p: any) => p.name).join(', ')}.`;
      } else {
        reply = `In Step 4, you can choose if you would like to stop at verified highway restaurants and dhabas along the route.`;
      }
    } else if (lower.includes('weather') || lower.includes('temp') || lower.includes('rain')) {
      const dest = tripContext?.to || 'Delhi';
      reply = `You can click the **Weather** button at the top to check current live temperature and weather conditions for **${dest}**.`;
    } else if (lower.includes('total') || lower.includes('cost') || lower.includes('bill') || lower.includes('fare') || lower.includes('price')) {
      const p = tripContext?.pricing;
      reply = `**Current Trip Cost**:
• Car: ₹${p?.vehicleCost || 0}
• Hotel: ₹${p?.hotelCost || 0}
• Food Stops: ₹${p?.pitstopCost || 0}
• Service Fee: ₹${p?.serviceFee || 0}
• **Total: ₹${p?.total?.toLocaleString('en-IN') || 0}**`;
    } else {
      reply = `Hello! I am your **TOURGUIDE AI Assistant**. I can help you choose cars, hotels, food stops, or check your trip cost and route. How can I help you today?`;
    }

    res.json({ reply, source: 'local_core' });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TOURGUIDE AI Server running on port ${PORT}`);
  });
}

startServer();
