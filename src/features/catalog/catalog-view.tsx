"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownUp,
  ArrowUpRight,
  SlidersHorizontal,
  RotateCcw,
  X,
} from "lucide-react";
import { siteConfig, vehicleTypes } from "@/config/site";
import {
  type CatalogFilters,
  emptyFilters,
  filtersToSearchParams,
} from "@/lib/catalog-filters";
import { EmptyState } from "@/components/empty-state";

export function CatalogView({
  initialFilters,
  maxYear,
}: {
  initialFilters: CatalogFilters;
  maxYear: number;
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const activeCount = Object.values(initialFilters).filter(Boolean).length;
  const activeType = vehicleTypes.find(
    (type) => type.value === initialFilters.tipo,
  )?.label;
  const update = (field: keyof CatalogFilters, value: string) => {
    setFilters((previous) =>
      field === "moneda"
        ? { ...previous, moneda: value, precioDesde: "", precioHasta: "" }
        : { ...previous, [field]: value },
    );
    setError("");
  };
  const apply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      filters.anioDesde &&
      filters.anioHasta &&
      Number(filters.anioDesde) > Number(filters.anioHasta)
    ) {
      setError("El año inicial no puede ser mayor que el final.");
      return;
    }
    if (
      filters.precioDesde &&
      filters.precioHasta &&
      Number(filters.precioDesde) > Number(filters.precioHasta)
    ) {
      setError("El precio mínimo no puede ser mayor que el máximo.");
      return;
    }
    const query = filtersToSearchParams(filters).toString();
    startTransition(() =>
      router.push(query ? `/catalogo?${query}` : "/catalogo", {
        scroll: false,
      }),
    );
  };
  const clear = () => {
    setFilters(emptyFilters);
    setError("");
    startTransition(() => router.push("/catalogo", { scroll: false }));
  };
  return (
    <>
      <section className="catalog-intro container">
        <p className="breadcrumb">
          Inicio <span aria-hidden="true">/</span> Catálogo
        </p>
        <p className="eyebrow">
          <span className="red-dash" />
          {siteConfig.copy.catalog.eyebrow}
        </p>
        <h1>{siteConfig.copy.catalog.title}</h1>
        <p>{siteConfig.copy.catalog.description}</p>
      </section>
      <div className="container catalog-layout">
        <aside className="filters-panel" aria-label="Filtros del catálogo">
          <div className="filters-heading">
            <h2>
              <SlidersHorizontal size={18} aria-hidden="true" />
              Filtros
            </h2>
            <button
              type="button"
              className="subtle-button"
              onClick={clear}
              aria-label="Limpiar todos los filtros"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Limpiar
            </button>
          </div>
          <form onSubmit={apply} aria-busy={isPending}>
            <fieldset>
              <legend>Tipo de vehículo</legend>
              <div className="type-filter-options">
                {[{ value: "", label: "Todos" }, ...vehicleTypes].map(
                  (type) => (
                    <label key={type.value} className="radio-option">
                      <input
                        type="radio"
                        name="tipo"
                        value={type.value}
                        checked={filters.tipo === type.value}
                        onChange={() => update("tipo", type.value)}
                      />
                      <span>{type.label}</span>
                    </label>
                  ),
                )}
              </div>
            </fieldset>
            <label className="field">
              Marca
              <select disabled aria-describedby="brand-note">
                <option>Sin marcas publicadas</option>
              </select>
            </label>
            <p id="brand-note" className="field-note">
              Se habilitará al publicar vehículos.
            </p>
            <label className="field">
              Condición
              <select
                name="condicion"
                value={filters.condicion}
                onChange={(event) => update("condicion", event.target.value)}
              >
                <option value="">Todas las condiciones</option>
                <option value="usado">Usado</option>
                <option value="0km">0 km</option>
              </select>
            </label>
            <fieldset>
              <legend>Año</legend>
              <div className="field-pair">
                <label className="field">
                  <span>Desde</span>
                  <input
                    type="number"
                    name="anioDesde"
                    min="1900"
                    max={maxYear}
                    placeholder="Cualquiera"
                    value={filters.anioDesde}
                    onChange={(event) =>
                      update("anioDesde", event.target.value)
                    }
                  />
                </label>
                <label className="field">
                  <span>Hasta</span>
                  <input
                    type="number"
                    name="anioHasta"
                    min="1900"
                    max={maxYear}
                    placeholder="Cualquiera"
                    value={filters.anioHasta}
                    onChange={(event) =>
                      update("anioHasta", event.target.value)
                    }
                  />
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Precio</legend>
              <label className="field">
                <span>Moneda</span>
                <select
                  name="moneda"
                  value={filters.moneda}
                  onChange={(event) => update("moneda", event.target.value)}
                >
                  <option value="">Elegir moneda</option>
                  <option value="ARS">Pesos argentinos · ARS</option>
                  <option value="USD">Dólares · USD</option>
                </select>
              </label>
              <div className="field-pair">
                <label className="field">
                  <span>Mínimo</span>
                  <input
                    type="number"
                    name="precioDesde"
                    min="0"
                    max="999999999999"
                    step="1"
                    disabled={!filters.moneda}
                    placeholder="Sin mínimo"
                    value={filters.precioDesde}
                    onChange={(event) =>
                      update("precioDesde", event.target.value)
                    }
                  />
                </label>
                <label className="field">
                  <span>Máximo</span>
                  <input
                    type="number"
                    name="precioHasta"
                    min="0"
                    max="999999999999"
                    step="1"
                    disabled={!filters.moneda}
                    placeholder="Sin máximo"
                    value={filters.precioHasta}
                    onChange={(event) =>
                      update("precioHasta", event.target.value)
                    }
                  />
                </label>
              </div>
              <p className="field-note">
                Los precios se comparan solo en la moneda elegida.
              </p>
            </fieldset>
            {error ? (
              <p role="alert" className="form-error">
                {error}
              </p>
            ) : null}
            <button
              className="button button-primary filter-submit"
              disabled={isPending}
              type="submit"
            >
              {isPending ? "Aplicando…" : "Aplicar filtros"}
              <ArrowUpRight size={17} aria-hidden="true" />
            </button>
          </form>
        </aside>
        <section
          className="catalog-results"
          aria-label="Resultados del catálogo"
        >
          <div className="results-heading">
            <div>
              <h2>{activeType || "Todos los vehículos"}</h2>
              <p role="status">
                0 vehículos publicados
                {activeCount ? ` · ${activeCount} filtros aplicados` : ""}
              </p>
            </div>
            <span className="sort-placeholder">
              <ArrowDownUp size={14} aria-hidden="true" />
              Más recientes
            </span>
          </div>
          {activeCount ? (
            <button className="filter-summary" onClick={clear}>
              Limpiar filtros aplicados
              <X size={14} aria-hidden="true" />
            </button>
          ) : null}
          <EmptyState
            title={siteConfig.copy.catalog.emptyTitle}
            description={
              activeCount
                ? siteConfig.copy.catalog.filteredEmptyDescription
                : siteConfig.copy.empty.description
            }
          >
            {activeCount ? (
              <button className="text-link" onClick={clear}>
                Ver sin filtros
                <RotateCcw size={16} aria-hidden="true" />
              </button>
            ) : null}
          </EmptyState>
          <div className="catalog-footnote">
            <span className="red-dash" />
            <p>
              {siteConfig.copy.catalog.footnote[0]}
              <br />
              <strong>{siteConfig.copy.catalog.footnote[1]}</strong>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
