import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  userId?: string;
  email?: string;
};

export const sessionOptions: SessionOptions = {
  cookieName: "orbit_session",
  password: process.env.SESSION_SECRET ?? "",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
};

export async function getSession() {
  if (!sessionOptions.password) {
    throw new Error("SESSION_SECRET is required for local auth");
  }
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export const SESSION_COOKIE_NAME = sessionOptions.cookieName;
