import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <Link href="/" aria-label={`${siteConfig.name} — Inicio`}>
          <Brand compact />
        </Link>
        <p>{siteConfig.copy.footer}</p>
        <nav aria-label="Navegación del pie">
          <Link href="/">Inicio</Link>
          <Link href="/catalogo">Catálogo</Link>
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>{siteConfig.name}</span>
        <span>Autos / Motos / Otros vehículos</span>
      </div>
      {siteConfig.contact.email ||
      siteConfig.contact.whatsapp ||
      siteConfig.social.length ? (
        <div className="container footer-contacts">
          {siteConfig.contact.email ? (
            <a href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </a>
          ) : null}
          {siteConfig.contact.whatsapp ? (
            <a href={`https://wa.me/${siteConfig.contact.whatsapp}`}>
              WhatsApp
            </a>
          ) : null}
          {siteConfig.social.map((item) => (
            <a key={item.href} href={item.href} rel="noreferrer">
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </footer>
  );
}
