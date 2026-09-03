'use client';

import { createBrowserClient } from '@supabase/ssr';
import { hasSupabaseConfig, supabaseConfig } from '@/lib/config';

export function getSupabaseBrowserClient() {
  if (!hasSupabaseConfig) return null;
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey);
}
