import { describe, expect, it } from "vitest";
import {
  THEME_SCHEMA,
  bootThemeScript,
  validateTheme,
} from "./theme-runtime";

const ok = {
  $schema: THEME_SCHEMA,
  name: "my-vibe",
  tokens: {
    "color.accent": "#7C3AED",
    "color.bg": "#FAF5FF",
    radius: "12px",
    "font.sans": "'Space Grotesk', system-ui, sans-serif",
  },
};

describe("validateTheme", () => {
  it("nhận theme hợp lệ", () => {
    const v = validateTheme(ok);
    expect(v).toEqual({
      ok: true,
      name: "my-vibe",
      tokens: ok.tokens,
    });
  });

  it("từ chối schema lạ / JSON không phải object", () => {
    expect(validateTheme({ ...ok, $schema: "nope" }).ok).toBe(false);
    expect(validateTheme([1]).ok).toBe(false);
    expect(validateTheme("theme").ok).toBe(false);
  });

  it("từ chối token lạ và hex hỏng", () => {
    expect(validateTheme({ ...ok, tokens: { "color.shadow": "#000000" } }).ok).toBe(false);
    expect(validateTheme({ ...ok, tokens: { "color.accent": "purple" } }).ok).toBe(false);
    expect(validateTheme({ ...ok, tokens: { "color.accent": "#7C3AE" } }).ok).toBe(false);
  });

  it("cấm url() và ký tự CSS trong giá trị", () => {
    expect(
      validateTheme({ ...ok, tokens: { radius: "url(https://x.y/a.png)" } }).ok,
    ).toBe(false);
    expect(validateTheme({ ...ok, tokens: { radius: "12;" } }).ok).toBe(false);
  });

  it("font.sans chỉ nhận allowlist", () => {
    expect(validateTheme({ ...ok, tokens: { "font.sans": "Comic Sans MS" } }).ok).toBe(false);
    expect(validateTheme({ ...ok, tokens: { "font.sans": "Roboto, system-ui" } }).ok).toBe(true);
    // spaces quanh dấu phẩy + quote phải được normalize (khớp mini-validator boot script)
    expect(validateTheme({ ...ok, tokens: { "font.sans": " 'Geist' , system-ui" } }).ok).toBe(true);
  });

  it("radius phải là độ dài", () => {
    expect(validateTheme({ ...ok, tokens: { radius: "big" } }).ok).toBe(false);
    expect(validateTheme({ ...ok, tokens: { radius: "1.5rem" } }).ok).toBe(true);
  });
});

describe("bootThemeScript", () => {
  it("nhúng key/schema/allowlist và chỉ setProperty (không innerHTML)", () => {
    const s = bootThemeScript();
    expect(s).toContain('"orbit-theme"');
    expect(s).toContain('"orbit-theme-1"');
    expect(s).toContain("--color-accent");
    expect(s).toContain("setProperty");
    expect(s).not.toContain("innerHTML");
  });
});
