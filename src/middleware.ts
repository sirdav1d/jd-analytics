import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

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

export async function middleware(request: NextRequest) {
  const token = await readToken(request);
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (token.role !== "ADMIN" || token.isActive !== true) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/users/:path*",
    "/dashboard/meta-investments/:path*",
    "/dashboard/upload/:path*",
    "/dashboard/goals-marketing/:path*",
    "/dashboard/goals-comercial/:path*",
  ],
};
