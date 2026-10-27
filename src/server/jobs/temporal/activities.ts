import { Context } from "@temporalio/activity";
import { runBirthdayCheck } from "../birthday-check";
import type { BirthdayCheckResult } from "../types";

export function createWorkerActivities() {
  return {
    async birthdayCheckActivity(): Promise<BirthdayCheckResult> {
      const info = Context.current().info;
      return runBirthdayCheck("schedule", info.workflowExecution?.workflowId ?? info.activityId);
    },
  };
}
