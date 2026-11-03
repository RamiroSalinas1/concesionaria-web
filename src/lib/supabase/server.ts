import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseConfig } from "./config";
import type { Database } from "@/types/database";

export async function sessionClient() {
  const config = supabaseConfig();
  if (!config) return null;
  const jar = await cookies();
  return createServerClient<Database>(config.url, config.key, {
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.SITE_URL?.startsWith("https://") ?? false,
    },
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => {
        try {
          values.forEach(({ name, value, options }) =>
            jar.set(name, value, options),
          );
        } catch {
          // Server Components cannot write cookies; Proxy handles refresh.
        }
      },
    },
  });
}

// This client never inherits the visitor's cookies or an administrative key.
export function publicClient() {
  const config = supabaseConfig();
  return config
    ? createClient<Database>(config.url, config.key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
        global: {
          fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
        },
      })
    : null;
}

export async function authIsHardened() {
  const config = supabaseConfig();
  if (!config) return false;
  try {
    const response = await fetch(`${config.url}/auth/v1/settings`, {
      headers: { apikey: config.key },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return false;
    const settings = await response.json();
    return (
      settings.disable_signup === true &&
      settings.external?.anonymous_users === false
    );
  } catch {
    return false;
  }
}
