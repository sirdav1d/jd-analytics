import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

const ADMIN_ROUTE_PREFIXES = [
  "/dashboard/users",
  "/dashboard/meta-investments",
  "/dashboard/upload",
  "/dashboard/goals-marketing",
  "/dashboard/goals-comercial",
] as const;

const AUTH_ROUTE_PREFIXES = ["/sign-in", "/reset-pass"] as const;

function matchesRoute(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function decodePathname(pathname: string) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return null;
  }
}

async function readToken(request: NextRequest) {
  try {
    return await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const pathname = decodePathname(request.nextUrl.pathname);
  const token = await readToken(request);
  const isActive = token?.isActive === true;

  if (pathname === null) {
    return new NextResponse(null, { status: 400 });
  }

  if (AUTH_ROUTE_PREFIXES.some((prefix) => matchesRoute(pathname, prefix))) {
    if (isActive) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!isActive) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (
    ADMIN_ROUTE_PREFIXES.some((prefix) => matchesRoute(pathname, prefix)) &&
    token.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/reset-pass/:path*"],
};
