import { getCurrentSession } from "@/lib/session";
import type { UserRole } from "@/lib/auth";

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

export async function requireActionRole(allowed: UserRole[]) {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("Sign in required");
  }
  const role = session.user.role as UserRole;
  if (!allowed.includes(role)) {
    throw new Error("You do not have permission for this action");
  }
  const status = "status" in session.user ? String(session.user.status) : "active";
  if (status && status !== "active") {
    throw new Error("Account is not active");
  }
  return session;
}

export function fail<T = undefined>(error: string): ActionResult<T> {
  return { ok: false, error };
}

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function okEmpty(): ActionResult {
  return { ok: true, data: undefined };
}
