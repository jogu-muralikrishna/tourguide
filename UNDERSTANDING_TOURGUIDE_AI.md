# Detailed Technical & Feature Overview of TOURGUIDE AI

## 1. Executive Summary

**TOURGUIDE AI** is a full-stack, AI-powered **Personal Travel Copilot and Real-Time Travel Management Platform**. Designed for modern travelers, it combines generative AI (powered by Google Gemini), interactive geospatial mapping (Leaflet), real-time navigation telemetry, multi-modal transport comparison, hotel bookings, group expense management, proactive weather/traffic safety alerts, voice interaction, and an emergency SOS locator.

The application allows users to plan a custom trip in an intuitive 8-step wizard or interact directly with an AI Travel Assistant to build tailored day-by-day itineraries, optimize routes based on budget/experience preferences, split group costs seamlessly, and track active journeys in a live "cockpit" mode.

---

## 2. Technology Stack & Architecture

### Frontend
- **Framework**: React 19 with TypeScript and Vite 6.
- **Styling**: Tailwind CSS v4 with custom dark mode & modern glassmorphic UI elements.
- **Iconography & Visual Effects**: Lucide React icons, Framer Motion (Framer v12), Canvas Confetti for booking celebrations.
- **Mapping & Geocoding**: Leaflet & React-Leaflet with OpenStreetMap layers and built-in geodetic location fallback registries.
- **Voice Capabilities**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) integrated into an AI Copilot interface.

### Backend
- **Server Environment**: Node.js with Express.js running TypeScript via `tsx` dev executor and `esbuild` for production builds.
- **AI Engine**: **Google GenAI SDK (`@google/genai`)** utilizing Gemini models (e.g. Gemini 2.5 Flash / Pro) for structured itinerary generation, natural language travel advice, and real-time copilot tool execution.
- **Telemetry & Monitoring**: Built-in in-memory Audit Log, Latency Tracking, Cache Management, and Admin Terminal endpoints.

---

## 3. Core Features & Capabilities

### 🗺️ 1. 8-Step Interactive Trip Planning Wizard
The core user flow guides the traveler step-by-step through designing and executing their ideal journey:

1. **Step 1: AI Itinerary & Preferences (`StepAiItinerary.tsx`)**
   - Inputs: Origin, Destination, Travel Dates, Traveler Count, Budget, Currency, Travel Style (e.g., Balanced, Luxury, Budget, Adventure), Interests, and Optimization Mode.
   - Generates structured day-by-day activities, estimated costs, recommended places to visit, and local travel tips via Google Gemini API.

2. **Step 2: Route & Transport Comparison (`StepRoute.tsx`)**
   - Compares travel options across 4 modes: **Flight**, **Train**, **Drive**, and **Bus**.
   - Displays estimated duration, ticket/fuel prices, carbon footprint (kg CO₂), and route maps.

3. **Step 3: Tactical Map View (`StepTacticalMap.tsx`)**
   - Full interactive map showing origin-destination polylines, waypoints, pitstops, and nearby hotel markers with filter controls.

4. **Step 4: Pitstops & Waypoints (`StepPitstops.tsx`)**
   - Option to select food stops, fuel stations, scenic viewpoints, rest areas, and cultural attractions along the travel route.

5. **Step 5: Chariot / Transport Selection (`StepChariot.tsx`)**
   - Pick specific transport options (e.g., SUV rental, EV, Luxury Sedan, Flight, Train class) with detailed vehicle specs, mileage, and features.

6. **Step 6: Sanctuary / Hotel Bookings (`StepSanctuary.tsx`)**
   - Browse curated accommodations with filter options (Price, Rating, Amenities), photo galleries, night selection, and instant hotel booking.

7. **Step 7: Registration & Traveler Details (`StepRegistration.tsx`)**
   - Lead traveler profile, contact info, ID/Passport details, emergency contact numbers, dietary restrictions, and special requests.

8. **Step 8: Command Center & Booking Summary (`StepCommandCenter.tsx` & `FinalTicket.tsx`)**
   - Complete itemized breakdown (Transport + Hotels + Experiences), downloadable digital boarding ticket/voucher, confetti celebration, and direct trip saving.

---

### 🎙️ 2. Gemini AI Travel Assistant & Voice Copilot (`Chatbot.tsx`, `copilotService.ts`)
- **Conversational AI**: Powered by Gemini for answering complex travel queries, recommending local restaurants, explaining cultural etiquette, or revising itineraries.
- **Voice Interaction**: Integrated microphone voice input (Speech-to-Text) and natural audio readout (Text-to-Speech).
- **Tool Execution / Function Calling**: Capable of executing commands like adding pitstops, looking up emergency contacts, calculating currency conversions, or checking weather alerts.

---

### 🚘 3. Live Travel Mode Cockpit (`LiveTravelModeModal.tsx`)
- **Real-Time Navigation HUD**: Simulates active journey tracking with live speed gauges, distance remaining, ETA, and turn-by-turn guidance.
- **Live Telemetry**: Weather widget, upcoming pitstop notifications, voice navigation announcements, and quick SOS access.

---

### 💸 4. Group Expense Splitting (`GroupExpenseModal.tsx`, `expenseService.ts`)
- **Shared Budgeting**: Add group trip expenses, select who paid, and choose who shares the cost.
- **Automatic Calculation**: Calculates net balances for each group member, suggests optimal settlement payments, and supports multi-currency options.

---

### 🆘 5. Emergency SOS & Safety Hub (`EmergencyModal.tsx`, `emergencyService.ts`)
- **One-Tap Emergency Broadcast**: Instantly broadcasts user location to emergency contacts.
- **Local Helpline Directory**: Quick access to Police, Medical Ambulance, Fire Department, Tourist Police, and Embassy hotlines based on current destination country/state.
- **Nearby Rescue Finder**: Locates the nearest hospitals, police stations, and medical clinics.

---

### 🔔 6. Proactive Travel Alerts (`TravelAlertsDrawer.tsx`, `alertService.ts`)
- Monitors active trip conditions to alert travelers about weather disruptions, flight delays, traffic detours, and upcoming schedule items.

---

### 🛠️ 7. Admin Terminal & System Telemetry (`AdminTerminal.tsx`, `adminService.ts`, `server.ts`)
- Built-in developer dashboard monitoring:
  - Gemini API status and latency distribution.
  - Audit log entries for API requests (`SUCCESS`, `WARNING`, `FALLBACK`).
  - Cache hit rates and request counters.
  - System memory and health metrics.

---

### 👤 8. User Profile & Saved Trips (`MyTripsModal.tsx`, `UserAuthModal.tsx`, `PostTripModal.tsx`)
- Simple authentication flow to log in/sign up.
- Save multiple upcoming or past trips.
- Post-trip summary modal to rate trips, store travel memories, and upload trip photos.

---

## 4. File & Folder Structure Overview

```
tourguide-ai/
├── server.ts                 # Express backend server with Gemini API endpoints, audit logging, & geocoding
├── package.json              # Project dependencies (@google/genai, react, vite, express, leaflet, motion)
├── metadata.json             # Application metadata configuration
├── index.html                # HTML entry point with Leaflet CSS link
├── src/
│   ├── App.tsx               # Main application component & step management state
│   ├── main.tsx              # React DOM root entry point
│   ├── index.css             # Tailwind CSS styles & animations
│   ├── types.ts              # Core TypeScript interfaces (Trip, Vehicle, Hotel, Expense, Alert, User)
│   ├── components/           # UI Components
│   │   ├── Navbar.tsx        # Header with navigation, step status, profile, alerts & live mode buttons
│   │   ├── Hero.tsx          # Landing section with quick search bar
│   │   ├── StepAiItinerary.tsx # Step 1: AI Itinerary builder
│   │   ├── StepRoute.tsx     # Step 2: Route & transport selector
│   │   ├── StepTacticalMap.tsx # Step 3: Interactive Leaflet map
│   │   ├── StepPitstops.tsx  # Step 4: Waypoints & pitstops selection
│   │   ├── StepChariot.tsx   # Step 5: Vehicle & transport option picker
│   │   ├── StepSanctuary.tsx # Step 6: Accommodation selector
│   │   ├── StepRegistration.tsx # Step 7: Passenger registration form
│   │   ├── StepCommandCenter.tsx # Step 8: Final review & booking confirmation
│   │   ├── FinalTicket.tsx   # Digital ticket / voucher preview
│   │   ├── LiveTravelModeModal.tsx # Live GPS HUD & navigation cockpit
│   │   ├── GroupExpenseModal.tsx # Expense split & balance calculator
│   │   ├── EmergencyModal.tsx# One-tap SOS & local emergency contacts
│   │   ├── TravelAlertsDrawer.tsx # Notification side-drawer for safety/weather alerts
│   │   ├── Chatbot.tsx       # AI Copilot floating panel with voice support
│   │   ├── AdminTerminal.tsx # System telemetry & audit log dashboard
│   │   ├── MyTripsModal.tsx  # Saved trips drawer
│   │   ├── UserAuthModal.tsx # User login / sign-up modal
│   │   ├── PostTripModal.tsx # Trip memory & review modal
│   │   └── Footer.tsx        # Application footer
│   ├── services/             # API & Business Logic Services
│   │   ├── geminiService.ts  # Interfaces with server / Gemini API for trip plans
│   │   ├── copilotService.ts # Conversational Copilot & tool execution
│   │   ├── voiceService.ts   # Web Speech API wrapper
│   │   ├── alertService.ts   # Travel alerts generator & listener
│   │   ├── expenseService.ts # Expense splitting algorithms
│   │   ├── emergencyService.ts # Emergency data & SOS dispatcher
│   │   ├── tripService.ts    # Trip storage & state manager
│   │   ├── authService.ts    # Auth state management
│   │   ├── bookingService.ts # Booking management
│   │   └── adminService.ts   # Telemetry & server audit log consumer
│   └── data/
│       └── mockData.ts       # Curated fallback data for locations, vehicles, hotels, & pitstops
```

---

## 5. How to Run the Application

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` or `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   This launches the Express backend and Vite frontend simultaneously via `tsx server.ts`. Access the application at `http://localhost:3000`.

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 6. Summary Conclusion

The **TOURGUIDE AI** repository is a feature-packed, enterprise-ready web application showcasing how Google Gemini can be seamlessly integrated into real-world applications. By uniting AI-driven recommendations with geospatial UI, live telemetry, audio interaction, emergency safety features, and financial management tools, it delivers a comprehensive, futuristic travel planning experience.
