import { authProvider } from "@/server/auth/provider";
import { loginWithPassword } from "@/server/auth/local/login";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (authProvider !== "local") {
    return Response.json({ ok: false, error: { code: "AUTH_PROVIDER_MISMATCH" } }, { status: 400 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: { code: "INVALID_BODY" } }, { status: 400 });
  }

  const { email, password } = body;
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return Response.json({ ok: false, error: { code: "INVALID_BODY" } }, { status: 400 });
  }

  const user = await loginWithPassword(email, password);
  if (!user) {
    return Response.json({ ok: false, error: { code: "INVALID_CREDENTIALS" } }, { status: 401 });
  }

  return Response.json({ ok: true, user });
}
