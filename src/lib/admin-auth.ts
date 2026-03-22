import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";
const SESSION_VALUE = process.env.ADMIN_SESSION_SECRET!;

export function isAdminAuthenticated(): boolean {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_COOKIE);

    console.log("[admin-auth] cookie", {
      cookieValue: cookie?.value ?? null,
      sessionValue: SESSION_VALUE ?? null,
      nodeEnv: process.env.NODE_ENV,
    });

    return cookie?.value === SESSION_VALUE;
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
