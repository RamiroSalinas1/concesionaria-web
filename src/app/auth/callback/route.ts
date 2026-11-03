import { NextResponse, type NextRequest } from "next/server";
import { authIsHardened, sessionClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const origin = process.env.SITE_URL;
  if (!origin) return new Response(null, { status: 503 });
  const destination = new URL("/admin/login?estado=error", origin);
  const code = request.nextUrl.searchParams.get("code");
  const client = await sessionClient();
  if (client && code && code.length < 4096 && (await authIsHardened())) {
    const result = await client.auth.exchangeCodeForSession(code);
    if (!result.error) {
      const identity = await client.auth.getUser();
      const allowed = await client.rpc("is_admin");
      if (
        !identity.error &&
        identity.data.user &&
        !allowed.error &&
        allowed.data === true
      )
        destination.pathname = "/admin/clave";
      else await client.auth.signOut();
    }
  }
  if (destination.pathname === "/admin/clave") destination.search = "";
  const response = NextResponse.redirect(destination);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
