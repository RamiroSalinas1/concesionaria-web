import Link from "next/link";
import { AdminAuthShell } from "@/components/admin-auth-shell";
import { authIsHardened } from "@/lib/supabase/server";
import { recover } from "../actions";

export default async function RecoveryPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const ready = await authIsHardened();
  const { estado } = await searchParams;
  return (
    <AdminAuthShell title="Recuperar acceso">
      <p>
        Usá el correo de la cuenta administradora. La recuperación conserva sus
        permisos.
      </p>
      {!ready ? (
        <p role="status">
          La recuperación por correo requiere completar la configuración de
          Auth.
        </p>
      ) : null}
      {estado === "enviado" ? (
        <p role="status">
          Si la cuenta existe y el servicio de correo está disponible, recibirás
          las instrucciones.
        </p>
      ) : null}
      <form action={recover} className="auth-form">
        <label className="field">
          Correo
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={254}
            disabled={!ready}
          />
        </label>
        <button className="button button-primary" disabled={!ready}>
          Solicitar recuperación
        </button>
      </form>
      <Link href="/admin/login" className="text-link">
        Volver al ingreso
      </Link>
    </AdminAuthShell>
  );
}
