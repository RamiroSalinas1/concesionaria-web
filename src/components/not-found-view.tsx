import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export function NotFoundView({ vehicle = false }: { vehicle?: boolean }) {
  return (
    <section className="container not-found-view">
      <span className="outline-number" aria-hidden="true">
        404
      </span>
      <p className="eyebrow">
        <span className="red-dash" />
        Probemos otro camino
      </p>
      <h1>{vehicle ? "Vehículo no encontrado." : "Este camino no existe."}</h1>
      <p>
        {vehicle
          ? "Este vehículo no está publicado o la dirección no es correcta."
          : "La página que buscás no está disponible."}
      </p>
      <div className="hero-actions">
        <Link className="button button-primary" href="/catalogo">
          Explorar catálogo
          <ArrowUpRight size={19} aria-hidden="true" />
        </Link>
        <Link className="text-link" href="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
