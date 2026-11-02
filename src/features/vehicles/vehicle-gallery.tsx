"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { VehicleViewModel } from "@/types/vehicle";
import { VehicleIllustration } from "@/components/vehicle-illustration";

export function VehicleGallery({
  images,
}: {
  images: VehicleViewModel["images"];
}) {
  const [selected, setSelected] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const image = images[selected];
  if (!image)
    return (
      <div className="gallery-empty">
        Este vehículo todavía no tiene imágenes.
      </div>
    );
  const change = (step: number) =>
    setSelected((value) => (value + step + images.length) % images.length);
  return (
    <div className="vehicle-gallery">
      <div className="gallery-main">
        <VehicleIllustration tone={image.tone} />
        <span className="gallery-label">{image.label}</span>
        <button
          className="icon-button gallery-expand"
          aria-label="Ampliar ilustración de ejemplo"
          onClick={() => dialogRef.current?.showModal()}
        >
          <Expand size={19} />
        </button>
        <div className="gallery-controls">
          <button
            className="icon-button"
            aria-label="Imagen anterior"
            onClick={() => change(-1)}
          >
            <ChevronLeft size={20} />
          </button>
          <span aria-live="polite">
            {selected + 1} / {images.length}
          </span>
          <button
            className="icon-button"
            aria-label="Imagen siguiente"
            onClick={() => change(1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="gallery-thumbnails" aria-label="Elegir imagen">
        {images.map((item, index) => (
          <button
            key={item.id}
            className={index === selected ? "thumbnail active" : "thumbnail"}
            aria-label={item.label}
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
          >
            <VehicleIllustration tone={item.tone} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialogRef}
        className="gallery-dialog"
        aria-label="Ilustración ampliada de ejemplo"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="gallery-dialog-content">
          <button
            className="icon-button"
            aria-label="Cerrar imagen ampliada"
            onClick={() => dialogRef.current?.close()}
            autoFocus
          >
            <X />
          </button>
          <VehicleIllustration tone={image.tone} />
          <p>{image.label} · Contenido de muestra, no disponible para venta.</p>
        </div>
      </dialog>
    </div>
  );
}
