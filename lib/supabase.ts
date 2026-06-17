import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Service-role Supabase client. Bypasses RLS, so it is server-only and must
 * never be imported into client code (`server-only` enforces this at build).
 * Built lazily via a factory so env vars are read at request time, not at
 * module import / build time.
 */
export function createServiceClient(): SupabaseClient {
  return createClient(
    required("SUPABASE_URL"),
    required("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export const SKETCHES_BUCKET = "sketches";
