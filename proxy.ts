
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const NEW_DOMAIN = "https://www.mobilecarservices.com.au";

const OLD_DOMAINS = new Set([
  "carbatteryservices.com.au",
  "www.carbatteryservices.com.au",
]);

export default auth((request) => {
  const { pathname, search, hostname } = request.nextUrl;

  // 1. Redirect old domain to the matching URL on the new domain.
  if (OLD_DOMAINS.has(hostname.toLowerCase())) {
    const destination = new URL(`${pathname}${search}`, NEW_DOMAIN);

    return NextResponse.redirect(destination, 308);
  }

  // 2. Existing admin authentication.
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (isLoginRoute) {
    return NextResponse.next();
  }

  if (!request.auth?.user) {
    const loginUrl = new URL("/admin/login", request.url);

    loginUrl.searchParams.set(
      "callbackUrl",
      `${pathname}${search}`
    );

    return NextResponse.redirect(loginUrl);
  }

  if (request.auth.user.role !== "admin") {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/|_next/|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
