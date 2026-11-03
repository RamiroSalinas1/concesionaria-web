import "server-only";
import { redirect } from "next/navigation";
import { sessionClient } from "@/lib/supabase/server";

export async function adminAccess() {
  const client = await sessionClient();
  if (!client) return { status: "unconfigured" as const };
  try {
    // Fresh provider validation; never trust getSession().user or user_metadata.
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) return { status: "unauthenticated" as const };
    const allowed = await client.rpc("is_admin");
    if (allowed.error) return { status: "unavailable" as const };
    if (allowed.data !== true) return { status: "forbidden" as const };
    return { status: "authorized" as const, client };
  } catch {
    return { status: "unavailable" as const };
  }
}

// Call from every protected page/action, regardless of layout/proxy checks.
export async function requireAdmin() {
  const access = await adminAccess();
  if (access.status !== "authorized") redirect("/admin/login?estado=acceso");
  return access.client;
}
