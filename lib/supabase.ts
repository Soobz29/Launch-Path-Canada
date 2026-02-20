import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || supabaseUrl === 'undefined') {
  console.error('VITE_SUPABASE_URL is not set');
}

if (!supabaseAnonKey || supabaseAnonKey === 'undefined') {
  console.error('VITE_SUPABASE_ANON_KEY is not set');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return !!supabaseUrl && supabaseUrl !== 'undefined' && supabaseUrl !== 'https://placeholder.supabase.co';
};
