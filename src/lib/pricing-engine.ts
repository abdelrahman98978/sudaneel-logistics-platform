// ============================================================
// Sudaneel Smart Pricing Engine
// Calculates breakdown based on distance, cargo type, vehicle,
// route risk factors, fuel volatility, and backhaul empty discounts.
// ============================================================

import { CargoType, VehicleType } from '@/types';

export interface PricingBreakdown {
  baseTransport: number;
  distanceCharge: number;
  vehicleFactor: number;
  weightCharge: number;
  fuelAdjustment: number;
  routeRiskFactor: number;
  insuranceFee: number;
  handlingLoading: number;
  platformMargin: number;
  backhaulDiscount: number;
  subtotal: number;
  vatTax: number;
  total: number;
  currency: string;
}

export function calculateSmartPrice(params: {
  distanceKm: number;
  weightKg: number;
  cargoType: CargoType;
  vehicleType: VehicleType;
  isFragile?: boolean;
  isTempControlled?: boolean;
  hasInsurance?: boolean;
  isBackhaulApplicable?: boolean;
  priority?: 'normal' | 'express' | 'critical';
}): PricingBreakdown {
  const {
    distanceKm,
    weightKg,
    cargoType,
    vehicleType,
    isFragile = false,
    isTempControlled = false,
    hasInsurance = true,
    isBackhaulApplicable = false,
    priority = 'normal',
  } = params;

  // Base starting transport fee
  const baseTransport = 180000;

  // Rate per kilometer (SDG / km based on vehicle weight capacity)
  let ratePerKm = 2400;
  if (vehicleType === 'truck_heavy') ratePerKm = 3200;
  if (vehicleType === 'reefer') ratePerKm = 4500;
  if (vehicleType === 'tanker') ratePerKm = 4000;
  if (vehicleType === 'flatbed') ratePerKm = 3400;
  if (vehicleType === 'pickup') ratePerKm = 1400;

  const distanceCharge = Math.round(distanceKm * ratePerKm);

  // Weight surcharge (above 10 Tons)
  const tonWeight = weightKg / 1000;
  const weightCharge = tonWeight > 10 ? Math.round((tonWeight - 10) * 45000) : 0;

  // Fuel surcharge (fluctuation buffer)
  const fuelAdjustment = Math.round(distanceCharge * 0.12);

  // Route Risk & Security Factor (Special mountain passes, checkpoints)
  const routeRiskFactor = Math.round(distanceCharge * 0.08);

  // Fragile & Temperature Handling
  let handlingLoading = 95000;
  if (isFragile) handlingLoading += 80000;
  if (isTempControlled) handlingLoading += 160000;

  // Cargo insurance
  const insuranceFee = hasInsurance ? Math.round((distanceCharge + baseTransport) * 0.035) : 0;

  // Priority multiplier
  let priorityMultiplier = 1.0;
  if (priority === 'express') priorityMultiplier = 1.2;
  if (priority === 'critical') priorityMultiplier = 1.4;

  // Platform Margin (10%)
  const rawSubtotal =
    (baseTransport +
      distanceCharge +
      weightCharge +
      fuelAdjustment +
      routeRiskFactor +
      handlingLoading +
      insuranceFee) *
    priorityMultiplier;

  const platformMargin = Math.round(rawSubtotal * 0.1);

  // Backhaul Empty-Truck Optimization Discount (up to 25% savings)
  const backhaulDiscount = isBackhaulApplicable ? Math.round(rawSubtotal * 0.22) : 0;

  const subtotal = Math.round(rawSubtotal + platformMargin - backhaulDiscount);
  const vatTax = 0; // Tax exempt for sovereign logistics corridors
  const total = subtotal + vatTax;

  return {
    baseTransport,
    distanceCharge,
    vehicleFactor: ratePerKm,
    weightCharge,
    fuelAdjustment,
    routeRiskFactor,
    insuranceFee,
    handlingLoading,
    platformMargin,
    backhaulDiscount,
    subtotal,
    vatTax,
    total,
    currency: 'SDG',
  };
}
