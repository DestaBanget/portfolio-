import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

function normalizeHash(raw?: string) {
  if (!raw) return "";
  const trimmed = raw.trim();
  const unquoted =
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;
  return unquoted.replace(/\\\$/g, "$");
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const hash = normalizeHash(process.env.ADMIN_PASSWORD_HASH);
  const valid = hash ? await bcrypt.compare(String(password ?? "").trim(), hash) : false;

  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, process.env.ADMIN_SESSION_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
