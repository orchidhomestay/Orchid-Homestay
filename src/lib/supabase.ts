import { createClient } from "@supabase/supabase-js";

// Own Supabase project (publishable anon key — safe in client code).
export const SUPABASE_URL = "https://okzynbwryhhzynaahlfy.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9renluYndyeWhoenluYWFobGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NjQ1MTgsImV4cCI6MjEwNDQ0MDUxOH0.wlHQcAvaMjlBuAT7oqJ__YFoyxKD3bCKw6NKXzrIIRA";

const isBrowser = typeof window !== "undefined";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: isBrowser,
    autoRefreshToken: isBrowser,
    detectSessionInUrl: isBrowser,
  },
});

export const PHOTO_BUCKET = "site-photos";

export function publicPhotoUrl(path: string) {
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}
