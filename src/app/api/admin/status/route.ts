import { adminAccess } from "@/lib/auth/admin";

export async function GET() {
  const access = await adminAccess();
  const status =
    access.status === "authorized"
      ? 200
      : access.status === "forbidden"
        ? 403
        : access.status === "unauthenticated"
          ? 401
          : 503;
  return Response.json(
    { authorized: access.status === "authorized" },
    {
      status,
      headers: {
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
