import { getUser } from "@/server/auth/current-user";
import { getJobProvider } from "@/server/jobs/provider";

export const runtime = "nodejs";

export async function POST() {
  if (!(await getUser())) {
    return Response.json(
      { ok: false, error: { code: "UNAUTHENTICATED" } },
      { status: 401 },
    );
  }

  const provider = await getJobProvider();
  const result = await provider.triggerBirthdayCheck();
  return Response.json({ ok: true, provider: provider.name, result });
}
