import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Decode JWT and get user role (optional for now)
function getRoleFromToken(token: string) {
   try {
      const decoded = jwt.decode(token) as { role: string };
      return decoded.role;
   } catch (error) {
      console.error("Token decoding failed:", error);
   }
}

// Simple user-agent check for mobile devices
function isMobileUserAgent(userAgent: string | null): boolean {
   if (!userAgent) return false;
   return /android|iphone|ipad|ipod|blackberry|windows phone|mobile/i.test(
      userAgent
   );
}

export function middleware(req: NextRequest) {
   const token = req.cookies.get("accessToken")?.value;
   const isLoggedIn = !!token;
   const { pathname } = req.nextUrl;
   const userAgent = req.headers.get("user-agent");

   // Not logged in and trying to access protected route
   if (
      !isLoggedIn &&
      (pathname.startsWith("/home") || pathname.startsWith("/me"))
   ) {
      return NextResponse.redirect(new URL("/login", req.url));
   }

   // Logged in and accessing login page
   if (isLoggedIn && pathname === "/login") {
      const redirectTo = isMobileUserAgent(userAgent) ? "/me/home" : "/home";
      return NextResponse.redirect(new URL(redirectTo, req.url));
   }

   // Allow the request
   return NextResponse.next();
}

// Middleware will match these routes
export const config = {
   matcher: ["/home", "/login", "/me/:path*"],
};
