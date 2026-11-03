import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CarFront,
  Bike,
  MoveUpRight,
} from "lucide-react";
import { siteConfig, vehicleTypes } from "@/config/site";
import { TrackArtwork } from "@/components/track-artwork";
import { EmptyState } from "@/components/empty-state";

function Hero() {
  const { home, catalogCta } = siteConfig.copy;
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="red-dash" />
            {home.eyebrow}
          </p>
          <h1>
            {home.title[0]}
            <br />
            <em>{home.title[1]}</em>
          </h1>
          <p className="hero-description">{home.description}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/catalogo">
              {catalogCta}
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
            <Link className="text-link" href="#destacados">
              {home.secondaryCta}
              <ArrowDown size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <TrackArtwork />
        <div className="hero-caption">
          <span className="caption-mark" aria-hidden="true">
            {"//"}
          </span>
          {home.graphicLabel}
          <span className="caption-line" />
          <span className="small-label">{siteConfig.name}</span>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  const icons = [CarFront, Bike, MoveUpRight];
  return (
    <section className="categories" aria-label="Explorar por tipo de vehículo">
      <div className="container category-grid">
        {vehicleTypes.map((type, index) => {
          const Icon = icons[index];
          return (
            <Link
              className="category-link"
              key={type.value}
              href={"/catalogo?tipo=" + type.value}
            >
              <Icon
                className="category-icon"
                size={36}
                strokeWidth={1.25}
                aria-hidden="true"
              />
              <span>
                <span className="small-label">{type.detail}</span>
                <strong>{type.label}</strong>
              </span>
              <ArrowUpRight
                className="category-arrow"
                size={23}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Featured() {
  const { home } = siteConfig.copy;
  return (
    <section id="destacados" className="featured section-pad">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span className="red-dash" />
              {home.featuredEyebrow}
            </p>
            <h2>{home.featuredTitle}</h2>
          </div>
          <Link className="text-link" href="/catalogo">
            Ver catálogo
            <ArrowRight size={19} aria-hidden="true" />
          </Link>
        </div>
        <p className="section-description">{home.featuredDescription}</p>
        <EmptyState />
      </div>
    </section>
  );
}

const sections = { hero: Hero, categories: Categories, featured: Featured };

export default function HomePage() {
  return siteConfig.sections
    .filter((section) => section.visible)
    .map((section) => {
      const Section = sections[section.id];
      return <Section key={section.id} />;
    });
}
