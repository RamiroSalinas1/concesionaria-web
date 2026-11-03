import type { Database as GeneratedDatabase } from "./database.generated";

export interface PublishedVehicle {
  id: string;
  slug: string;
  vehicle_type: "car" | "motorcycle" | "other";
  brand: string;
  model: string;
  variant: string | null;
  year: number;
  kilometers: number | null;
  condition: "new" | "used";
  description: string | null;
  price_mode: "fixed" | "on_request";
  price_amount: number | null;
  currency: "ARS" | "USD" | null;
  availability: "available" | "reserved" | "sold";
  published_at: string;
}
type ReadOnlyTable<Row> = {
  Row: Row;
  Insert: never;
  Update: never;
  Relationships: [];
};
// MCP currently generates public only. This narrow catalog read contract mirrors
// the versioned migration; private schemas are never added to a browser client.
export type Database = GeneratedDatabase & {
  catalog: {
    Tables: {
      vehicles: ReadOnlyTable<PublishedVehicle>;
      media_references: ReadOnlyTable<{
        id: string;
        vehicle_id: string | null;
        site_slot: boolean | null;
        position: number;
        alt_text: string;
        is_cover: boolean;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
