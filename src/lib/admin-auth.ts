import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

function normalizeValue(raw?: string) {
  if (!raw) return "";
  const trimmed = raw.trim().replace(/[\r\n]+/g, "");
  const unquoted =
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;
  return unquoted;
}

const SESSION_VALUE = normalizeValue(process.env.ADMIN_SESSION_SECRET);

function matchesSession(value: string) {
  // An unset secret must never let an empty cookie through.
  if (!SESSION_VALUE || !value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(SESSION_VALUE);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return matchesSession(normalizeValue(cookieStore.get(SESSION_COOKIE)?.value));
  } catch (error) {
    console.error("[admin-auth] failed to read cookies", error);
    return false;
  }
}

export async function requireAdmin() {
  if (await isAdminAuthenticated()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
export const getNormalizedAdminSessionSecret = () => SESSION_VALUE;
