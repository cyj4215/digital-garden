import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const url = req.nextUrl.pathname;

  // Protect admin routes
  if (url.startsWith("/admin") || url.startsWith("/api/admin")) {
    const role = (req.auth?.user as Record<string, unknown>)?.role;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/zh/auth/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/:locale/admin/:path*", "/api/admin/:path*"],
};
