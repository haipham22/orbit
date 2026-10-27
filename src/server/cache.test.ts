import { describe, expect, it } from "vitest";
import { getCache } from "./cache";

describe("memory cache", () => {
  it("set rồi get", async () => {
    const cache = await getCache();
    await cache.set("k", "v");
    expect(await cache.get("k")).toBe("v");
  });

  it("miss trả null", async () => {
    const cache = await getCache();
    expect(await cache.get("missing")).toBeNull();
  });

  it("hết hạn theo ttl", async () => {
    const cache = await getCache();
    await cache.set("k", "v", -1);
    expect(await cache.get("k")).toBeNull();
  });

  it("delete xoá key", async () => {
    const cache = await getCache();
    await cache.set("k", "v");
    await cache.delete("k");
    expect(await cache.get("k")).toBeNull();
  });
});
