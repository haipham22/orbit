export interface CacheStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export const cacheProvider = (process.env.CACHE_PROVIDER ?? "memory") as "memory" | "redis";

class MemoryCacheStore implements CacheStore {
  private entries = new Map<string, { value: string; expiresAt: number | null }>();

  async get(key: string): Promise<string | null> {
    const entry = this.entries.get(key);
    if (!entry) return null;
    if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    this.entries.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    });
  }

  async delete(key: string): Promise<void> {
    this.entries.delete(key);
  }
}

export async function getCache(): Promise<CacheStore> {
  if (cacheProvider === "redis") {
    throw new Error("CACHE_PROVIDER=redis chưa hỗ trợ — dùng memory hoặc thêm redis module");
  }
  return new MemoryCacheStore();
}
