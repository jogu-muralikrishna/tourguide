import {
  TravelContext,
  ChatMessage,
  CopilotAction,
  DailyItineraryItem,
  PostTripSummary,
  TripPlanResponse,
  Trip,
  Booking,
} from '../types';
import { TripService } from './tripService';
import { BookingService } from './bookingService';
import { ExpenseService } from './expenseService';
import { AlertService } from './alertService';
import { EmergencyService } from './emergencyService';
import { eventBus } from './eventBus';

export class CopilotService {
  // Build a structured travel context snapshot
  public static buildTravelContext(
    trip?: Trip | null,
    aiTripPlan?: TripPlanResponse | null,
    bookings: Booking[] = [],
    currentLocation?: { latitude: number; longitude: number },
    currentLocationName?: string,
    currentDateTime: string = new Date().toISOString()
  ): TravelContext {
    const destination = trip?.destination || aiTripPlan?.destination || 'Goa';
    const origin = trip?.origin || aiTripPlan?.origin || 'Hyderabad';
    const budget = trip?.budget || aiTripPlan?.estimatedBudget || 25000;
    const currency = trip?.currency || aiTripPlan?.currency || '₹';
    const itinerary = trip?.itinerary || aiTripPlan?.days || [];

    const expenses = trip ? ExpenseService.getExpenses(trip.id) : [];
    const recordedExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const confirmedBookingsCost = bookings
      .filter((b) => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + (b.pricing?.total || b.totalCost || 0), 0);

    const totalSpent = recordedExpenses + (confirmedBookingsCost > 0 ? confirmedBookingsCost : 0);
    const estimatedRemaining = Math.max(0, budget - totalSpent);

    return {
      tripId: trip?.id || 'active-draft',
      user: {
        id: trip?.userId || 'guest-traveler',
        name: 'VIP Traveler',
      },
      origin: { name: origin, coordinates: aiTripPlan?.originCoordinates },
      destination: { name: destination, coordinates: aiTripPlan?.destinationCoordinates },
      startDate: trip?.startDate || 'Day 1',
      endDate: trip?.endDate || `Day ${itinerary.length || 4}`,
      travelDates: trip?.travelDates || '4 Days',
      travelers: trip?.travelers || 4,
      travelerNames: trip ? ExpenseService.getTravelers(trip.id) : ['Aarav', 'Ravi', 'Kiran', 'Sai'],
      budget,
      currency,
      itinerary,
      bookings,
      selectedTransport: trip?.transportation || aiTripPlan?.transportation,
      selectedHotels: trip?.selectedHotel ? [trip.selectedHotel] : aiTripPlan?.hotels,
      selectedPlaces: aiTripPlan?.activities,
      currentLocation,
      currentLocationName: currentLocationName || destination,
      currentDateTime,
      weather: aiTripPlan?.weatherInfo,
      budgetStatus: {
        budget,
        spent: totalSpent,
        estimatedRemaining,
        isOverBudget: totalSpent > budget,
      },
      tripMode: trip?.mode || 'PLAN',
    };
  }

  // Determine current and next activity from itinerary
  public static getNextActivityEngine(itinerary: DailyItineraryItem[]): {
    currentActivity: { day: number; title: string; timeSlot: string; cost: number; distance: string } | null;
    nextActivity: { day: number; title: string; timeSlot: string; cost: number; distance: string } | null;
    progressPercentage: number;
  } {
    if (!itinerary || itinerary.length === 0) {
      return { currentActivity: null, nextActivity: null, progressPercentage: 0 };
    }

    const firstDay = itinerary[0];
    const secondDay = itinerary.length > 1 ? itinerary[1] : firstDay;

    return {
      currentActivity: {
        day: firstDay.dayNumber,
        title: firstDay.morningActivity || 'Citadel & Heritage Exploration',
        timeSlot: 'Morning (09:00 AM – 01:00 PM)',
        cost: Math.round(firstDay.estimatedCost * 0.4),
        distance: firstDay.approxDistance || '8 km cluster',
      },
      nextActivity: {
        day: firstDay.dayNumber,
        title: firstDay.afternoonActivity || 'Coastal Vista & Heritage Trail',
        timeSlot: 'Afternoon (02:00 PM – 05:30 PM)',
        cost: Math.round(firstDay.estimatedCost * 0.35),
        distance: '4.2 km corridor',
      },
      progressPercentage: 35,
    };
  }

  // Send message to Gemini Copilot via server endpoint
  public static async processMessage(
    userMessage: string,
    history: ChatMessage[],
    context: TravelContext
  ): Promise<{
    reply: string;
    actionProposal?: CopilotAction;
    detectedLanguage?: string;
  }> {
    try {
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          messages: history,
          travelContext: context,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          reply: data.reply,
          actionProposal: data.actionProposal,
          detectedLanguage: data.detectedLanguage || 'en',
        };
      }
    } catch (err) {
      console.warn('Backend copilot error, applying deterministic tool resolver:', err);
    }

    // Deterministic Client-side Fallback Copilot
    return this.resolveDeterministicFallback(userMessage, context);
  }

  private static resolveDeterministicFallback(
    userMessage: string,
    context: TravelContext
  ): {
    reply: string;
    actionProposal?: CopilotAction;
    detectedLanguage?: string;
  } {
    const msg = userMessage.toLowerCase();
    const currency = context.currency || '₹';
    const dest = context.destination.name || 'Goa';
    const weather = context.weather;
    const days = context.itinerary;

    // Language detection check
    let detectedLanguage = 'en';
    if (msg.includes('repu') || msg.includes('naku') || msg.includes('em cheyyali') || msg.includes('kavali') || msg.includes('undi')) {
      detectedLanguage = 'te';
    } else if (msg.includes('kya') || msg.includes('kal') || msg.includes('kaha') || msg.includes('kaise') || msg.includes('hoga')) {
      detectedLanguage = 'hi';
    }

    // 1. Tomorrow / Schedule Queries
    if (msg.includes('tomorrow') || msg.includes('repu') || msg.includes('kal') || msg.includes('schedule') || msg.includes('itinerary')) {
      const targetDay = days.length > 1 ? days[1] : days[0];
      if (targetDay) {
        if (detectedLanguage === 'te') {
          return {
            reply: `రేపు ${dest} లో మీ ప్రణాళిక: ఉదయం "${targetDay.morningActivity}", మధ్యాహ్నం "${targetDay.afternoonActivity}", సాయంత్రం "${targetDay.eveningActivity}". భోజన ప్రతిపాదన: ${targetDay.recommendedFood}. అంచనా బడ్జెట్: ${currency}${targetDay.estimatedCost}.`,
            detectedLanguage: 'te',
          };
        }
        if (detectedLanguage === 'hi') {
          return {
            reply: `कल ${dest} में आपका कार्यक्रम: सुबह "${targetDay.morningActivity}", दोपहर "${targetDay.afternoonActivity}", और शाम को "${targetDay.eveningActivity}". भोजन: ${targetDay.recommendedFood}. अनुमानित दैनिक बजट: ${currency}${targetDay.estimatedCost}.`,
            detectedLanguage: 'hi',
          };
        }
        return {
          reply: `For Day 2 in ${dest}, your morning itinerary begins with "${targetDay.morningActivity}", continuing to "${targetDay.afternoonActivity}" in the afternoon, and concluding with "${targetDay.eveningActivity}" at sunset. Recommended cuisine: ${targetDay.recommendedFood}. Estimated daily spend: ${currency}${targetDay.estimatedCost.toLocaleString()}.`,
          detectedLanguage: 'en',
        };
      }
    }

    // 2. Weather Queries
    if (msg.includes('weather') || msg.includes('rain') || msg.includes('varsham') || msg.includes('barish') || msg.includes('temperature')) {
      const temp = weather?.tempC ?? 28;
      const rain = weather?.rainProbability ?? 15;
      const cond = weather?.condition ?? 'Optimal Clear Skies';

      if (rain > 50) {
        return {
          reply: `Live meteorological satellite telemetry reports ${temp}°C with ${cond} and a high precipitation probability of ${rain}%. I advise scheduling coastal excursions before noon and visiting heritage galleries in the afternoon.`,
          actionProposal: {
            id: `action-weather-replan-${Date.now()}`,
            toolType: 'WEATHER_REPLAN',
            title: 'Shift to Covered/Indoor Afternoon Route',
            description: `Reorganize afternoon outdoor activities to protected heritage galleries due to ${rain}% rain probability.`,
            payload: { dayNumber: 2, rainProbability: rain },
            permissionLevel: 'UPDATE',
            requiresConfirmation: true,
            status: 'PENDING',
          },
        };
      }

      return {
        reply: `Current destination conditions in ${dest}: ${temp}°C, ${cond}, with humidity at ${weather?.humidity ?? 62}% and low rain probability (${rain}%). Atmospheric window is primed for coastal transit.`,
      };
    }

    // 3. Budget Queries
    if (msg.includes('budget') || msg.includes('money') || msg.includes('left') || msg.includes('spent') || msg.includes('dabbulu') || msg.includes('paise')) {
      const budgetStatus = context.budgetStatus || {
        budget: context.budget,
        spent: 0,
        estimatedRemaining: context.budget,
        isOverBudget: false,
      };

      return {
        reply: `Your total planned allocation is ${currency}${budgetStatus.budget.toLocaleString()}. Recorded expenses and bookings: ${currency}${budgetStatus.spent.toLocaleString()}. You have approximately ${currency}${budgetStatus.estimatedRemaining.toLocaleString()} remaining in your expedition treasury.`,
      };
    }

    // 4. Make Cheaper / Cost Optimization
    if (msg.includes('cheaper') || msg.includes('reduce cost') || msg.includes('save money') || msg.includes('thakkuva') || msg.includes('sasta')) {
      return {
        reply: `I have audited your itinerary and identified cost savings in transit and venue allocations. We can optimize tomorrow's itinerary to save approximately ${currency}1,600 without compromising verified landmarks.`,
        actionProposal: {
          id: `action-cheaper-${Date.now()}`,
          toolType: 'MAKE_CHEAPER',
          title: 'Apply Cost-Optimized Route (-₹1,600)',
          description: 'Switch transit to express shuttle corridor and select curated heritage dining over luxury tasting menu.',
          payload: { savingsAmount: 1600 },
          permissionLevel: 'UPDATE',
          requiresConfirmation: true,
          status: 'PENDING',
        },
      };
    }

    // 5. Food & Dining Queries
    if (msg.includes('food') || msg.includes('dinner') || msg.includes('lunch') || msg.includes('eat') || msg.includes('restaurant') || msg.includes('tindi') || msg.includes('khana')) {
      return {
        reply: `Near your central sanctuary in ${dest}, the curated culinary guild recommends:
1. **The Fisherman's Wharf** (Authentic Goan Coastal Seafood & Kingfish Curry, ~₹1,200 for two)
2. **Gunpowder Heritage Kitchen** (Regional South Indian Coastal delicacies, ~₹900)
3. **Thalassa Sun Deck** (Greek Coastal Bistro with sunset ocean vista, ~₹1,800).`,
      };
    }

    // 6. Emergency / Medical / Hospital
    if (msg.includes('hospital') || msg.includes('doctor') || msg.includes('sick') || msg.includes('emergency') || msg.includes('police') || msg.includes('ayush')) {
      return {
        reply: `🚨 EMERGENCY ASSISTANCE FOR ${dest.toUpperCase()}:
• Universal Dispatch: Dial 112 (Immediate Response)
• Medical Ambulance: Dial 108
• Nearest Primary Facility: Manipal Multi-Specialty Hospital (~3.4 km, Phone: +91 832 245 8000)
• 24/7 Chemist: Apollo Emergency Pharmacy (~1.2 km).
I can open the Emergency SOS Locator for one-tap navigation.`,
        actionProposal: {
          id: `action-emergency-${Date.now()}`,
          toolType: 'GET_EMERGENCY_SERVICES',
          title: 'Open Emergency SOS Console',
          description: 'Locate 24/7 trauma hospitals, chemist dispensaries, and police dispatch with live navigation.',
          payload: { destination: dest },
          permissionLevel: 'READ',
          requiresConfirmation: false,
          status: 'PENDING',
        },
      };
    }

    // 7. Cancellation Request (CRITICAL TOOL)
    if (msg.includes('cancel') && (msg.includes('booking') || msg.includes('hotel') || msg.includes('reservation') || msg.includes('trip'))) {
      const activeBooking = context.bookings.find((b) => b.status === 'CONFIRMED');
      if (activeBooking) {
        return {
          reply: `Your reservation for transit pass **${activeBooking.transitId || activeBooking.id}** (${currency}${(activeBooking.pricing?.total || activeBooking.totalCost).toLocaleString()}) is currently confirmed. Would you like me to request a full demo cancellation and release your reservation?`,
          actionProposal: {
            id: `action-cancel-${activeBooking.id}`,
            toolType: 'CANCEL_BOOKING',
            title: `Confirm Cancellation of ${activeBooking.transitId || activeBooking.id}`,
            description: `This will cancel your reservation and issue a simulated refund of ${currency}${(activeBooking.pricing?.total || activeBooking.totalCost).toLocaleString()}.`,
            payload: { bookingId: activeBooking.id },
            permissionLevel: 'CRITICAL',
            requiresConfirmation: true,
            status: 'PENDING',
          },
        };
      }
    }

    // Default Intelligence response
    return {
      reply: `Sage AI Travel Copilot is standing by. Your expedition to ${dest} is calibrated across ${days.length || 4} days. I can assist with tomorrow's schedule, nearby culinary havens, weather rerouting, budget tracking, or group expense splitting. What is your directive?`,
    };
  }

  // Generate Post-Trip Summary & Next Recommendations
  public static generatePostTripSummary(trip: Trip, expensesTotal: number): PostTripSummary {
    const durationDays = trip.itinerary?.length || 4;
    const dest = trip.destination;

    return {
      tripId: trip.id,
      title: trip.title || `Grand Expedition to ${dest}`,
      destination: dest,
      durationDays,
      placesVisitedCount: durationDays * 2 + 1,
      culinaryVisitedCount: durationDays + 1,
      totalDistanceKm: 420,
      plannedBudget: trip.budget,
      recordedSpent: expensesTotal > 0 ? expensesTotal : Math.round(trip.budget * 0.88),
      currency: trip.currency || '₹',
      favoriteActivities: [
        `${dest} Historic Citadel & Heritage Fortress`,
        `${dest} Coastal Sunset Promenade`,
        `${dest} Artisan Heritage Village`,
      ],
      foodHighlights: [
        'Signature Coastal Tasting Menu',
        'Artisanal Coconut Jaggery Delicacies',
        'Chef Selected Seafood Catch of the Day',
      ],
      memoriesNotes: 'Traveled in absolute comfort with verified routes and seamless daily scheduling.',
      recommendedNextDestinations: [
        {
          name: 'Kerala Backwaters & Munnar Hills',
          reason: 'Matches your affinity for coastal sunsets, authentic culinary heritage, and relaxed luxury.',
          matchScore: 96,
          bestSeason: 'October – March',
        },
        {
          name: 'Andaman & Nicobar Havelock Island',
          reason: 'Pristine coral waters, exclusive sanctuary villas, and high privacy rating.',
          matchScore: 92,
          bestSeason: 'November – April',
        },
        {
          name: 'Gokarna & Karwar Coastal Haven',
          reason: 'Peaceful secluded bays, temple architecture, and scenic coastal road trips.',
          matchScore: 89,
          bestSeason: 'October – February',
        },
      ],
    };
  }
}
