"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  CarFront,
  Palette,
  LayoutTemplate,
  Mail,
  History,
  ChevronRight,
  LockKeyhole,
  Eye,
  GripVertical,
  CircleHelp,
  FlaskConical,
  Plus,
  Check,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { EmptyState } from "@/components/empty-state";
import { fontPairs, siteConfig } from "@/config/site";

import {
  adminSections as sectionDefinitions,
  type AdminSection,
} from "./admin-sections";

const sectionIcons = {
  vehiculos: CarFront,
  apariencia: Palette,
  contenido: LayoutTemplate,
  contacto: Mail,
  historial: History,
};
const adminSections = sectionDefinitions.map((section) => ({
  ...section,
  icon: sectionIcons[section.id],
}));
function AppearanceDemo() {
  const [name, setName] = useState(siteConfig.name);
  const [accent, setAccent] = useState(siteConfig.theme.accent);
  const colors = [siteConfig.theme.accent, "#a82936", "#ad4932"];
  return (
    <div className="appearance-grid">
      <section className="admin-card">
        <div className="card-heading">
          <h2>Identidad visual</h2>
          <span className="outline-tag">Vista local</span>
        </div>
        <label className="field">
          Nombre de muestra
          <input
            value={name}
            maxLength={70}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <div className="field">
          Color de acento
          <div className="color-options">
            {colors.map((color) => (
              <button
                key={color}
                aria-label={"Usar color " + color}
                aria-pressed={accent === color}
                style={{ background: color }}
                onClick={() => setAccent(color)}
              >
                {accent === color ? (
                  <Check size={19} aria-hidden="true" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
        <label className="field">
          Tipografía disponible
          <input readOnly value={fontPairs[siteConfig.theme.fontPair].label} />
        </label>
        <p className="field-note">
          Estos controles cambian solo la muestra de al lado. Se pierden al
          salir o recargar. No guardan ni publican.
        </p>
      </section>
      <section className="admin-card appearance-preview">
        <span className="small-label">VISTA DE MUESTRA</span>
        <div className="mini-site">
          <span className="mini-site-name">{name || "Nombre de muestra"}</span>
          <div className="mini-orbit" style={{ borderColor: accent }} />
          <h3>
            {siteConfig.copy.home.title[0]}
            <br />
            {siteConfig.copy.home.title[1]}
          </h3>
          <span className="mini-cta" style={{ background: accent }}>
            {siteConfig.copy.catalogCta}
            <ArrowUpRight size={15} aria-hidden="true" />
          </span>
        </div>
        <p className="field-note">
          La vista pública conserva la configuración inicial.
        </p>
      </section>
    </div>
  );
}

function ContentDemo() {
  return (
    <section className="admin-card">
      <div className="card-heading">
        <h2>Secciones del inicio</h2>
        <span className="outline-tag">Solo estructura</span>
      </div>
      <p className="muted">
        El orden, la visibilidad y los textos se podrán editar en una etapa
        posterior.
      </p>
      <div className="section-list">
        {siteConfig.sections.map((section, index) => (
          <div key={section.id}>
            <GripVertical size={17} aria-hidden="true" />
            <span className="section-index">{"0" + (index + 1)}</span>
            <strong>
              {
                {
                  hero: "Portada",
                  categories: "Tipos de vehículo",
                  featured: "Destacados",
                }[section.id]
              }
            </strong>
            <span className="visibility-label">
              <Eye size={14} aria-hidden="true" />
              {section.visible ? "Visible" : "Oculta"}
            </span>
          </div>
        ))}
      </div>
      <label className="field">
        Título actual de portada
        <input readOnly value={siteConfig.copy.home.title.join(" ")} />
      </label>
      <label className="field">
        Texto actual
        <textarea readOnly rows={3} value={siteConfig.copy.home.description} />
      </label>
      <p className="field-note">
        La reordenación y la edición persistente todavía no están habilitadas.
      </p>
    </section>
  );
}

function ContactDemo() {
  return (
    <section className="admin-card">
      <div className="card-heading">
        <h2>Canales del negocio</h2>
        <span className="outline-tag">Sin configurar</span>
      </div>
      <p className="muted">Los campos vacíos se ocultan del sitio público.</p>
      <div className="contact-demo-grid">
        {[
          "WhatsApp",
          "Correo comercial",
          "Redes sociales",
          "Dirección y horarios",
        ].map((label) => (
          <label className="field" key={label}>
            {label}
            <input readOnly value="" placeholder="Sin configurar" />
          </label>
        ))}
      </div>
      <div className="info-inline">
        <CircleHelp size={18} aria-hidden="true" />
        <p>
          La carga y validación de canales se habilitará con la administración
          real. No se publican datos de ejemplo.
        </p>
      </div>
    </section>
  );
}

export function AdminDemo({ section }: { section: AdminSection }) {
  const current = adminSections.find((item) => item.id === section)!;
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" aria-label={siteConfig.name + " — Inicio"}>
          <Brand />
        </Link>
        <span className="sidebar-label">ESPACIO DE ADMINISTRACIÓN</span>
        <nav aria-label="Apartados del panel">
          {adminSections.map((item) => (
            <Link
              key={item.id}
              href={"/desarrollo/panel/" + item.id}
              aria-current={section === item.id ? "page" : undefined}
            >
              <item.icon size={18} strokeWidth={1.6} aria-hidden="true" />
              {item.label}
              {section === item.id ? (
                <ChevronRight size={15} aria-hidden="true" />
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="admin-account">
          <span className="account-symbol">
            <LockKeyhole size={19} aria-hidden="true" />
          </span>
          <span>
            <strong>Administrador único</strong>
            <small>Sin sesión · Demostración</small>
          </span>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <span>
            Panel <ChevronRight size={13} aria-hidden="true" />
            <strong>{current.label}</strong>
          </span>
          <Link href="/" className="text-link">
            Ver sitio
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <main id="contenido" className="admin-main" tabIndex={-1}>
          <div className="admin-demo-banner">
            <FlaskConical size={20} aria-hidden="true" />
            <div>
              <strong>Demostración local</strong>
              <p>
                Sin autenticación ni persistencia. Nada se guarda ni se publica.
                Solo disponible en desarrollo.
              </p>
            </div>
          </div>
          <div className="admin-title">
            <div>
              <p className="eyebrow">{siteConfig.name} / Panel</p>
              <h1>{current.label}</h1>
              <p>{current.description}</p>
            </div>
            <button
              className="button button-outline"
              disabled
              title="Se habilitará al implementar autenticación y persistencia"
            >
              {section === "vehiculos" ? (
                <>
                  <Plus size={17} aria-hidden="true" />
                  Agregar vehículo
                </>
              ) : (
                <>
                  <LockKeyhole size={15} aria-hidden="true" />
                  Guardar · Próxima etapa
                </>
              )}
            </button>
          </div>
          {section === "vehiculos" ? (
            <section className="admin-card admin-vehicles">
              <div className="card-heading">
                <h2>Tu catálogo</h2>
                <span className="outline-tag">Sin publicaciones</span>
              </div>
              <div className="admin-table-heading">
                <span>Vehículo</span>
                <span>Estado</span>
                <span>Disponibilidad</span>
                <span>Precio</span>
              </div>
              <EmptyState
                title="Todo empieza con el primero."
                description="Acá vas a gestionar tus vehículos. La creación, las fotos y la publicación se implementarán con acceso seguro."
              />
              <div className="admin-card-footer">
                <span>El catálogo público permanece vacío.</span>
                <Link href="/desarrollo/ficha" className="text-link">
                  Revisar ficha de ejemplo
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </section>
          ) : null}
          {section === "apariencia" ? <AppearanceDemo /> : null}
          {section === "contenido" ? <ContentDemo /> : null}
          {section === "contacto" ? <ContactDemo /> : null}
          {section === "historial" ? (
            <section className="admin-card">
              <div className="card-heading">
                <h2>Versiones y actividad</h2>
                <span className="outline-tag">Sin actividad real</span>
              </div>
              <div className="history-empty">
                <History size={43} strokeWidth={1.1} aria-hidden="true" />
                <h2>Cada cambio, con su historia.</h2>
                <p>
                  El historial persistente, la restauración y la papelera se
                  implementarán al conectar la base de datos. Esta vista no
                  genera eventos ficticios.
                </p>
              </div>
            </section>
          ) : null}
          <footer className="admin-footnote">
            <span className="status-dot" />
            Vista de diseño · Sin conexión a servicios remotos
          </footer>
        </main>
      </div>
    </div>
  );
}
