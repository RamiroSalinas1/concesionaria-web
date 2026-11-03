import Link from "next/link";
import { CarFront, History, LockKeyhole } from "lucide-react";
import { Brand } from "@/components/brand";
import { requireAdmin } from "@/lib/auth/admin";
import { logout } from "./actions";

export default async function AdminPage() {
  await requireAdmin();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" aria-label="Volver al inicio">
          <Brand />
        </Link>
        <span className="sidebar-label">ESPACIO DE ADMINISTRACIÓN</span>
        <nav aria-label="Apartados del panel">
          <Link href="/admin" aria-current="page">
            <LockKeyhole size={18} aria-hidden="true" />
            Acceso seguro
          </Link>
        </nav>
        <div className="admin-account">
          <span className="account-symbol">
            <LockKeyhole size={19} aria-hidden="true" />
          </span>
          <span>
            <strong>Administrador único</strong>
            <small>Sesión verificada</small>
          </span>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <span>Panel / Acceso seguro</span>
          <form action={logout}>
            <button className="button button-outline">Cerrar sesión</button>
          </form>
        </header>
        <main id="contenido" className="admin-main" tabIndex={-1}>
          <div className="admin-title">
            <div>
              <p className="eyebrow">Administración</p>
              <h1>Acceso seguro</h1>
              <p>Tu cuenta está autorizada por la base de datos.</p>
            </div>
          </div>
          <section className="admin-card">
            <div className="card-heading">
              <h2>
                <CarFront size={20} aria-hidden="true" /> Gestión de vehículos
              </h2>
              <span className="outline-tag">Próxima etapa</span>
            </div>
            <p>
              La carga de vehículos, los borradores y la publicación se
              habilitarán en la siguiente etapa.
            </p>
          </section>
          <section className="admin-card">
            <div className="card-heading">
              <h2>
                <History size={20} aria-hidden="true" /> Historial
              </h2>
            </div>
            <p>
              La base de versiones está preparada. Todavía no hay operaciones
              editoriales habilitadas.
            </p>
          </section>
          <Link href="/admin/clave" className="text-link">
            Cambiar contraseña
          </Link>
        </main>
      </div>
    </div>
  );
}
