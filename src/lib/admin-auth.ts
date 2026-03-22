import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";
const SESSION_VALUE = process.env.ADMIN_SESSION_SECRET!;

export function isAdminAuthenticated(): boolean {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE;
}

export function requireAdmin() {
  if (isAdminAuthenticated()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
