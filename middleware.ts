import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/utils/supabase/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // const user = null;
    console.log("Middleware user:", user);

    // Check if the user is authenticated
    const isAuthenticated = !!user;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isLandingPage = req.nextUrl.pathname === "/";
    const isAuthCallback = req.nextUrl.pathname.startsWith("/auth/callback");

    // Allow access to auth callback route
    if (isAuthCallback) {
      return res;
    }

    // If the user is on an auth page and is already authenticated, redirect to dashboard
    if (isAuthPage && isAuthenticated && !isAuthCallback) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If the user is not authenticated and not on the landing page or auth page, redirect to landing page
    if (!isAuthenticated && !isAuthPage && !isLandingPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return res;
  } catch (error) {
    console.error("Middleware error:", error);
    return res;
  }
}

// Specify the paths that should be checked by the middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
