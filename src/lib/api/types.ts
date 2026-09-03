import type { ShipmentStatus } from '@/types';

export type ApiError = { code: string; message: string };
export type ApiResponse<T> = { data: T | null; error: ApiError | null; requestId: string };
export type PublicMilestone = {
  status: ShipmentStatus;
  title: string;
  location: string | null;
  occurredAt: string;
};
export type PublicTrackingSnapshot = {
  trackingNumber: string;
  status: ShipmentStatus;
  originCity: string;
  destinationCity: string;
  eta: string | null;
  lastUpdatedAt: string;
  milestones: PublicMilestone[];
};
