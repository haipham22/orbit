import { ScheduleClient } from "@temporalio/client";
import type { BirthdayCheckResult, JobProvider } from "../types";
import { BIRTHDAY_CHECK_SCHEDULE_ID, BIRTHDAY_CHECK_WORKFLOW } from "../birthday-check";
import { connectWorkflowClient, temporalConfig } from "./client";

async function connectScheduleClient() {
  const { Connection } = await import("@temporalio/client");
  const { address, namespace } = temporalConfig();
  const connection = await Connection.connect({ address });
  return new ScheduleClient({ connection, namespace });
}

export const temporalJobProvider: JobProvider = {
  name: "temporal",

  async triggerBirthdayCheck() {
    const client = await connectWorkflowClient();
    const { taskQueue } = temporalConfig();
    const result = (await client.execute(BIRTHDAY_CHECK_WORKFLOW, {
      taskQueue,
      workflowId: `${BIRTHDAY_CHECK_WORKFLOW}-${Date.now()}`,
    })) as BirthdayCheckResult;
    return result;
  },

  async scheduleBirthdayCheck() {
    const client = await connectScheduleClient();
    const { taskQueue } = temporalConfig();
    const handle = client.getHandle(BIRTHDAY_CHECK_SCHEDULE_ID);

    try {
      await handle.describe();
      return;
    } catch {
      await client.create({
        scheduleId: BIRTHDAY_CHECK_SCHEDULE_ID,
        spec: { intervals: [{ every: "24h" }] },
        action: {
          type: "startWorkflow",
          workflowType: BIRTHDAY_CHECK_WORKFLOW,
          taskQueue,
        },
      });
    }
  },
};
