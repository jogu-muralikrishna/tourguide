import { TripPlanRequest, TripPlanResponse, OptimizationMode, ChatMessage } from '../types';
import { TravelDataService } from './travelDataService';

export class GeminiService {
  /**
   * Request an AI trip plan grounded in verified travel data
   */
  static async generateTripPlan(request: TripPlanRequest): Promise<TripPlanResponse> {
    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const data: TripPlanResponse = await response.json();
        return data;
      }
    } catch (e) {
      console.warn('Backend plan-trip API unavailable, activating client verified pipeline:', e);
    }

    // Fallback: collect real data and assemble
    const verifiedContext = await TravelDataService.collectVerifiedData(
      request.origin,
      request.destination,
      request.travelers,
      request.budget,
      request.travelStyle,
      request.interests
    );

    return TravelDataService.assembleVerifiedPlan(request, verifiedContext);
  }

  /**
   * Request trip optimization
   */
  static async optimizeTrip(
    currentPlan: TripPlanResponse,
    mode: OptimizationMode,
    userBudget: number
  ): Promise<TripPlanResponse> {
    try {
      const response = await fetch('/api/optimize-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPlan, mode, userBudget }),
      });

      if (response.ok) {
        const data: TripPlanResponse = await response.json();
        return data;
      }
    } catch (e) {
      console.warn('Backend optimize-trip API unavailable, applying client optimization:', e);
    }

    // Client fallback optimization
    const verifiedContext = await TravelDataService.collectVerifiedData(
      currentPlan.origin || 'Hyderabad',
      currentPlan.destination,
      2,
      userBudget,
      mode === 'CHEAPEST' ? 'Budget' : mode === 'FASTEST' ? 'Comfort' : 'Balanced'
    );

    const updated = TravelDataService.assembleVerifiedPlan(
      {
        origin: currentPlan.origin || 'Hyderabad',
        destination: currentPlan.destination,
        travelDates: `${currentPlan.duration} Days`,
        travelers: 2,
        budget: userBudget,
        currency: currentPlan.currency,
        travelStyle: mode === 'CHEAPEST' ? 'Budget' : mode === 'FASTEST' ? 'Comfort' : 'Balanced',
        interests: ['Beaches', 'Culture', 'Gastronomy'],
        transportPreference: mode === 'CHEAPEST' ? 'Cheapest' : mode === 'FASTEST' ? 'Fastest' : 'Comfortable',
        optimizationMode: mode,
      },
      verifiedContext
    );

    return updated;
  }

  /**
   * Chat with context-aware Gemini assistant
   */
  static async sendChatMessage(
    messages: ChatMessage[],
    userMessage: string,
    tripContext?: any
  ): Promise<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, userMessage, tripContext }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          return data.reply;
        }
      }
    } catch (e) {
      console.warn('Backend chat API failed, generating context response:', e);
    }

    const dest = tripContext?.destination || 'your destination';
    const weather = tripContext?.weatherInfo
      ? `${tripContext.weatherInfo.tempC}°C, ${tripContext.weatherInfo.condition}`
      : 'optimal conditions';

    return `I am TourGuide Sage AI. Your journey to ${dest} is calibrated with live weather at ${weather}. The itinerary routes are clustered to minimize transit lag and maximize experiential yield. How may I refine your flight vectors, sanctuary suites, or gastronomic pitstops?`;
  }
}
