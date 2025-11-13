import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Leer cookie
  const authCookie = request.cookies.get("auth")?.value;

  // Si no hay cookie → login
  if (!authCookie) {
    if (!url.pathname.startsWith("/login") && !url.pathname.startsWith("/register"))
      return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.next();
  }

  // Parsear datos
  let auth;
  try {
    auth = JSON.parse(authCookie);
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = auth.role;

  // 🔥 Redirecciones por rol
  if (url.pathname.startsWith("/admin") && role === "student") {
    return NextResponse.redirect(new URL("/main", request.url));
  }

  if (url.pathname.startsWith("/main") && (role === "admin" || role === "tutor")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/main/:path*",
    "/admin/:path*",
  ],
};
