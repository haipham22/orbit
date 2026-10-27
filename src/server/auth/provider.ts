export const authProvider = (process.env.AUTH_PROVIDER ?? "local") as "local" | "clerk";

export function isClerkAuth() {
  return authProvider === "clerk";
}

export function isAllowedEmail(email: string) {
  const allowed = (process.env.ORBIT_USER_EMAIL ?? "").trim().toLowerCase();
  return allowed !== "" && email.trim().toLowerCase() === allowed;
}
