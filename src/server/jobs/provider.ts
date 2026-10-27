import type { JobProvider } from "./types";

export const jobsProvider = (process.env.JOBS_PROVIDER ?? "none") as "none" | "temporal";

const noneJobProvider: JobProvider = {
  name: "none",
  async triggerBirthdayCheck() {
    const { runBirthdayCheck } = await import("./birthday-check");
    return runBirthdayCheck("manual", "inline");
  },
  async scheduleBirthdayCheck() {},
};

export async function getJobProvider(): Promise<JobProvider> {
  if (jobsProvider !== "temporal") return noneJobProvider;
  const { temporalJobProvider } = await import("./temporal/provider");
  return temporalJobProvider;
}
