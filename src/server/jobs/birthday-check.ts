import { eq } from "drizzle-orm";
import { db } from "@/server/db/client";
import { agentRuns } from "@/server/db/schema";
import { upcomingBirthdays } from "@/features/dashboard/queries";
import type { BirthdayCheckResult } from "./types";

export const BIRTHDAY_CHECK_WORKFLOW = "birthdayCheck";
export const BIRTHDAY_CHECK_TASK = "birthday-check";
export const BIRTHDAY_CHECK_SCHEDULE_ID = "birthday-check-daily";

export async function runBirthdayCheck(
  trigger: "manual" | "schedule",
  workflowId: string,
): Promise<BirthdayCheckResult> {
  const [run] = await db
    .insert(agentRuns)
    .values({ workflowId, workflowType: BIRTHDAY_CHECK_WORKFLOW, input: { trigger } })
    .returning();

  try {
    const people = await upcomingBirthdays(30);
    const result: BirthdayCheckResult = {
      count: people.length,
      people: people.map((p) => ({ id: p.id, fullName: p.fullName, dob: p.dob, relationship: p.relationship })),
    };
    await db
      .update(agentRuns)
      .set({ status: "completed", result, finishedAt: new Date() })
      .where(eq(agentRuns.id, run.id));
    return result;
  } catch (err) {
    await db
      .update(agentRuns)
      .set({ status: "failed", error: String(err), finishedAt: new Date() })
      .where(eq(agentRuns.id, run.id));
    throw err;
  }
}
