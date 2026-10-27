// clerk-keyless-dev.mjs — bootstrap accountless Clerk dev keys so clerkMiddleware()
// có keys ngay lúc boot. @clerk/nextjs chỉ làm keyless handshake trong ClerkProvider
// (RSC render) nhưng middleware assert env keys trước mọi render → 500 ở request đầu.
// Đọc/ghi đúng format + đường dẫn chuẩn của @clerk/shared/keyless: .clerk/.tmp/keyless.json.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { stderr } from "node:process";

const KEYLESS_PATH = ".clerk/.tmp/keyless.json";

async function readStoredKeys() {
  try {
    const parsed = JSON.parse(await readFile(KEYLESS_PATH, "utf8"));
    if (parsed.publishableKey && parsed.secretKey) return parsed;
  } catch {
    // chưa có file / format lạ → tạo mới
  }
  return undefined;
}

async function createAccountlessKeys() {
  // Public endpoint — giống __experimental_accountlessApplications.createAccountlessApplication
  const res = await fetch("https://api.clerk.com/v1/accountless_applications?source=nextjs", {
    method: "POST",
  });
  if (!res.ok) return undefined;
  const raw = await res.json();
  // API trả snake_case, @clerk/shared/keyless readKeys cần camelCase — normalize như clerk client request()
  const app = {
    publishableKey: raw.publishable_key,
    secretKey: raw.secret_key,
    claimUrl: raw.claim_url,
    apiKeysUrl: raw.api_keys_url,
  };
  if (!app.publishableKey || !app.secretKey) return undefined;
  await mkdir(".clerk/.tmp", { recursive: true });
  // mode 0600 — file chứa secret key của instance chưa claim
  await writeFile(KEYLESS_PATH, JSON.stringify(app), { mode: 0o600 });
  return app;
}

// Set keys vào env của child process. true nếu đủ keys sau khi chạy.
export async function ensureClerkDevKeys(env) {
  if (env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && env.CLERK_SECRET_KEY) return true;
  const keys = (await readStoredKeys()) ?? (await createAccountlessKeys());
  if (!keys) return false;
  env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = keys.publishableKey;
  env.CLERK_SECRET_KEY = keys.secretKey;
  stderr.write("clerk-keyless-dev: dùng accountless dev keys từ .clerk/.tmp/keyless.json\n");
  return true;
}
