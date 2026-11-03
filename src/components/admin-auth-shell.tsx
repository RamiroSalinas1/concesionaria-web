import Link from "next/link";
import type { ReactNode } from "react";
import { LockKeyhole } from "lucide-react";
import { Brand } from "@/components/brand";

export function AdminAuthShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main id="contenido" className="auth-main" tabIndex={-1}>
      <Link href="/" aria-label="Volver al inicio">
        <Brand />
      </Link>
      <section className="admin-card auth-card">
        <p className="eyebrow">
          <LockKeyhole size={17} aria-hidden="true" /> Administración privada
        </p>
        <h1>{title}</h1>
        {children}
      </section>
      <Link href="/" className="text-link">
        Volver al sitio
      </Link>
    </main>
  );
}
