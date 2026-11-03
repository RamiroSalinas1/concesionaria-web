import Link from "next/link";
import { AdminAuthShell } from "@/components/admin-auth-shell";
import { authIsHardened } from "@/lib/supabase/server";
import { login } from "../actions";

const messages: Record<string, string> = {
  error: "No pudimos iniciar sesión con esos datos.",
  acceso: "Iniciá sesión con la cuenta administradora autorizada.",
  configuracion: "El acceso todavía requiere configuración segura de Supabase.",
  salida: "Cerraste la sesión.",
  clave: "Contraseña actualizada. Iniciá sesión nuevamente.",
  cierre:
    "No se pudo confirmar el cierre remoto. Volvé a intentar cerrar la sesión.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const ready = await authIsHardened();
  const { estado } = await searchParams;
  return (
    <AdminAuthShell title="Iniciar sesión">
      <p>Acceso exclusivo para el administrador del sitio.</p>
      {!ready ? (
        <p role="status" className="info-inline">
          Acceso pendiente de configuración. No se habilitan sesiones hasta
          bloquear el registro público y las cuentas anónimas en Supabase.
        </p>
      ) : null}
      {estado && messages[estado] ? (
        <p role="status">{messages[estado]}</p>
      ) : null}
      <form action={login} className="auth-form">
        <label className="field">
          Correo
          <input
            type="email"
            name="email"
            autoComplete="username"
            required
            maxLength={254}
            disabled={!ready}
          />
        </label>
        <label className="field">
          Contraseña
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            maxLength={256}
            disabled={!ready}
          />
        </label>
        <button className="button button-primary" disabled={!ready}>
          Ingresar
        </button>
      </form>
      <Link href="/admin/recuperar" className="text-link">
        Recuperar acceso
      </Link>
    </AdminAuthShell>
  );
}
