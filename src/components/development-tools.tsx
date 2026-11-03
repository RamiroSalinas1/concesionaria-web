import Link from "next/link";
import { PanelTop, FlaskConical } from "lucide-react";

export function DevelopmentTools() {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <aside
      className="development-tools"
      aria-label="Vistas de demostración de desarrollo"
    >
      <span>
        <FlaskConical size={13} aria-hidden="true" />
        Vista local
      </span>
      <Link href="/desarrollo/ficha">Ficha de ejemplo</Link>
      <Link href="/desarrollo/panel/vehiculos">
        <PanelTop size={13} aria-hidden="true" />
        Panel demo
      </Link>
    </aside>
  );
}
