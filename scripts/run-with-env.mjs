import { config } from "dotenv";
import { spawn } from "node:child_process";

config({ path: "deployment/local/.env", quiet: true });

const [bin, ...args] = process.argv.slice(2);
if (!bin) {
  console.error("usage: node scripts/run-with-env.mjs <cmd> [args...]");
  process.exit(1);
}

const child = spawn(bin, args, { stdio: "inherit", env: process.env });
child.on("exit", (code) => process.exit(code ?? 1));
