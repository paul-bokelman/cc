import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseSubdomain } from "~/lib/utils";

export function middleware(req: NextRequest) {
  let result = parseSubdomain(req.headers.get("x-forwarded-proto") + "://" + req.headers.get("host"));

  if (!result.valid) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/clubs/:path*", "/admin/:path*", "/login"],
};
