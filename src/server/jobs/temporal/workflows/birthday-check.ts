import { proxyActivities } from "@temporalio/workflow";
import type { BirthdayCheckActivities } from "../activities-interface";
import type { BirthdayCheckResult } from "../../types";

const { birthdayCheckActivity } = proxyActivities<BirthdayCheckActivities>({
  startToCloseTimeout: "1 minute",
});

export async function birthdayCheck(): Promise<BirthdayCheckResult> {
  return birthdayCheckActivity();
}
