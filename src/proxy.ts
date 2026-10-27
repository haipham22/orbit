import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { authProvider } from "./server/auth/provider";
import { SESSION_COOKIE_NAME } from "./server/auth/local/session";

const PROTECTED = /^\/(dashboard|people|journal|tasks)(\/|$)/;

function localProxy(req: NextRequest) {
  if (PROTECTED.test(req.nextUrl.pathname) && !req.cookies.get(SESSION_COOKIE_NAME)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  return NextResponse.next();
}

const clerkProxy = clerkMiddleware();

export async function proxy(req: NextRequest, event: NextFetchEvent) {
  if (authProvider === "clerk") return clerkProxy(req, event);
  return localProxy(req);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
