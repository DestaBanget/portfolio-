import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ADMIN_SESSION_COOKIE, getNormalizedAdminSessionSecret } from "@/lib/admin-auth";

function normalizeHash(raw?: string) {
  if (!raw) return "";
  const trimmed = raw.trim().replace(/[\r\n]+/g, "");
  const unquoted =
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;
  return unquoted.replace(/\\+\$/g, "$");
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const hash = normalizeHash(process.env.ADMIN_PASSWORD_HASH);
  const sessionSecret = getNormalizedAdminSessionSecret();
  const valid = hash ? await bcrypt.compare(String(password ?? "").trim(), hash) : false;

  if (!valid) {
    console.log("[admin-login] invalid password", {
      hasHash: Boolean(hash),
      hashPrefix: hash ? hash.slice(0, 4) : null,
      hashLength: hash.length,
      nodeEnv: process.env.NODE_ENV,
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!sessionSecret) {
    console.error("[admin-login] missing ADMIN_SESSION_SECRET");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, sessionSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
