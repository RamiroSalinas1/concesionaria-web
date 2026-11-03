import { vehicleTypes } from "@/config/site";

export interface CatalogFilters {
  tipo: string;
  condicion: string;
  anioDesde: string;
  anioHasta: string;
  moneda: string;
  precioDesde: string;
  precioHasta: string;
}

export const emptyFilters: CatalogFilters = {
  tipo: "",
  condicion: "",
  anioDesde: "",
  anioHasta: "",
  moneda: "",
  precioDesde: "",
  precioHasta: "",
};

export function parseFilters(
  params: Record<string, string | string[] | undefined>,
): CatalogFilters {
  const string = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : "";
  const integer = (key: string, min: number, max: number) => {
    const value = string(key);
    return /^\d{1,12}$/.test(value) &&
      Number(value) >= min &&
      Number(value) <= max
      ? String(Number(value))
      : "";
  };
  const moneda = ["ARS", "USD"].includes(string("moneda"))
    ? string("moneda")
    : "";
  return {
    tipo: vehicleTypes.some((type) => type.value === string("tipo"))
      ? string("tipo")
      : "",
    condicion: ["usado", "0km"].includes(string("condicion"))
      ? string("condicion")
      : "",
    anioDesde: integer("anioDesde", 1900, new Date().getFullYear() + 1),
    anioHasta: integer("anioHasta", 1900, new Date().getFullYear() + 1),
    moneda,
    precioDesde: moneda ? integer("precioDesde", 0, 999999999999) : "",
    precioHasta: moneda ? integer("precioHasta", 0, 999999999999) : "",
  };
}

export function filtersToSearchParams(filters: CatalogFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params;
}
