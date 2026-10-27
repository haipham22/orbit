import { z } from "zod";

const envSchema = z
  .object({
    DATABASE_URL: z.url(),
    AUTH_PROVIDER: z.enum(["local", "clerk"]).default("local"),
    JOBS_PROVIDER: z.enum(["none", "temporal"]).default("none"),
    CACHE_PROVIDER: z.enum(["memory", "redis"]).default("memory"),
    ORBIT_USER_EMAIL: z.email().optional(),
    SESSION_SECRET: z.string().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
    CLERK_SECRET_KEY: z.string().optional(),
    TEMPORAL_ADDRESS: z.string().optional(),
    TEMPORAL_NAMESPACE: z.string().optional(),
    TEMPORAL_TASK_QUEUE: z.string().optional(),
    REDIS_URL: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    const missing = (key: keyof OrbitEnv, message: string) =>
      ctx.addIssue({ code: "custom", path: [key], message });

    if (env.AUTH_PROVIDER === "local") {
      const secret = env.SESSION_SECRET;
      if (!secret || secret.length < 32) {
        missing("SESSION_SECRET", "bắt buộc, tối thiểu 32 ký tự khi AUTH_PROVIDER=local");
      } else if (secret.startsWith("change-me")) {
        missing("SESSION_SECRET", "vẫn là placeholder — đặt secret thật");
      }
      if (!env.ORBIT_USER_EMAIL) {
        missing("ORBIT_USER_EMAIL", "bắt buộc khi AUTH_PROVIDER=local");
      }
    }

    // Clerk keyless dev mode chạy được không cần keys; khi thiếu keys ở production Clerk tự fail lúc boot

    if (env.JOBS_PROVIDER === "temporal") {
      for (const key of ["TEMPORAL_ADDRESS", "TEMPORAL_NAMESPACE", "TEMPORAL_TASK_QUEUE"] as const) {
        if (!env[key]) missing(key, `bắt buộc khi JOBS_PROVIDER=temporal`);
      }
    }

    if (env.CACHE_PROVIDER === "redis" && !env.REDIS_URL) {
      missing("REDIS_URL", "bắt buộc khi CACHE_PROVIDER=redis");
    }
  });

export type OrbitEnv = z.infer<typeof envSchema>;

export function validateEnv(source: NodeJS.ProcessEnv = process.env): OrbitEnv {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
    throw new Error(
      `Env validation failed (AUTH_PROVIDER=${source.AUTH_PROVIDER ?? "local"}, JOBS_PROVIDER=${source.JOBS_PROVIDER ?? "none"}, CACHE_PROVIDER=${source.CACHE_PROVIDER ?? "memory"}):\n${lines.join("\n")}`,
    );
  }
  return parsed.data;
}
