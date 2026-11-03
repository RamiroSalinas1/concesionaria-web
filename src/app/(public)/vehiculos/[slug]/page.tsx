import { notFound } from "next/navigation";

// El catálogo publicado está vacío. Nunca resolver fichas desde fixtures de desarrollo.
export default function VehiclePage() {
  notFound();
}
