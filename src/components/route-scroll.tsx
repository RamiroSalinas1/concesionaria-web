"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Las páginas nuevas empiezan arriba; filtros y anclas conservan su navegación. */
export function RouteScroll() {
  const pathname = usePathname();
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);
  return null;
}
