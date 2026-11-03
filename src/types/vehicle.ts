import type { paymentMethods } from "@/config/site";

export type PaymentMethod = (typeof paymentMethods)[number]["id"];
export interface VehicleViewModel {
  title: string;
  subtitle: string;
  condition: string;
  year: number;
  kilometers: number | null;
  transmission: string | null;
  fuel: string | null;
  description: string;
  price:
    | { mode: "fixed"; amount: number; currency: "ARS" | "USD" }
    | { mode: "on_request" };
  paymentMethods: PaymentMethod[];
  images: { id: string; label: string; tone: "red" | "silver" | "dark" }[];
  example: boolean;
}
