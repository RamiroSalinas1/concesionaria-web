import { AdminAuthShell } from "@/components/admin-auth-shell";
import { requireAdmin } from "@/lib/auth/admin";
import { changePassword } from "../actions";

export default async function PasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  await requireAdmin();
  const { estado } = await searchParams;
  return (
    <AdminAuthShell title="Nueva contraseña">
      <p>
        Usá al menos 12 caracteres. Al guardar se cerrarán las sesiones de la
        cuenta.
      </p>
      {estado === "error" ? (
        <p role="alert">
          No se pudo actualizar. Revisá que las contraseñas coincidan y cumplan
          los requisitos.
        </p>
      ) : null}
      <form action={changePassword} className="auth-form">
        <label className="field">
          Nueva contraseña
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            required
          />
        </label>
        <label className="field">
          Repetir contraseña
          <input
            type="password"
            name="confirmation"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            required
          />
        </label>
        <button className="button button-primary">Actualizar contraseña</button>
      </form>
    </AdminAuthShell>
  );
}
