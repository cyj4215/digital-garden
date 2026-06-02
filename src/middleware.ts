import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { securityHeaders } from "@/lib/security-headers";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const res = NextResponse.next();
  securityHeaders(res.headers);

  if (url.startsWith("/admin") || url.startsWith("/api/admin")) {
    const sessionCookie =
      request.cookies.get("authjs.session-token") ??
      request.cookies.get("__Secure-authjs.session-token");
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/zh/auth/login", request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|pagefind|feed.xml).*)"],
};
