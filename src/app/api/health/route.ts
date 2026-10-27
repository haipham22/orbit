import { sql } from "drizzle-orm";
import { db } from "@/server/db/client";

export const runtime = "nodejs";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json({ status: "ok", db: true });
  } catch {
    return Response.json({ status: "error", db: false }, { status: 503 });
  }
}
