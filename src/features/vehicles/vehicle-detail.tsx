import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Gauge,
  Fuel,
  Cog,
  Check,
  Info,
} from "lucide-react";
import { paymentMethods } from "@/config/site";
import type { VehicleViewModel } from "@/types/vehicle";
import { VehicleGallery } from "./vehicle-gallery";

export function VehicleDetail({ vehicle }: { vehicle: VehicleViewModel }) {
  const features = [
    { label: "Año", value: vehicle.year, icon: CalendarDays },
    {
      label: "Kilometraje",
      value:
        vehicle.kilometers === null
          ? null
          : new Intl.NumberFormat("es-AR").format(vehicle.kilometers) + " km",
      icon: Gauge,
    },
    { label: "Transmisión", value: vehicle.transmission, icon: Cog },
    { label: "Combustible", value: vehicle.fuel, icon: Fuel },
  ].filter((feature) => feature.value !== null);
  return (
    <section className="container vehicle-page">
      <Link className="back-link" href="/catalogo">
        <ArrowLeft size={16} aria-hidden="true" />
        Volver al catálogo
      </Link>
      {vehicle.example ? (
        <div className="demo-notice">
          <Info size={18} aria-hidden="true" />
          <p>
            <strong>Ficha de ejemplo · Solo desarrollo.</strong> Todos los datos
            e ilustraciones son ficticios. No es inventario real ni una oferta
            comercial.
          </p>
        </div>
      ) : null}
      <div className="vehicle-heading">
        <div>
          <p className="eyebrow">
            <span className="red-dash" />
            {vehicle.condition}
            {vehicle.example ? " · EJEMPLO" : ""}
          </p>
          <h1>{vehicle.title}</h1>
          <p>{vehicle.subtitle}</p>
        </div>
        <span className="outline-tag">
          {vehicle.example ? "Unidad de muestra" : vehicle.condition}
        </span>
      </div>
      <div className="vehicle-layout">
        <div>
          <VehicleGallery images={vehicle.images} />
          <div className="vehicle-features">
            {features.map((feature) => (
              <div key={feature.label}>
                <feature.icon size={23} strokeWidth={1.4} aria-hidden="true" />
                <span>{feature.label}</span>
                <strong>{feature.value}</strong>
              </div>
            ))}
          </div>
          <section className="vehicle-description">
            <p className="eyebrow">En detalle</p>
            <h2>Una mirada más de cerca.</h2>
            <p>{vehicle.description}</p>
          </section>
        </div>
        <aside className="vehicle-summary">
          <span className="small-label">
            {vehicle.example ? "PRECIO ILUSTRATIVO" : "PRECIO"}
          </span>
          <p className="vehicle-price">
            {vehicle.price.mode === "fixed" ? (
              <>
                <span>{vehicle.price.currency}</span>
                {new Intl.NumberFormat("es-AR", {
                  maximumFractionDigits: 0,
                }).format(vehicle.price.amount)}
              </>
            ) : (
              "Consultar precio"
            )}
          </p>
          <p className="field-note">
            {vehicle.example
              ? "Importe ficticio para evaluar el diseño."
              : "Precio en la moneda indicada."}
          </p>
          <div className="summary-divider" />
          <h2>Formas de pago</h2>
          <ul className="payment-list">
            {paymentMethods
              .filter((method) => vehicle.paymentMethods.includes(method.id))
              .map((method) => (
                <li key={method.id}>
                  <Check size={16} aria-hidden="true" />
                  {method.label}
                </li>
              ))}
          </ul>
          {vehicle.example ? (
            <p className="field-note">
              Opciones de ejemplo. Sin tasas, cuotas ni condiciones comerciales.
            </p>
          ) : null}
          <div className="summary-divider" />
          <div className="contact-unavailable">
            <Info size={17} aria-hidden="true" />
            <p>No hay canales de contacto configurados.</p>
          </div>
          <Link className="button button-outline" href="/catalogo">
            Volver al catálogo
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </section>
  );
}
