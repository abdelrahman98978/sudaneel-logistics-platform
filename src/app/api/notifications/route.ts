import { demoMode } from '@/lib/config';
import { fail, ok } from '@/lib/api/respond';
import { getAuthContext } from '@/lib/auth/server';

export async function GET() {
  if (demoMode) return ok([]);
  const { supabase, user } = await getAuthContext();
  if (!supabase) return fail('BACKEND_NOT_CONFIGURED', 'Notification service is not configured', 503);
  if (!user) return fail('UNAUTHENTICATED', 'Authentication is required', 401);
  const { data, error } = await supabase.from('notifications').select('id, type, priority, title, title_ar, message, message_ar, link, is_read, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100);
  if (error) return fail('DATABASE_ERROR', 'Unable to load notifications', 500);
  return ok(data ?? []);
}
