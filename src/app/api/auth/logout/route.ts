import { authProvider } from "@/server/auth/provider";
import { logout } from "@/server/auth/local/login";

export const runtime = "nodejs";

export async function POST() {
  if (authProvider !== "local") {
    return Response.json({ ok: false, error: { code: "AUTH_PROVIDER_MISMATCH" } }, { status: 400 });
  }
  await logout();
  return Response.json({ ok: true });
}
