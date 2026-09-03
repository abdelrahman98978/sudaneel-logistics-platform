import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function getAuthContext() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { supabase: null, user: null, profile: null };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, profile: null };
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, org_id, branch_id, role, full_name, email')
    .eq('id', user.id)
    .maybeSingle();
  return { supabase, user, profile };
}
