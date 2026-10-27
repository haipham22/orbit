export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { validateEnv } = await import("./server/env");
  validateEnv();
}
