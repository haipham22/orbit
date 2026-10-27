import { Connection, WorkflowClient } from "@temporalio/client";

export function temporalConfig() {
  const address = process.env.TEMPORAL_ADDRESS ?? "localhost:7233";
  const namespace = process.env.TEMPORAL_NAMESPACE ?? "default";
  const taskQueue = process.env.TEMPORAL_TASK_QUEUE ?? "orbit";
  return { address, namespace, taskQueue };
}

export async function connectWorkflowClient(): Promise<WorkflowClient> {
  const { address, namespace } = temporalConfig();
  const connection = await Connection.connect({ address });
  return new WorkflowClient({ connection, namespace });
}
