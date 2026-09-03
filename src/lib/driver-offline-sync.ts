/**
 * Sudaneel Logistics - Driver Offline Sync Engine
 * Handles local caching and queueing of telemetry and delivery proofs
 * when drivers traverse low-connectivity desert highways (e.g. Atbara-Port Sudan corridor).
 */

export interface QueuedTelemetryEvent {
  id: string;
  type: 'gps_ping' | 'checkpoint' | 'seal_verified' | 'pod_signature' | 'incident';
  timestamp: string;
  payload: Record<string, any>;
  synced: boolean;
}

const STORAGE_KEY = 'sdn_driver_offline_queue';

export function getOfflineQueue(): QueuedTelemetryEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read offline queue:', err);
    return [];
  }
}

export function queueOfflineEvent(event: Omit<QueuedTelemetryEvent, 'id' | 'synced'>): QueuedTelemetryEvent {
  const newEvent: QueuedTelemetryEvent = {
    ...event,
    id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    synced: false,
  };

  if (typeof window !== 'undefined') {
    try {
      const current = getOfflineQueue();
      current.push(newEvent);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (err) {
      console.error('Failed to save offline event:', err);
    }
  }

  return newEvent;
}

export function clearOfflineQueue(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear offline queue:', err);
    }
  }
}

export function syncOfflineQueueToServer(): Promise<{ count: number; success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const queue = getOfflineQueue();
      const count = queue.length;
      clearOfflineQueue();
      resolve({ count, success: true });
    }, 1200);
  });
}
