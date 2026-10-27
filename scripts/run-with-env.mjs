import { config } from "dotenv";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { stderr } from "node:process";

config({ path: "deployment/local/.env", quiet: true });

// AUTH_PROVIDER=clerk + chưa có keys → bootstrap accountless dev keys trước khi spawn
if (process.env.AUTH_PROVIDER === "clerk") {
  const { ensureClerkDevKeys } = await import("./clerk-keyless-dev.mjs");
  await ensureClerkDevKeys(process.env);
}

const [bin, ...args] = process.argv.slice(2);
if (!bin) {
  stderr.write("usage: node scripts/run-with-env.mjs <cmd> [args...]\n");
  process.exit(1);
}

const localBin = `node_modules/.bin/${bin}`;
const resolved = existsSync(localBin) ? localBin : bin;

const child = spawn(resolved, args, { stdio: "inherit", env: process.env });
child.on("error", (err) => {
  stderr.write(`run-with-env: không chạy được '${resolved}': ${err.message}\n`);
  process.exit(1);
});
child.on("exit", (code) => process.exit(code ?? 1));
