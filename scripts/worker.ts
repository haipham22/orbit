import { config } from "dotenv";
import { Runtime } from "@temporalio/worker";

async function main() {
  config({ path: "deployment/local/.env", quiet: true });
  await Runtime.install({ telemetryOptions: { logging: {} } });

  const { Worker, NativeConnection } = await import("@temporalio/worker");
  const { temporalConfig } = await import("@/server/jobs/temporal/client");
  const { createWorkerActivities } = await import("@/server/jobs/temporal/activities");

  const { address, namespace, taskQueue } = temporalConfig();
  const connection = await NativeConnection.connect({ address });

  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve("../src/server/jobs/temporal/workflows/index.ts"),
    activities: createWorkerActivities(),
    taskQueue,
    namespace,
  });

  console.error(`orbit-worker listening on ${taskQueue} @ ${address}/${namespace}`);

  const shutdown = async (signal: string) => {
    console.error(`received ${signal}, draining…`);
    await worker.shutdown();
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  await worker.run();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
