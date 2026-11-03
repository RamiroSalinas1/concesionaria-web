import { createClient } from "@supabase/supabase-js";
import { publicClient } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

const mediaHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
};
const missing = () =>
  new Response(null, { status: 404, headers: mediaHeaders });

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      reference,
    )
  )
    return missing();
  const config = supabaseConfig();
  const reader = publicClient();
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!config || !reader || !secret) return missing();
  // Public reference first. No path/bucket parameter and no signed URL.
  const visible = await reader
    .schema("catalog")
    .from("media_references")
    .select("id")
    .eq("id", reference)
    .maybeSingle();
  if (visible.error || !visible.data) return missing();
  const storage = createClient<Database>(config.url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const resolved = await storage.rpc("resolve_published_media", { reference });
  const asset = resolved.data?.[0];
  if (
    resolved.error ||
    !asset ||
    asset.bucket_id !== "vehicle-media" ||
    !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
      asset.mime_type,
    )
  )
    return missing();
  const result = await storage.storage
    .from(asset.bucket_id)
    .download(asset.object_path);
  if (result.error || !result.data) return missing();
  // Recheck after download: withdrawal during I/O cannot start a new response.
  const stillVisible = await reader
    .schema("catalog")
    .from("media_references")
    .select("id")
    .eq("id", reference)
    .maybeSingle();
  if (stillVisible.error || !stillVisible.data) return missing();
  return new Response(result.data, {
    headers: { ...mediaHeaders, "Content-Type": asset.mime_type },
  });
}
