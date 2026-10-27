import { config } from "dotenv";
import { stdout } from "node:process";

async function main() {
  config({ path: "deployment/local/.env", quiet: true });

  const { getJobProvider } = await import("@/server/jobs/provider");
  const provider = await getJobProvider();

  if (provider.name !== "temporal") {
    stdout.write("JOBS_PROVIDER != temporal — không có gì để đăng ký\n");
    process.exit(0);
  }

  await provider.scheduleBirthdayCheck();
  stdout.write("birthday-check-daily schedule registered\n");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
