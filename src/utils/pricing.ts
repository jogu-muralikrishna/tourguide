import { Vehicle, Hotel, Pitstop, SelectedFoodItem, PricingDetails } from '../types';

export interface CalculatePricingParams {
  vehicle: Vehicle | null;
  hotel: Hotel | null;
  hotelNights: number;
  pitstops?: Pitstop[];
  selectedFoodItems?: SelectedFoodItem[];
  numberOfPeople?: number;
  includeTaxes?: boolean;
  taxRatePercent?: number;
}

export const BASE_SERVICE_FEE = 500;

export function calculatePricing({
  vehicle,
  hotel,
  hotelNights = 1,
  pitstops = [],
  selectedFoodItems = [],
  numberOfPeople = 1,
  includeTaxes = false,
  taxRatePercent = 0,
}: CalculatePricingParams): PricingDetails {
  const people = Math.max(1, numberOfPeople || 1);
  const carCost = vehicle ? vehicle.price : 0;
  const safeNights = hotel ? Math.max(1, hotelNights) : 0;
  const hotelCost = hotel ? hotel.pricePerNight * safeNights : 0;

  // Calculate food items total based on item price * people * quantity
  let foodCost = 0;
  if (selectedFoodItems && selectedFoodItems.length > 0) {
    foodCost = selectedFoodItems.reduce((acc, item) => {
      const itemPrice = Number(item.pricePerPerson) || 0;
      const qty = Math.max(1, item.quantity || 1);
      return acc + (itemPrice * people * qty);
    }, 0);
  } else if (pitstops && pitstops.length > 0) {
    // Fallback if stops were added without explicit item breakdown
    foodCost = pitstops.reduce((acc, p) => acc + ((Number(p.price) || Number(p.estimatedCost) || 0) * people), 0);
  }

  // Base service fee applies when at least one trip component is selected
  const hasSelections = Boolean(vehicle || hotel || foodCost > 0 || pitstops.length > 0);
  const serviceFee = hasSelections ? BASE_SERVICE_FEE : 0;

  const subtotalBeforeTax = carCost + hotelCost + foodCost + serviceFee;
  const tax = includeTaxes ? Math.round((subtotalBeforeTax * taxRatePercent) / 100) : 0;
  const finalTotal = subtotalBeforeTax + tax;

  return {
    carCost,
    vehicleCost: carCost,
    vehiclePrice: carCost,
    hotelCost,
    hotelPrice: hotelCost,
    hotelNights: safeNights,
    hotelPricePerNight: hotel ? hotel.pricePerNight : 0,
    foodCost,
    pitstopCost: foodCost,
    foodPrice: foodCost,
    selectedFoodItems,
    numberOfPeople: people,
    serviceFee,
    tax,
    taxesAndFees: tax,
    finalTotal,
    total: finalTotal,
  };
}

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === undefined || amount === null) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

