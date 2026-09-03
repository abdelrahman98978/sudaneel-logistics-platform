import { z } from 'zod';
import { demoMode } from '@/lib/config';
import { fail, ok } from '@/lib/api/respond';
import { getAuthContext } from '@/lib/auth/server';

const paymentSchema = z.object({ amount: z.number().positive(), method: z.string().min(2), reference: z.string().min(2).max(100), idempotencyKey: z.string().min(8).max(100) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = paymentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid payment', 422);
  if (demoMode) return ok({ invoiceId: id, status: 'pending', mode: 'demo' }, 201);
  const { supabase, user, profile } = await getAuthContext();
  if (!supabase) return fail('BACKEND_NOT_CONFIGURED', 'Payment service is not configured', 503);
  if (!user || !profile?.org_id) return fail('UNAUTHENTICATED', 'An organization profile is required', 401);
  const { data: existing } = await supabase.from('payments').select('id, status, reference').eq('reference', parsed.data.idempotencyKey).maybeSingle();
  if (existing) return ok(existing);
  const { data, error } = await supabase.from('payments').insert({ org_id: profile.org_id, invoice_id: id, amount: parsed.data.amount, method: parsed.data.method, reference: parsed.data.reference, notes: `idempotency:${parsed.data.idempotencyKey}`, created_by: user.id }).select('id, invoice_id, amount, status, reference, created_at').single();
  if (error) return fail('DATABASE_ERROR', 'Unable to register payment', 500);
  return ok(data, 201);
}
