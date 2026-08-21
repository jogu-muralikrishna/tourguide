import { Vehicle, Hotel, Pitstop } from '../src/types';
import { db } from './db';
import { computeRouteDistanceAsync, computeRouteDistance } from './geoService';

// Generates dynamic car fleet options tailored to the actual calculated route distance
export async function getDynamicFleetAsync(fromCity: string, toCity: string): Promise<Vehicle[]> {
  const telemetry = await computeRouteDistanceAsync(fromCity, toCity);
  const distanceKm = telemetry.roadDistanceKm;
  const baseVehicles = db.getVehicles();

  return baseVehicles.map((v) => {
    let ratePerKm = 5.0;

    if (v.id === 'car-dzire') {
      ratePerKm = 3.5;
    } else if (v.id === 'car-innova-crysta') {
      ratePerKm = 5.5;
    } else if (v.id === 'car-xuv700') {
      ratePerKm = 6.2;
    } else if (v.id === 'car-fortuner') {
      ratePerKm = 7.8;
    } else if (v.id === 'car-mercedes-e') {
      ratePerKm = 12.5;
    }

    // Calculate dynamic rounded price based on real road distance
    const dynamicPrice = Math.max(1200, Math.round((distanceKm * ratePerKm) / 50) * 50);

    return {
      ...v,
      price: dynamicPrice,
      travelTime: telemetry.carEstimatedHours,
      distanceKm,
      estimatedPriceNotice: `Estimated price for ${distanceKm} km trip`,
    };
  });
}

export function getDynamicFleet(fromCity: string, toCity: string): Vehicle[] {
  const telemetry = computeRouteDistance(fromCity, toCity);
  const distanceKm = telemetry.roadDistanceKm;
  const baseVehicles = db.getVehicles();

  return baseVehicles.map((v) => {
    let ratePerKm = 5.0;

    if (v.id === 'car-dzire') {
      ratePerKm = 3.5;
    } else if (v.id === 'car-innova-crysta') {
      ratePerKm = 5.5;
    } else if (v.id === 'car-xuv700') {
      ratePerKm = 6.2;
    } else if (v.id === 'car-fortuner') {
      ratePerKm = 7.8;
    } else if (v.id === 'car-mercedes-e') {
      ratePerKm = 12.5;
    }

    const dynamicPrice = Math.max(1200, Math.round((distanceKm * ratePerKm) / 50) * 50);

    return {
      ...v,
      price: dynamicPrice,
      travelTime: telemetry.carEstimatedHours,
      distanceKm,
      estimatedPriceNotice: `Estimated price for ${distanceKm} km trip`,
    };
  });
}

// Generates hotels for target destination
export function getDestinationHotels(destinationCity: string): Hotel[] {
  return db.getHotels(destinationCity);
}

// Generates food stops along the route corridor
export async function getCorridorPitstopsAsync(fromCity: string, toCity: string): Promise<Pitstop[]> {
  const telemetry = await computeRouteDistanceAsync(fromCity, toCity);
  const basePitstops = db.getPitstops();

  return basePitstops.map((p, idx) => ({
    ...p,
    location: `${telemetry.highwayCorridor} - Food Plaza ${Math.round((telemetry.roadDistanceKm / (basePitstops.length + 1)) * (idx + 1))} km`,
  }));
}

export function getCorridorPitstops(fromCity: string, toCity: string): Pitstop[] {
  const telemetry = computeRouteDistance(fromCity, toCity);
  const basePitstops = db.getPitstops();

  return basePitstops.map((p, idx) => ({
    ...p,
    location: `${telemetry.highwayCorridor} - Food Plaza ${Math.round((telemetry.roadDistanceKm / (basePitstops.length + 1)) * (idx + 1))} km`,
  }));
}

