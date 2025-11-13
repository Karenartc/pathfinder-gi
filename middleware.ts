import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/libs/routes";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Leer cookie
  const authCookie = request.cookies.get("auth")?.value;

  // Si no hay cookie y el usuario va hacia zonas públicas → permitir
  if (!authCookie) {
    const isPublic =
      url.pathname.startsWith(ROUTES.login) ||
      url.pathname.startsWith(ROUTES.register) ||
      url.pathname.startsWith("/main"); // ← permitir main sin cookie post registro

    if (!isPublic) {
      return NextResponse.redirect(new URL(ROUTES.login, request.url));
    }

    return NextResponse.next();
  }
  // Parsear datos
  let auth;
  try {
    auth = JSON.parse(authCookie);
  } catch {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  const role = auth.role;

  // 🔥 Redirecciones por rol
  if (url.pathname.startsWith(ROUTES.admin) && role === "student") {
    return NextResponse.redirect(new URL("/main", request.url));
  }

  if (url.pathname.startsWith("/main") && (role === "admin" || role === "tutor")) {
    return NextResponse.redirect(new URL(ROUTES.admin, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/main/:path*",
    "/admin/:path*",
  ],
};
