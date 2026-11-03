import { publicClient } from "@/lib/supabase/server";

export async function GET() {
  const client = publicClient();
  const headers = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (!client)
    return Response.json(
      { error: "Catálogo sin conexión" },
      { status: 503, headers },
    );
  const result = await client
    .schema("catalog")
    .from("vehicles")
    .select(
      "id,slug,vehicle_type,brand,model,variant,year,kilometers,condition,description,price_mode,price_amount,currency,availability,published_at",
    )
    .order("published_at", { ascending: false })
    .order("id")
    .limit(50);
  if (result.error)
    return Response.json(
      { error: "Catálogo no disponible" },
      { status: 503, headers },
    );
  return Response.json({ vehicles: result.data }, { headers });
}
