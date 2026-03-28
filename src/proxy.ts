import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_PATHS = [
  "/dashboard",
  "/upload",
  "/entries",
  "/export",
  "/admin",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only paths
  if (pathname.startsWith("/admin")) {
    const role = token.role as string;
    if (role === "USER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/upload/:path*",
    "/entries/:path*",
    "/export/:path*",
    "/admin/:path*",
  ],
};
