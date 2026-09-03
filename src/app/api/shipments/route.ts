import { z } from 'zod';
import { demoMode } from '@/lib/config';
import { mockShipments } from '@/lib/mock-data';
import { fail, ok } from '@/lib/api/respond';
import { getAuthContext } from '@/lib/auth/server';

const createShipmentSchema = z.object({
  customerId: z.string().uuid().optional(),
  pickupAddress: z.string().trim().min(2),
  pickupCity: z.string().trim().min(2),
  deliveryAddress: z.string().trim().min(2),
  deliveryCity: z.string().trim().min(2),
  cargoType: z.string().trim().min(2).default('general'),
  cargoDescription: z.string().trim().min(2),
  totalWeightKg: z.number().nonnegative().optional(),
  totalVolumeM3: z.number().nonnegative().optional(),
  pickupDate: z.string().optional(),
  deliveryDate: z.string().optional(),
  requiredVehicleType: z.string().optional(),
  priority: z.enum(['normal', 'express', 'critical']).default('normal'),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') ?? 25), 1), 100);

  if (demoMode) return ok(mockShipments.slice(0, limit));

  const { supabase, user } = await getAuthContext();
  if (!supabase) return fail('BACKEND_NOT_CONFIGURED', 'Shipment service is not configured', 503);
  if (!user) return fail('UNAUTHENTICATED', 'Authentication is required', 401);

  const { data, error } = await supabase
    .from('shipments')
    .select('id, tracking_number, status, pickup_city, delivery_city, estimated_eta, updated_at, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return fail('DATABASE_ERROR', 'Unable to load shipments', 500);
  return ok(data ?? []);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createShipmentSchema.safeParse(body);
  if (!parsed.success) return fail('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid shipment', 422);
  if (demoMode) return ok({ ...parsed.data, mode: 'demo' }, 201);

  const { supabase, user, profile } = await getAuthContext();
  if (!supabase) return fail('BACKEND_NOT_CONFIGURED', 'Shipment service is not configured', 503);
  if (!user || !profile?.org_id) return fail('UNAUTHENTICATED', 'An organization profile is required', 401);
  if (!parsed.data.customerId) return fail('VALIDATION_ERROR', 'customerId is required', 422);

  const { data, error } = await supabase.from('shipments').insert({
    org_id: profile.org_id,
    customer_id: parsed.data.customerId,
    pickup_address: parsed.data.pickupAddress,
    pickup_city: parsed.data.pickupCity,
    delivery_address: parsed.data.deliveryAddress,
    delivery_city: parsed.data.deliveryCity,
    cargo_type: parsed.data.cargoType,
    cargo_description: parsed.data.cargoDescription,
    total_weight_kg: parsed.data.totalWeightKg,
    total_volume_m3: parsed.data.totalVolumeM3,
    pickup_date: parsed.data.pickupDate,
    delivery_date: parsed.data.deliveryDate,
    required_vehicle_type: parsed.data.requiredVehicleType,
    priority: parsed.data.priority,
    created_by: user.id,
  }).select('id, tracking_number, status, created_at').single();
  if (error) return fail('DATABASE_ERROR', 'Unable to create shipment', 500);
  return ok(data, 201);
}
