import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

// Client-side anon key (safe to expose)
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Server-side key (service_role preferred, falls back to anon)
const supabaseServerKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_ANON_KEY
  || supabaseAnonKey;

export const supabase = supabaseUrl && supabaseServerKey
  ? createClient(supabaseUrl, supabaseServerKey)
  : null;

export const STORAGE_BUCKET = 'uploads';

// Table names
export const TABLES = {
  announcements: 'announcements',
  media: 'media',
};
