import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { securityHeaders } from "@/lib/security-headers";

export default auth((req) => {
  const url = req.nextUrl.pathname;
  const res = NextResponse.next();

  securityHeaders(res.headers);

  if (url.startsWith("/admin") || url.startsWith("/api/admin")) {
    const role = (req.auth?.user as Record<string, unknown>)?.role;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/zh/auth/login", req.url));
    }
  }

  return res;
});

export const config = {
  matcher: ["/:locale/admin/:path*", "/api/admin/:path*"],
};
