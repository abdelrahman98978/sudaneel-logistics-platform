import { z } from 'zod';
import { demoMode } from '@/lib/config';
import { fail, ok } from '@/lib/api/respond';
import { getAuthContext } from '@/lib/auth/server';

const schema = z.object({ warehouseId: z.string().uuid(), reservedAreaM2: z.number().positive(), startDate: z.string().min(8), endDate: z.string().min(8) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid reservation', 422);
  if (demoMode) return ok({ ...parsed.data, status: 'pending', mode: 'demo' }, 201);
  const { supabase, user } = await getAuthContext();
  if (!supabase) return fail('BACKEND_NOT_CONFIGURED', 'Warehouse service is not configured', 503);
  if (!user) return fail('UNAUTHENTICATED', 'Authentication is required', 401);
  return fail('NOT_IMPLEMENTED', 'Warehouse reservation schema is not configured', 501);
}
