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

export function isAdminAuthenticated(): boolean {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_COOKIE);
    const cookieValue = normalizeValue(cookie?.value);
    const isMatch = cookieValue === SESSION_VALUE;

    console.log("[admin-auth] cookie", {
      cookieValue: cookieValue || null,
      sessionValue: SESSION_VALUE || null,
      cookieLength: cookieValue.length,
      sessionLength: SESSION_VALUE.length,
      matches: isMatch,
      nodeEnv: process.env.NODE_ENV,
    });

    return isMatch;
  } catch (error) {
    console.error("[admin-auth] failed to read cookies", error);
    return false;
  }
}

export function requireAdmin() {
  if (isAdminAuthenticated()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
export const getNormalizedAdminSessionSecret = () => SESSION_VALUE;
