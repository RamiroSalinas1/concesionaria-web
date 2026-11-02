import type { VehicleViewModel } from "@/types/vehicle";

// Única fuente de datos de muestra. Importar solo dentro de ramas NODE_ENV === development.
export const exampleVehicle: VehicleViewModel = {
  title: "Coupé de ejemplo",
  subtitle: "Estudio de diseño · Datos ficticios",
  condition: "Usado",
  year: 2024,
  kilometers: 18500,
  transmission: "Automática",
  fuel: "Nafta",
  description:
    "Esta ficha permite evaluar la galería, la jerarquía de información y las opciones de pago. El vehículo, sus características y el precio son ejemplos de diseño: no representan una unidad real y no se pueden consultar ni reservar.",
  price: { mode: "fixed", amount: 38500, currency: "USD" },
  paymentMethods: ["cash", "bank_transfer", "financing", "trade_in"],
  images: [
    { id: "concept-red", label: "Estudio rojo", tone: "red" },
    { id: "concept-silver", label: "Estudio plata", tone: "silver" },
    { id: "concept-dark", label: "Estudio grafito", tone: "dark" },
  ],
  example: true,
};
