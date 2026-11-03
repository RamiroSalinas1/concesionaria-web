"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authIsHardened, sessionClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";

async function ownOrigin() {
  const configured = process.env.SITE_URL;
  if (!configured) throw new Error("SITE_URL no configurada");
  const origin = new URL(configured).origin;
  if ((await headers()).get("origin") !== origin)
    throw new Error("Origen no permitido");
  return origin;
}

export async function login(form: FormData) {
  await ownOrigin();
  const client = await sessionClient();
  if (!client || !(await authIsHardened()))
    redirect("/admin/login?estado=configuracion");
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    !password ||
    password.length > 256
  )
    redirect("/admin/login?estado=error");
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?estado=error");
  const allowed = await client.rpc("is_admin");
  if (allowed.error || allowed.data !== true) {
    await client.auth.signOut();
    redirect("/admin/login?estado=error");
  }
  redirect("/admin");
}

export async function logout() {
  await ownOrigin();
  const client = await sessionClient();
  if (client) {
    const { error } = await client.auth.signOut({ scope: "global" });
    if (error) redirect("/admin/login?estado=cierre");
  }
  redirect("/admin/login?estado=salida");
}

export async function recover(form: FormData) {
  const origin = await ownOrigin();
  const client = await sessionClient();
  const email = String(form.get("email") ?? "").trim();
  if (
    client &&
    (await authIsHardened()) &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback`,
    });
  }
  // Same response for existing, unknown, invalid and provider-limited accounts.
  redirect("/admin/recuperar?estado=enviado");
}

export async function changePassword(form: FormData) {
  await ownOrigin();
  const client = await requireAdmin();
  const password = String(form.get("password") ?? "");
  if (
    password.length < 12 ||
    password.length > 128 ||
    password !== form.get("confirmation")
  )
    redirect("/admin/clave?estado=error");
  const { error } = await client.auth.updateUser({ password });
  if (error) redirect("/admin/clave?estado=error");
  const signedOut = await client.auth.signOut({ scope: "global" });
  if (signedOut.error) redirect("/admin/login?estado=cierre");
  redirect("/admin/login?estado=clave");
}
