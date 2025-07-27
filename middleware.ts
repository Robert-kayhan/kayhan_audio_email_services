import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt");
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;
  // console.log(req.cookies)
  // ✅ Redirect authenticated users away from auth pages
  if (token && (pathname === "/sign-in" || pathname === "/sign-up")) {
    url.pathname = "/dashboard/campaign";
    return NextResponse.redirect(url);
  }

  // ✅ Redirect unauthenticated users away from protected routes
  if (!token && pathname.startsWith("/dashboard")) {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};
