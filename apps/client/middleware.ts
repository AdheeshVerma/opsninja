import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/about", "/offline", "/privacy-policy"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("application_token");
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (!token && !isPublic) {
    const loginUrl = process.env.NEXT_PUBLIC_COGNITO_LOGIN_URL;
    if (!loginUrl) {
      console.error("NEXT_PUBLIC_COGNITO_LOGIN_URL is not configured");
      // Redirect to home page with error parameter
      const url = new URL("/", request.url);
      url.searchParams.set("error", "config");
      return NextResponse.redirect(url);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icons/).*)",
  ],
};
