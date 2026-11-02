import type { Metadata } from "next";
import { CatalogView } from "@/features/catalog/catalog-view";
import { parseFilters } from "@/lib/catalog-filters";

export const metadata: Metadata = { title: "Catálogo" };

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams);
  return (
    <CatalogView
      key={JSON.stringify(filters)}
      initialFilters={filters}
      maxYear={new Date().getFullYear() + 1}
    />
  );
}
