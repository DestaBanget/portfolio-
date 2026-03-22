import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

function normalizeValue(raw?: string) {
  if (!raw) return "";
  return raw
    .trim()
    .replace(/[\r\n]+/g, "")
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1");
}

function isProtectedPath(pathname: string) {
  return pathname === "/loginytta/dashboard" || pathname.startsWith("/loginytta/api/");
}

function isPublicAdminPath(pathname: string) {
  return pathname === "/loginytta/api/login";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!isProtectedPath(pathname) || isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  const cookieValue = normalizeValue(req.cookies.get(SESSION_COOKIE)?.value);
  const sessionValue = normalizeValue(process.env.ADMIN_SESSION_SECRET);
  const authenticated = Boolean(cookieValue) && Boolean(sessionValue) && cookieValue === sessionValue;

  if (authenticated) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/loginytta/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/loginytta";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/loginytta/dashboard", "/loginytta/api/:path*"],
};
