import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = isValidUrl(supabaseUrl) && typeof supabaseAnonKey === "string" && supabaseAnonKey.length > 0;

export const supabase: SupabaseClient | null = (() => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase is not configured. Set valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.");
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn("Failed to initialize Supabase client.", e);
    return null;
  }
})();
