import { config } from "dotenv";
import { createInterface } from "node:readline/promises";
import { stdin, stdout, stderr } from "node:process";

async function main() {
  config({ path: "deployment/local/.env", quiet: true });

  const { validateEnv } = await import("@/server/env");
  const env = validateEnv();

  const email = env.ORBIT_USER_EMAIL;
  if (!email) {
    stderr.write("set-password chỉ dùng cho AUTH_PROVIDER=local — ORBIT_USER_EMAIL chưa đặt\n");
    process.exit(1);
  }

  const rl = createInterface({ input: stdin, output: stdout });
  const password = await rl.question(`Mật khẩu cho ${email}: `);
  rl.close();

  if (password.length < 8) {
    stderr.write("Mật khẩu tối thiểu 8 ký tự\n");
    process.exit(1);
  }

  const { hashPassword } = await import("@/server/auth/local/passwords");
  const { upsertAppUserPassword } = await import("@/server/auth/local/users");

  const passwordHash = await hashPassword(password);
  await upsertAppUserPassword(email, passwordHash);
  stdout.write(`Đã đặt mật khẩu cho ${email}\n`);
  process.exit(0);
}

main().catch((err) => {
  stderr.write(`${err}\n`);
  process.exit(1);
});
