/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ProgressBar } from './components/ProgressBar';
import { LoginScreen } from './components/LoginScreen';
import { UserProfileScreen } from './components/UserProfileScreen';
import { LocationPermissionModal } from './components/LocationPermissionModal';
import { Step1Route } from './components/Step1Route';
import { Step2Fleet } from './components/Step2Fleet';
import { Step3Hotel } from './components/Step3Hotel';
import { Step4Food } from './components/Step4Food';
import { Step5Map } from './components/Step5Map';
import { Step6UserDetails } from './components/Step6UserDetails';
import { Step7Review } from './components/Step7Review';
import { FinalTicketModal } from './components/FinalTicketModal';
import { MyTripsModal } from './components/MyTripsModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { HotelDashboard } from './components/HotelDashboard';
import { AgencyDashboard } from './components/AgencyDashboard';
import { WeatherModal } from './components/WeatherModal';
import { RequestAdminModal } from './components/RequestAdminModal';
import { Chatbot } from './components/Chatbot';
import { BottomNavigation } from './components/BottomNavigation';

import { Vehicle, Hotel, Pitstop, SelectedFoodItem, UserProfile, Booking, RouteSuggestion, WeatherData, RouteData } from './types';
import { calculatePricing } from './utils/pricing';
import { 
  saveDraftTrip, 
  getDraftTrip,
  saveCachedUser,
  getCachedUser 
} from './utils/storage';
import { 
  fetchRouteTelemetry, 
  fetchLiveWeatherApi, 
  fetchFleetApi, 
  fetchHotelsApi, 
  fetchPitstopsApi, 
  fetchBookingsApi, 
  createBookingApi, 
  updateBookingStatusApi, 
  deleteBookingApi,
  getAuthToken,
  setAuthToken,
  AuthRoleUser
} from './services/api';

export default function App() {
  // Authentication & Screen Flow State
  const [currentUser, setCurrentUser] = useState<AuthRoleUser | null>(null);
  const [isJourneyActive, setIsJourneyActive] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Step Progression State (1 to 7)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(1);

  // Modals State
  const [activeModal, setActiveModal] = useState<'ticket' | 'myTrips' | 'admin' | 'weather' | 'requestAdmin' | null>(null);
  const [myTripsTab, setMyTripsTab] = useState<'all' | 'Confirmed' | 'Pending' | 'Cancelled'>('all');

  // Step 1: Route State
  const [fromLocation, setFromLocation] = useState<string>('Hyderabad');
  const [toLocation, setToLocation] = useState<string>('Delhi');
  const [routeDistanceKm, setRouteDistanceKm] = useState<number>(1480);
  const [estimatedDriveTime, setEstimatedDriveTime] = useState<string>('18h 30m');
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [userLiveLocation, setUserLiveLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);

  // Step 2: Car Fleet State
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Step 3: Hotel State
  const [wantsHotel, setWantsHotel] = useState<boolean | null>(false);
  const [availableHotels, setAvailableHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [hotelNights, setHotelNights] = useState<number>(1);

  // Step 4: Food Stops State
  const [wantsFood, setWantsFood] = useState<boolean | null>(false);
  const [availableFoodStops, setAvailableFoodStops] = useState<Pitstop[]>([]);
  const [selectedFoodStops, setSelectedFoodStops] = useState<Pitstop[]>([]);
  const [selectedFoodItems, setSelectedFoodItems] = useState<SelectedFoodItem[]>([]);

  // Step 6: Passenger Schedule & Details State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: '',
    phone: '',
    email: '',
    numberOfPeople: 2,
    travelersCount: 2,
    startDate: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    specialRequests: '',
  });

  // Bookings Store & Active Ticket
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [activeTicketBooking, setActiveTicketBooking] = useState<Booking | null>(null);
  const [isConfirmingBooking, setIsConfirmingBooking] = useState<boolean>(false);

  // Weather Data
  const [weather, setWeather] = useState<WeatherData>({
    city: 'Delhi',
    temp: 28,
    condition: 'Sunny & Clear',
    icon: 'Sun',
    visibility: '10.0 km',
    humidity: 42,
    windSpeed: '12 km/h',
    high: 33,
    low: 22,
    uvIndex: 4,
  });

  // Dynamic Real-time Pricing Calculation
  const pricing = useMemo(() => {
    const people = Math.max(1, userProfile.numberOfPeople || userProfile.travelersCount || 2);
    return calculatePricing({
      vehicle: selectedVehicle,
      hotel: wantsHotel ? selectedHotel : null,
      hotelNights: wantsHotel ? hotelNights : 0,
      pitstops: wantsFood ? selectedFoodStops : [],
      selectedFoodItems: wantsFood ? selectedFoodItems : [],
      numberOfPeople: people,
    });
  }, [selectedVehicle, wantsHotel, selectedHotel, hotelNights, wantsFood, selectedFoodStops, selectedFoodItems, userProfile]);

  // Load Bookings from Backend API
  const refreshBookings = useCallback(async () => {
    try {
      const data = await fetchBookingsApi();
      setAllBookings(data.bookings);
    } catch (err) {
      console.warn('Failed to load bookings:', err);
    }
  }, []);

  // Synchronize dynamic route data
  const syncRouteServices = useCallback(async (from: string, to: string) => {
    if (!from || !to) return;

    try {
      // 1. Fetch real road distance from OSRM/routing
      const telemetry = await fetchRouteTelemetry(from, to);
      setRouteData(telemetry);
      setRouteDistanceKm(telemetry.distanceKm);
      setEstimatedDriveTime(telemetry.carEstimatedHours || telemetry.durationText || '2h 00m');

      // 2. Fetch destination weather
      const liveWeather = await fetchLiveWeatherApi(to);
      setWeather(liveWeather);

      // 3. Fetch Car Fleet (cars only, realistic price based on distanceKm)
      const fleet = await fetchFleetApi(from, to);
      setAvailableVehicles(fleet);
      if (fleet.length > 0) {
        setSelectedVehicle((prev) => {
          if (!prev) return fleet[0];
          const matched = fleet.find((v) => v.id === prev.id);
          return matched || fleet[0];
        });
      }

      // 4. Fetch Destination Hotels
      const hotels = await fetchHotelsApi(to);
      setAvailableHotels(hotels);

      // 5. Fetch Highway Food Stops along corridor
      const pitstops = await fetchPitstopsApi(from, to);
      setAvailableFoodStops(pitstops);
    } catch (err) {
      console.warn('Route sync error:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshBookings();

    const cachedDraft = getDraftTrip();
    let initialFrom = 'Hyderabad';
    let initialTo = 'Delhi';

    if (cachedDraft) {
      if (cachedDraft.from) initialFrom = cachedDraft.from;
      if (cachedDraft.to) initialTo = cachedDraft.to;
      setFromLocation(initialFrom);
      setToLocation(initialTo);
    }

    const cachedUser = getCachedUser();
    if (cachedUser) {
      setUserProfile((prev) => ({
        ...prev,
        fullName: cachedUser.fullName || prev.fullName,
        phone: cachedUser.phone || prev.phone,
        email: cachedUser.email || prev.email,
        specialRequests: cachedUser.specialRequests || prev.specialRequests,
      }));

      if (cachedUser.email?.toLowerCase().trim() === 'tourguide@gmail.com' || cachedUser.email?.toLowerCase().trim() === 'admin@tourguide.com') {
        setCurrentUser({
          id: 'TGAI-USER-ADM0001',
          name: cachedUser.fullName || 'Main Administrator',
          email: 'tourguide@gmail.com',
          phone: cachedUser.phone || '+91 99000 00001',
          role: 'MAIN_ADMIN',
        });
        setActiveModal('admin');
      }
    }

    syncRouteServices(initialFrom, initialTo);
  }, [refreshBookings, syncRouteServices]);

  // Debounced Route Update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fromLocation.trim().length > 1 && toLocation.trim().length > 1) {
        syncRouteServices(fromLocation, toLocation);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [fromLocation, toLocation, syncRouteServices]);

  // Save Draft
  useEffect(() => {
    saveDraftTrip({
      from: fromLocation,
      to: toLocation,
      selectedVehicleId: selectedVehicle?.id,
      selectedHotelId: selectedHotel?.id,
      hotelNights,
      pitstopsIds: selectedFoodStops.map((p) => p.id),
    });
  }, [fromLocation, toLocation, selectedVehicle, selectedHotel, hotelNights, selectedFoodStops]);

  // Step Navigation Helper
  const goToStep = (stepNum: number) => {
    if (stepNum > maxUnlockedStep) return;
    setCurrentStep(stepNum);
    
    // Scroll smoothly to active step area
    const el = document.getElementById(`step-${stepNum}-route`) || 
               document.getElementById(`step-${stepNum}-fleet`) || 
               document.getElementById(`step-${stepNum}-hotel`) || 
               document.getElementById(`step-${stepNum}-food`) || 
               document.getElementById(`step-${stepNum}-map`) || 
               document.getElementById(`step-${stepNum}-details`) || 
               document.getElementById(`step-${stepNum}-review`) ||
               document.getElementById('journey-progress-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const advanceToStep = (stepNum: number) => {
    setMaxUnlockedStep((prev) => Math.max(prev, stepNum));
    setCurrentStep(stepNum);

    const el = document.getElementById('journey-progress-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Login handler
  const handleLoginSuccess = (user: AuthRoleUser, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    setUserProfile((prev) => ({
      ...prev,
      fullName: user.name,
      email: user.email,
      phone: user.phone || prev.phone,
    }));
    saveCachedUser({
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      travelDate: userProfile.startDate,
      travelersCount: userProfile.travelersCount,
    });
    setIsJourneyActive(false);

    // Auto-open Admin Dashboard if logging in as Admin or Partner
    if (user.role === 'MAIN_ADMIN' || user.role === 'HOTEL_ADMIN' || user.role === 'TRAVEL_ADMIN' || user.email === 'tourguide@gmail.com') {
      refreshBookings();
      setActiveModal('admin');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken('');
    setIsJourneyActive(false);
  };

  // Start Journey -> Triggers Location Modal
  const handleTriggerStartJourney = () => {
    setIsLocationModalOpen(true);
  };

  const handleLocationAllowed = async (coords?: { lat: number; lng: number }) => {
    setIsLocationModalOpen(false);
    setIsJourneyActive(true);
    setCurrentStep(1);
    setMaxUnlockedStep(1);

    if (coords) {
      setUserLiveLocation(coords);
      console.log('Location coords detected:', coords);
    }
  };

  const handleLocationDenied = () => {
    setIsLocationModalOpen(false);
    setIsJourneyActive(true);
    setCurrentStep(1);
    setMaxUnlockedStep(1);
  };

  // Step 1: Where are you going -> Step 2
  const handleStep1Continue = () => {
    advanceToStep(2);
  };

  // Step 2: Car Selected -> Step 3
  const handleStep2Continue = () => {
    advanceToStep(3);
  };

  // Step 3: Hotel Stay -> Step 4
  const handleStep3Continue = () => {
    advanceToStep(4);
  };

  // Step 4: Food Stops -> Step 5
  const handleStep4Continue = () => {
    advanceToStep(5);
  };

  // Step 5: Route Map -> Step 6
  const handleStep5Continue = () => {
    advanceToStep(6);
  };

  // Step 6: Schedule & Passenger Details -> Step 7
  const handleStep6Continue = () => {
    advanceToStep(7);
  };

  // Step 7: Final Booking Confirmation (creates booking with Journey Token ID)
  const handleConfirmBooking = async () => {
    if (!selectedVehicle) return;

    setIsConfirmingBooking(true);
    try {
      const numPeople = Math.max(1, userProfile.numberOfPeople || userProfile.travelersCount || 2);
      const payload: Partial<Booking> = {
        from: fromLocation || 'Hyderabad',
        to: toLocation || 'Delhi',
        travelDate: userProfile.startDate || new Date().toISOString().split('T')[0],
        travelTime: userProfile.startTime || '08:00',
        numberOfPeople: numPeople,
        travelers: numPeople,
        vehicle: selectedVehicle,
        hotel: wantsHotel ? selectedHotel : null,
        hotelNights: wantsHotel && selectedHotel ? hotelNights : 0,
        pitstops: wantsFood ? selectedFoodStops : [],
        selectedFoodItems: wantsFood ? selectedFoodItems : [],
        user: {
          fullName: userProfile.fullName || currentUser?.name || 'Traveler',
          phone: userProfile.phone || currentUser?.phone || '',
          email: userProfile.email || currentUser?.email || '',
          specialRequests: userProfile.specialRequests || '',
          numberOfPeople: numPeople,
          travelersCount: numPeople,
          travelDate: userProfile.startDate || '',
          travelTime: userProfile.startTime || '08:00',
          isVerified: true,
        },
        pricing,
      };

      const savedBooking = await createBookingApi(payload);
      await refreshBookings();
      
      setActiveTicketBooking(savedBooking);
      setActiveModal('ticket');
    } catch (err: any) {
      alert(err.message || 'Booking confirmation failed. Please try again.');
    } finally {
      setIsConfirmingBooking(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => {
    await updateBookingStatusApi(id, status);
    await refreshBookings();
  };

  const handleDeleteBooking = async (id: string) => {
    await deleteBookingApi(id);
    await refreshBookings();
  };

  const handleResetForNewTrip = () => {
    setActiveModal(null);
    setSelectedFoodItems([]);
    setSelectedFoodStops([]);
    setWantsFood(false);
    setWantsHotel(false);
    setSelectedHotel(null);
    setCurrentStep(1);
    setMaxUnlockedStep(1);
    setIsJourneyActive(true);
  };

  const handleSelectNavTab = (tab: 'home' | 'explore' | 'planner' | 'trips' | 'profile') => {
    if (tab === 'home' || tab === 'explore' || tab === 'planner') {
      setIsJourneyActive(true);
      setCurrentStep(1);
    } else if (tab === 'trips') {
      setMyTripsTab('all');
      refreshBookings();
      setActiveModal('myTrips');
    } else if (tab === 'profile') {
      setIsJourneyActive(false);
    }
  };

  // 1. If not logged in -> Show LOGIN / CREATE ACCOUNT SCREEN
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-sans transition-colors">
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onRequestAdmin={() => setActiveModal('requestAdmin')}
        />

        {/* Request Admin Modal */}
        <RequestAdminModal
          isOpen={activeModal === 'requestAdmin'}
          onClose={() => setActiveModal(null)}
        />
      </div>
    );
  }

  // 2. Dedicated Hotel Dashboard View for HOTEL_ADMIN
  if (currentUser.role === 'HOTEL_ADMIN') {
    return <HotelDashboard user={currentUser} onLogout={handleLogout} />;
  }

  // 3. Dedicated Travel Agency Dashboard View for TRAVEL_ADMIN
  if (currentUser.role === 'TRAVEL_ADMIN') {
    return <AgencyDashboard user={currentUser} onLogout={handleLogout} />;
  }

  // 4. If logged in and journey NOT active -> Show USER PROFILE SCREEN
  if (!isJourneyActive) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-sans pb-16 sm:pb-0 transition-colors">
        <UserProfileScreen
          currentUser={currentUser}
          bookings={allBookings}
          onStartJourney={handleTriggerStartJourney}
          onOpenMyTrips={() => {
            setMyTripsTab('all');
            refreshBookings();
            setActiveModal('myTrips');
          }}
          onOpenWeather={() => setActiveModal('weather')}
          onOpenAdmin={() => {
            refreshBookings();
            setActiveModal('admin');
          }}
          onLogout={handleLogout}
          onSelectBookingTicket={(b) => {
            setActiveTicketBooking(b);
            setActiveModal('ticket');
          }}
        />

        {/* Bottom Navigation for Mobile */}
        <BottomNavigation
          currentTab="profile"
          onSelectTab={handleSelectNavTab}
          confirmedCount={allBookings.filter((b) => b.status === 'Confirmed').length}
        />

        {/* Location Permission Prompt Modal */}
        <LocationPermissionModal
          isOpen={isLocationModalOpen}
          onAllowLocation={handleLocationAllowed}
          onDenyLocation={handleLocationDenied}
        />

        {/* Weather Modal */}
        <WeatherModal
          isOpen={activeModal === 'weather'}
          city={toLocation || 'Delhi'}
          weather={weather}
          onClose={() => setActiveModal(null)}
        />

        {/* My Trips Modal */}
        <MyTripsModal
          isOpen={activeModal === 'myTrips'}
          bookings={allBookings}
          initialTab={myTripsTab}
          onClose={() => setActiveModal(null)}
          onViewTicket={(b) => {
            setActiveTicketBooking(b);
            setActiveModal('ticket');
          }}
          onCancelBooking={(id) => handleUpdateStatus(id, 'Cancelled')}
          onPlanNewTrip={handleResetForNewTrip}
        />

        {/* Admin Command Panel Modal */}
        <AdminPanelModal
          isOpen={activeModal === 'admin'}
          bookings={allBookings}
          onClose={() => setActiveModal(null)}
          onUpdateStatus={handleUpdateStatus}
          onDeleteBooking={handleDeleteBooking}
          onViewTicket={(b) => {
            setActiveTicketBooking(b);
            setActiveModal('ticket');
          }}
          onRefreshData={refreshBookings}
        />

        {/* Final Ticket Modal */}
        <FinalTicketModal
          booking={activeTicketBooking}
          isOpen={activeModal === 'ticket'}
          onClose={() => setActiveModal(null)}
          onOpenMyTrips={() => {
            setMyTripsTab('all');
            refreshBookings();
            setActiveModal('myTrips');
          }}
          onBookAnother={handleResetForNewTrip}
        />
      </div>
    );
  }

  // 3. JOURNEY ACTIVE -> Show 7 Locked Step-by-Step Travel Flow
  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-sans pt-20 pb-20 sm:pb-0 transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        currentStep={currentStep}
        totalPrice={pricing.total}
        confirmedCount={allBookings.filter((b) => b.status === 'Confirmed').length}
        currentUser={currentUser}
        isJourneyActive={isJourneyActive}
        onOpenWeather={() => setActiveModal('weather')}
        onOpenRequestAdmin={() => setActiveModal('requestAdmin')}
        onOpenMyTrips={() => {
          setMyTripsTab('all');
          refreshBookings();
          setActiveModal('myTrips');
        }}
        onOpenAdmin={() => {
          refreshBookings();
          setActiveModal('admin');
        }}
        onGoToProfile={() => setIsJourneyActive(false)}
        onSelectNavTab={handleSelectNavTab}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Moving Small Car Progress Bar (7 Steps) */}
        <ProgressBar
          currentStep={currentStep}
          maxUnlockedStep={maxUnlockedStep}
          onNavigateToStep={goToStep}
        />

        {/* STEP 1: WHERE ARE YOU GOING? */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <Step1Route
              fromLocation={fromLocation}
              toLocation={toLocation}
              distanceKm={routeDistanceKm}
              travelTime={estimatedDriveTime}
              onFromChange={setFromLocation}
              onToChange={setToLocation}
              onSelectRouteSuggestion={(r) => {
                setFromLocation(r.from);
                setToLocation(r.to);
                syncRouteServices(r.from, r.to);
              }}
              onContinue={handleStep1Continue}
              onGoBack={() => setIsJourneyActive(false)}
            />
          </div>
        )}

        {/* STEP 2: CHOOSE YOUR CAR */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <Step2Fleet
              vehicles={availableVehicles}
              selectedVehicle={selectedVehicle}
              fromLocation={fromLocation}
              toLocation={toLocation}
              distanceKm={routeDistanceKm}
              onSelectVehicle={setSelectedVehicle}
              onContinue={handleStep2Continue}
              onGoBack={() => goToStep(1)}
            />
          </div>
        )}

        {/* STEP 3: HOTEL STAY */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
            <Step3Hotel
              hotels={availableHotels}
              selectedHotel={selectedHotel}
              hotelNights={hotelNights}
              wantsHotel={wantsHotel}
              destinationCity={toLocation}
              onChooseWantsHotel={setWantsHotel}
              onSelectHotel={setSelectedHotel}
              onChangeNights={setHotelNights}
              onContinue={handleStep3Continue}
              onGoBack={() => goToStep(2)}
            />
          </div>
        )}

        {/* STEP 4: FOOD STOPS */}
        {currentStep === 4 && (
          <div className="animate-fade-in">
            <Step4Food
              foodStops={availableFoodStops}
              selectedFoodStops={selectedFoodStops}
              selectedFoodItems={selectedFoodItems}
              numberOfPeople={userProfile.numberOfPeople || userProfile.travelersCount || 2}
              wantsFood={wantsFood}
              fromLocation={fromLocation}
              toLocation={toLocation}
              onChooseWantsFood={setWantsFood}
              onToggleFoodStop={(stop) => {
                setSelectedFoodStops((prev) => {
                  const exists = prev.some((p) => p.id === stop.id);
                  return exists ? prev.filter((p) => p.id !== stop.id) : [...prev, stop];
                });
              }}
              onAddFoodItem={(item, stop) => {
                const id = `${stop.id}-${item.id}`;
                const numPeople = userProfile.numberOfPeople || userProfile.travelersCount || 2;
                setSelectedFoodItems((prev) => {
                  const existing = prev.find((i) => i.id === id);
                  if (existing) {
                    return prev.map((i) =>
                      i.id === id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
                    );
                  }
                  return [
                    ...prev,
                    {
                      id,
                      foodItemId: item.id,
                      name: item.name,
                      pricePerPerson: item.pricePerPerson,
                      quantity: 1,
                      people: numPeople,
                      total: item.pricePerPerson * numPeople,
                      restaurantId: stop.id,
                      restaurantName: stop.name,
                      isVeg: item.isVeg,
                    },
                  ];
                });
              }}
              onRemoveFoodItem={(selectionId) => {
                setSelectedFoodItems((prev) => prev.filter((i) => i.id !== selectionId));
              }}
              onUpdateItemQuantity={(selectionId, quantity) => {
                setSelectedFoodItems((prev) =>
                  prev.map((i) => (i.id === selectionId ? { ...i, quantity } : i))
                );
              }}
              onUpdatePeopleCount={(count) => {
                setUserProfile((prev) => ({ ...prev, numberOfPeople: count, travelersCount: count }));
              }}
              onContinue={handleStep4Continue}
              onGoBack={() => goToStep(3)}
            />
          </div>
        )}

        {/* STEP 5: ROUTE MAP */}
        {currentStep === 5 && (
          <div className="animate-fade-in">
            <Step5Map
              fromLocation={fromLocation}
              toLocation={toLocation}
              distanceKm={routeDistanceKm}
              travelTime={estimatedDriveTime}
              routeData={routeData}
              userLiveLocation={userLiveLocation}
              vehicle={selectedVehicle}
              hotel={wantsHotel ? selectedHotel : null}
              pitstops={wantsFood ? selectedFoodStops : []}
              onContinue={handleStep5Continue}
              onGoBack={() => goToStep(4)}
            />
          </div>
        )}

        {/* STEP 6: SCHEDULE & PASSENGER DETAILS */}
        {currentStep === 6 && (
          <div className="animate-fade-in">
            <Step6UserDetails
              userProfile={userProfile}
              onUpdateProfile={(updated) => setUserProfile((prev) => ({ ...prev, ...updated }))}
              onContinue={handleStep6Continue}
              onGoBack={() => goToStep(5)}
            />
          </div>
        )}

        {/* STEP 7: REVIEW & CONFIRM */}
        {currentStep === 7 && (
          <div className="animate-fade-in">
            <Step7Review
              fromLocation={fromLocation}
              toLocation={toLocation}
              distanceKm={routeDistanceKm}
              travelTime={estimatedDriveTime}
              vehicle={selectedVehicle}
              hotel={wantsHotel ? selectedHotel : null}
              hotelNights={wantsHotel && selectedHotel ? hotelNights : 0}
              pitstops={wantsFood ? selectedFoodStops : []}
              selectedFoodItems={wantsFood ? selectedFoodItems : []}
              userProfile={userProfile}
              pricing={pricing}
              isConfirming={isConfirmingBooking}
              onNavigateToStep={goToStep}
              onConfirmBooking={handleConfirmBooking}
              onGoBack={() => goToStep(6)}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border-color)] bg-[var(--bg-surface)] text-center text-xs font-mono-tech text-[var(--text-muted)] no-print mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--text-primary)]">TourGuide AI</span>
            <span>• Smart Travel Platform</span>
          </div>
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <button onClick={() => setIsJourneyActive(false)} className="hover:text-sky-500 transition-colors cursor-pointer">
              Profile
            </button>
            <button onClick={() => setActiveModal('myTrips')} className="hover:text-sky-500 transition-colors cursor-pointer">
              My Trips
            </button>
            <button onClick={() => setActiveModal('requestAdmin')} className="hover:text-sky-500 transition-colors cursor-pointer">
              Partner with Us
            </button>
          </div>
          <div>© 2026 TourGuide AI. All rights reserved.</div>
        </div>
      </footer>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation
        currentTab={currentStep === 1 ? 'home' : 'planner'}
        onSelectTab={handleSelectNavTab}
        confirmedCount={allBookings.filter((b) => b.status === 'Confirmed').length}
      />

      {/* Floating AI Chatbot */}
      <Chatbot
        tripContext={{
          from: fromLocation,
          to: toLocation,
          vehicle: selectedVehicle,
          hotel: wantsHotel ? selectedHotel : null,
          hotelNights: wantsHotel && selectedHotel ? hotelNights : 0,
          pitstops: wantsFood ? selectedFoodStops : [],
          userData: {
            fullName: userProfile.fullName,
            email: userProfile.email,
            phone: userProfile.phone,
            travelDate: userProfile.startDate,
            travelersCount: userProfile.travelersCount,
            specialRequests: userProfile.specialRequests,
          },
          weather,
          pricing,
        }}
      />

      {/* Weather Modal */}
      <WeatherModal
        isOpen={activeModal === 'weather'}
        city={toLocation || 'Delhi'}
        weather={weather}
        onClose={() => setActiveModal(null)}
      />

      {/* Request Admin Partner Modal */}
      <RequestAdminModal
        isOpen={activeModal === 'requestAdmin'}
        onClose={() => setActiveModal(null)}
      />

      {/* Final Ticket Modal */}
      <FinalTicketModal
        booking={activeTicketBooking}
        isOpen={activeModal === 'ticket'}
        onClose={() => setActiveModal(null)}
        onOpenMyTrips={() => {
          setMyTripsTab('all');
          refreshBookings();
          setActiveModal('myTrips');
        }}
        onBookAnother={handleResetForNewTrip}
      />

      {/* My Trips Modal */}
      <MyTripsModal
        isOpen={activeModal === 'myTrips'}
        bookings={allBookings}
        initialTab={myTripsTab}
        onClose={() => setActiveModal(null)}
        onViewTicket={(b) => {
          setActiveTicketBooking(b);
          setActiveModal('ticket');
        }}
        onCancelBooking={(id) => handleUpdateStatus(id, 'Cancelled')}
        onPlanNewTrip={handleResetForNewTrip}
      />

      {/* Admin Command Panel Modal */}
      <AdminPanelModal
        isOpen={activeModal === 'admin'}
        bookings={allBookings}
        onClose={() => setActiveModal(null)}
        onUpdateStatus={handleUpdateStatus}
        onDeleteBooking={handleDeleteBooking}
        onViewTicket={(b) => {
          setActiveTicketBooking(b);
          setActiveModal('ticket');
        }}
        onRefreshData={refreshBookings}
      />

    </div>
  );
}

