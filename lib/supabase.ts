import { createClient } from '@supabase/supabase-js';

// Helper to safely access env vars in various environments (Vite, CRA, or direct ESM)
const getEnvVar = (key: string, fallback: string) => {
  try {
    // Try import.meta.env (Vite)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
    // Try process.env (Node/CRA/Webpack)
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      // @ts-ignore
      return process.env[key];
    }
  } catch (e) {
    // Ignore errors
  }
  return fallback;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', getEnvVar('REACT_APP_SUPABASE_URL', 'https://placeholder.supabase.co'));
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', getEnvVar('REACT_APP_SUPABASE_ANON_KEY', 'placeholder'));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co';
};