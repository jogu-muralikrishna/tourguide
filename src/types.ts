export * from './types/travel';
export * from './types/admin';

export type DataStatus = 'LIVE' | 'VERIFIED' | 'ESTIMATED' | 'SAMPLE';

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export type TransportCategory = 'car' | string;

export type VehicleCategory = 'car' | 'Sedan' | 'SUV' | 'Premium SUV' | 'Luxury Car' | string;

export interface DriverInfo {
  name: string;
  phone: string;
  rating: number;
  tripsCount: number;
  experienceYears: number;
  image?: string;
  avatar?: string;
  licenseNumber?: string;
  clearanceLevel?: string;
  title?: string;
  experience?: string;
  languages?: string[];
  badges?: string[];
  bio?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  category: TransportCategory;
  categoryLabel?: string;
  subtitle?: string;
  carType: 'Sedan' | 'SUV' | 'Premium SUV' | 'Luxury Car' | string;
  price: number;
  priceUnit?: string;
  travelTime: string;
  distanceKm: number;
  specs: any;
  image: string;
  seats: number;
  luggage: string;
  tag?: string;
  features: string[];
  estimatedPriceNotice?: string;
  rating?: number;
  reviewsCount?: number;
  driver?: DriverInfo;
  passengers?: number;
  topSpeed?: string;
  luxuryClass?: string;
  range?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  pricePerPerson: number;
  category?: string;
  description?: string;
  isVeg?: boolean;
}

export interface SelectedFoodItem {
  id: string;
  foodItemId: string;
  name: string;
  pricePerPerson: number;
  quantity: number; // default 1
  people: number;
  total: number; // pricePerPerson * people * quantity
  restaurantId?: string;
  restaurantName?: string;
  isVeg?: boolean;
}

export interface Pitstop {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  category?: string;
  duration?: string;
  cuisineOrType?: string;
  priceRange?: string;
  price: number; // default avg price per person
  estimatedCost?: number;
  cost?: number;
  rating: number;
  image: string;
  tags?: string[];
  estimatedStopover?: string;
  description?: string;
  contact?: string;
  menuItems?: FoodItem[];
  speciality?: string;
  type?: string;
}

export interface Hotel {
  id: string;
  name: string;
  category?: 'luxury' | 'resort' | 'boutique' | 'budget' | string;
  location: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviewsCount?: number;
  pricePerNight?: number;
  currency?: string;
  available?: boolean;
  availability?: boolean;
  amenities?: string[];
  contact?: string;
  image?: string;
  roomType?: string;
  suiteType?: string;
  badge?: string;
  distanceFromCenter?: string;
  cancellationPolicy?: string;
  bookingUrl?: string;
  source?: string;
  dataStatus?: DataStatus;
  lastUpdated?: string;
  architectVerified?: boolean;
  starRating?: number;
  description?: string;
}

export type SanctuaryHotel = Hotel;

export interface WeatherData {
  city: string;
  temp?: number;
  tempC?: number;
  tempF?: number;
  feelsLikeC?: number;
  condition: string;
  icon?: string;
  iconType?: 'sun' | 'cloud' | 'rain' | 'snow' | 'wind' | string;
  visibility?: string;
  visibilityKm?: number;
  humidity?: number;
  windSpeed?: string;
  high?: number;
  low?: number;
  uvIndex?: number;
  rainProbability?: number;
  latitude?: number;
  longitude?: number;
  forecast?: Array<{
    day: string;
    date: string;
    tempC: number;
    temp?: number;
    condition: string;
    rainProbability: number;
  }>;
  dataStatus?: DataStatus;
  source?: string;
  lastUpdated?: string;
}

export interface UserProfile {
  id?: string;
  name?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  numberOfPeople?: number;
  travelersCount?: number;
  startDate?: string;
  startTime?: string;
  specialRequests?: string;
  preferredCurrency?: string;
  preferredLanguage?: string;
  role?: UserRole | string;
  travelPreferences?: any;
  isGuest?: boolean;
  createdAt?: string;
}

export interface UserData {
  userId?: string;
  fullName: string;
  phone: string;
  email: string;
  specialRequests?: string;
  numberOfPeople?: number;
  travelersCount?: number;
  travelDate?: string;
  travelTime?: string;
  returnDate?: string;
  isVerified?: boolean;
}

export interface TravelerInfo {
  fullName: string;
  phone: string;
  email: string;
  numberOfPeople: number;
  travelersCount?: number;
  startDate?: string;
  startTime?: string;
  travelDate?: string;
  travelTime?: string;
  specialRequests?: string;
  contactPhone?: string;
}

export interface PricingDetails {
  carCost?: number;
  vehicleCost?: number;
  vehiclePrice?: number;
  hotelCost?: number;
  hotelNights?: number;
  hotelPricePerNight?: number;
  hotelPrice?: number;
  foodCost?: number;
  pitstopCost?: number;
  foodPrice?: number;
  selectedFoodItems?: SelectedFoodItem[];
  numberOfPeople?: number;
  serviceFee: number;
  tax?: number;
  taxes?: number;
  taxesAndFees?: number;
  finalTotal?: number;
  total: number;
  currency?: string;
  baseCost?: number;
  isEstimated?: boolean;
}

export type BookingPricing = PricingDetails;

export interface PricingBreakdown {
  vehicleFare: number;
  sanctuaryCost: number;
  pitstopCost: number;
  taxes: number;
  total: number;
}

export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'PLANNED' | 'COMPLETED' | 'DRAFT' | 'ACTIVE' | string;
export type TripStatus = 'PLANNED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'Confirmed' | 'Pending' | 'Cancelled' | 'ACTIVE' | string;

export interface Booking {
  id: string; // Booking ID or Journey Token
  bookingId?: string; // e.g. TGAI-BKG-2026-83921
  journeyToken?: string; // e.g. TGAI-JRN-2026-92K81
  userId?: string; // e.g. TGAI-USER-82F4K91
  tripId?: string;
  timestamp?: string;
  from?: string;
  to?: string;
  origin?: string;
  destination?: string;
  routeData?: RouteData;
  route?: any;
  distanceKm?: number;
  durationText?: string;
  travelDate?: string;
  travelTime?: string;
  returnDate?: string;
  startDate?: string;
  endDate?: string;
  travelDates?: any;
  numberOfPeople?: number;
  travelers?: number;
  traveler?: any;
  vehicle?: Vehicle;
  carCost?: number;
  hotel?: Hotel | null;
  hotelNights?: number;
  hotelPricePerNight?: number;
  hotelTotal?: number;
  checkInDate?: string;
  checkOutDate?: string;
  pitstops?: Pitstop[];
  selectedFoodItems?: SelectedFoodItem[];
  foodTotal?: number;
  user?: UserData;
  pricing?: PricingDetails;
  serviceFee?: number;
  tax?: number;
  finalTotal?: number;
  transitId?: string;
  totalCost?: number;
  budget?: number;
  currency?: string;
  travelStyle?: string;
  interests?: string[];
  transportPreference?: string;
  personalNotes?: string;
  optimizationMode?: string;
  title?: string;
  itinerary?: any;
  transportation?: any;
  selectedVehicle?: Vehicle | null;
  selectedHotel?: Hotel | null;
  selectedPitstops?: Pitstop[];
  hotels?: Hotel[];
  mode?: string;
  budgetBreakdown?: BudgetBreakdown;
  bookingStatus?: string;
  paymentStatus?: string;
  reservationType?: string;
  isDemoReservation?: boolean;
  provider?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  activeBookingId?: string;
  contactPhone?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
  qrPayload?: string;
  tripToken?: string;
  assignedRoomNumber?: string;
  driverName?: string;
  driverPhone?: string;
  completedAt?: string;
  reviewSubmitted?: boolean;
}

export type Trip = Booking;

export interface AdminRequest {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  businessType: 'HOTEL_ADMIN' | 'TRAVEL_ADMIN';
  notes?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  assignedHotelId?: string;
  assignedHotelName?: string;
  assignedAgencyId?: string;
  assignedAgencyName?: string;
  generatedCredentials?: {
    email: string;
    temporaryPassword?: string;
  };
}

export interface ChatMessageType {
  id: string;
  sender: 'user' | 'sage' | 'system';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export type ChatMessage = ChatMessageType;

export interface RouteSuggestion {
  from: string;
  to: string;
  popularLabel: string;
  estimatedHours: string;
  distanceKm: number;
}

export interface RouteCoordinate {
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  name?: string;
  state?: string;
  country?: string;
}

export interface RouteData {
  origin: string;
  destination: string;
  originCoordinates: RouteCoordinate;
  destinationCoordinates: RouteCoordinate;
  distanceMeters: number;
  distanceKm: number;
  distanceMiles?: number;
  durationSeconds: number;
  durationText: string;
  carEstimatedHours: string;
  trainEstimatedHours: string;
  busEstimatedHours: string;
  highwayCorridor: string;
  routeGeometry?: [number, number][]; // [lng, lat]
  success: boolean;
  error?: string;
  eta?: string;
  isConfirmed?: boolean;
  weather?: any;
}

export type RouteState = RouteData;

export interface TravelContext {
  from?: string;
  to?: string;
  origin?: any;
  travelDate?: string;
  travelDates?: any;
  startDate?: string;
  endDate?: string;
  numberOfPeople?: number;
  travelers?: number;
  travelerNames?: string[];
  routeData?: RouteData;
  vehicle?: Vehicle;
  hotel?: Hotel;
  pitstops?: Pitstop[];
  pricing?: PricingDetails;
  currentStep?: number;
  tripId?: string;
  currency?: string;
  destination?: any;
  weather?: WeatherData;
  itinerary?: DailyItineraryItem[];
  budgetStatus?: any;
  budget?: number;
  bookings?: Booking[];
  attractions?: any[];
  restaurants?: any[];
  hotels?: Hotel[];
  transportOptions?: any[];
  selectedTransport?: any;
  selectedHotels?: any[];
  selectedPlaces?: any[];
  currentLocation?: any;
  currentLocationName?: string;
  currentDateTime?: string;
  tripMode?: string;
  user?: any;
}

export interface CopilotAction {
  id: string;
  type?: string;
  label?: string;
  title?: string;
  description?: string;
  toolType?: string;
  payload?: any;
  permissionLevel?: string;
  requiresConfirmation?: boolean;
  status?: string;
}

export interface DailyItineraryItem {
  day?: number;
  dayNumber?: number;
  title?: string;
  description?: string;
  places?: any[];
  activities?: any[];
  estimatedCost: number;
  weatherOverview?: string;
  weatherNote?: string;
  transportTip?: string;
  date?: string;
  morningActivity?: string;
  afternoonActivity?: string;
  eveningActivity?: string;
  recommendedFood?: string;
  approxDistance?: string;
  travelTime?: string;
  dataStatus?: DataStatus;
  source?: string;
}

export interface PostTripSummary {
  tripId?: string;
  title?: string;
  destination?: string;
  durationDays?: number;
  placesVisitedCount?: number;
  culinaryVisitedCount?: number;
  currency?: string;
  recordedSpent?: number;
  plannedBudget?: number;
  totalDistanceKm?: number;
  totalSpent?: number;
  highlights?: string[];
  foodHighlights?: string[];
  memoriesNotes?: string;
  memoriesCount?: number;
  photosCount?: number;
  rating?: number;
  feedback?: string;
  favoriteActivities?: any[];
  recommendedNextDestinations?: any[];
}

export interface BudgetBreakdown {
  transport?: number;
  transportation?: number;
  transportationStatus?: string;
  localTransport?: number;
  localTransportStatus?: string;
  stay?: number;
  accommodation?: number;
  accommodationStatus?: string;
  food?: number;
  foodStatus?: string;
  activities?: number;
  activitiesStatus?: string;
  buffer?: number;
  emergencyBuffer?: number;
  emergencyBufferStatus?: string;
  totalLiveAmount?: number;
  totalEstimatedAmount?: number;
  total: number;
}

export interface TripPlanResponse {
  tripId?: string;
  origin?: string;
  destination: string;
  originCoordinates?: GeoCoordinates;
  destinationCoordinates?: GeoCoordinates;
  days?: number | DailyItineraryItem[];
  duration?: string | number;
  itinerary?: DailyItineraryItem[];
  totalEstimatedBudget?: number;
  estimatedBudget?: number;
  budgetBreakdown: BudgetBreakdown;
  travelTips?: string[];
  tips?: any[];
  warnings?: any[];
  weatherForecast?: WeatherData[];
  culturalEtiquette?: string[];
  safetyScore?: number;
  dataStatus?: DataStatus;
  source?: string;
  dataSource?: string;
  currency?: string;
  tripSummary?: string;
  transportation?: any;
  hotels?: any[];
  activities?: any[];
  restaurants?: any[];
  weatherInfo?: WeatherData;
  optimizationMode?: string;
  isOverBudget?: boolean;
  overBudgetAmount?: number;
  lastUpdated?: string;
}

export interface EmergencyFacility {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'POLICE' | 'HIGHWAY_HELP' | 'MECHANIC' | string;
  distance?: string;
  distanceKm?: number;
  phone?: string;
  contact?: string;
  address: string;
  location?: GeoCoordinates;
  coordinates?: GeoCoordinates;
  isOpen24x7?: boolean;
  isOpen24h?: boolean;
}

export interface AppEvent {
  type: string;
  payload?: any;
  timestamp?: string;
}

export interface GroupExpense {
  id: string;
  tripId?: string;
  title: string;
  amount: number;
  paidBy: string;
  splitAmong?: string[];
  splitBetween?: string[];
  date: string;
  category: string;
  currency?: string;
  notes?: string;
}

export interface DebtSettlement {
  from: string;
  to: string;
  amount: number;
  currency?: string;
}

export type TravelStyle = 'SOLO' | 'COUPLE' | 'FAMILY' | 'FRIENDS' | 'BUSINESS' | string;
export type TransportPreference = 'CHARIOT' | 'SELF_DRIVE' | 'PUBLIC' | 'FLIGHT' | string;
export type OptimizationMode = 'BALANCED' | 'BUDGET' | 'LUXURY' | 'SPEED' | 'SCENIC' | string;

export interface TripPlanRequest {
  origin: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  travelDates?: string | { start: string; end: string };
  durationDays?: number;
  numberOfTravelers?: number;
  travelers?: number;
  budget?: number;
  currency?: string;
  personalNotes?: string;
  travelStyle?: TravelStyle;
  budgetLevel?: 'BUDGET' | 'BALANCED' | 'LUXURY' | string;
  interests?: string[];
  transportPreference?: TransportPreference;
  optimizationMode?: OptimizationMode;
}

export interface StartupMetrics {
  totalRevenue?: number;
  activeBookings?: number;
  hotelPartners?: number;
  travelAgencies?: number;
  customerSatisfaction?: number;
  monthlyGrowth?: number;
  conversionRate?: number;
  bookingConversionRate?: number;
  totalUsers?: number;
  tripsCreated?: number;
  tripsCompleted?: number;
  reservationsRequested?: number;
  reservationsConfirmed?: number;
  reservationsCancelled?: number;
  averageTripBudget?: number;
  potentialPlatformRevenue?: number;
  actualRevenue?: number;
  popularDestinations?: any[];
  popularTravelStyles?: any[];
}

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO' | 'IMPORTANT';
export type AlertType = 'WEATHER' | 'TRAFFIC' | 'SAFETY' | 'BOOKING' | 'SYSTEM' | 'BUDGET';

export interface TravelAlert {
  id: string;
  title: string;
  severity: AlertSeverity;
  type: AlertType;
  message: string;
  timestamp?: string;
  createdAt?: string;
  read?: boolean;
  location?: string;
  actionRequired?: boolean;
  actionLink?: string;
  actionLabel?: string;
}

export type UserRole = 'SUPER_ADMIN' | 'SUB_ADMIN' | 'HOTEL_ADMIN' | 'AGENCY_ADMIN' | 'CUSTOMER' | 'USER' | 'ADMIN' | 'GUEST';

export interface RevenueRecord {
  id: string;
  tripId?: string;
  bookingId: string;
  amount?: number;
  grossValue?: number;
  platformCommission?: number;
  partnerCommission?: number;
  serviceFee?: number;
  refundAmount?: number;
  netRevenue?: number;
  date?: string;
  timestamp?: string;
  source?: string;
  partnerType?: string;
  commissionAmount?: number;
  userId?: string;
  currency?: string;
  isSimulated?: boolean;
  status?: string;
}
