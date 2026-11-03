import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ExampleVehiclePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (process.env.NODE_ENV === "development") {
    const query = await searchParams;
    const [
      { exampleVehicle },
      { VehicleDetail },
      { SiteHeader },
      { SiteFooter },
      { DevelopmentTools },
    ] = await Promise.all([
      import("@/dev/example-vehicle"),
      import("@/features/vehicles/vehicle-detail"),
      import("@/components/site-header"),
      import("@/components/site-footer"),
      import("@/components/development-tools"),
    ]);
    const vehicle = {
      ...exampleVehicle,
      price:
        query.precio === "consultar"
          ? { mode: "on_request" as const }
          : exampleVehicle.price,
      images: query.galeria === "vacia" ? [] : exampleVehicle.images,
    };
    return (
      <>
        <SiteHeader />
        <main id="contenido" tabIndex={-1}>
          <nav
            className="container demo-variants"
            aria-label="Variantes de la ficha de ejemplo"
          >
            <span>Solo para revisar el diseño:</span>
            <Link href="/desarrollo/ficha">Precio y galería</Link>
            <Link href="/desarrollo/ficha?precio=consultar">
              Precio a consultar
            </Link>
            <Link href="/desarrollo/ficha?galeria=vacia">Sin imágenes</Link>
          </nav>
          <VehicleDetail vehicle={vehicle} />
        </main>
        <SiteFooter />
        <DevelopmentTools />
      </>
    );
  }
  notFound();
}
