// Theme runtime (THEME-FORMAT.md §4–§5): áp theme.json user-upload lên token của
// gói DS bằng CSS custom property trên :root — không đẻ var mới, không innerHTML.
// Pure TS: không import React/DOM lib; DOM chỉ chạm qua document trong apply/clear.

export const THEME_STORAGE_KEY = "orbit-theme";
export const THEME_SCHEMA = "orbit-theme-1";

// Bảng map token → CSS var (danh sách đóng theo gói — không đẻ var mới).
export const THEME_TOKEN_VARS: Record<string, string> = {
  "color.accent": "--color-accent",
  "color.bg": "--color-bg",
  "color.primary-soft": "--color-primary-soft",
  radius: "--radius",
  "font.sans": "--font-sans",
  "font.display": "--font-display",
};

// Font family khai báo trong gói (allowlist — chuỗi font tự do là injection CSS).
export const THEME_FONT_FAMILIES = [
  "system-ui",
  "'Segoe UI'",
  "Roboto",
  "sans-serif",
  "ui-monospace",
  "SFMono-Regular",
  "Menlo",
  "Consolas",
  "monospace",
  "'Space Grotesk'",
  "'Plus Jakarta Sans'",
  "Geist",
] as const;

const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const LENGTH_RE = /^\d+(?:\.\d+)?(?:px|rem|em|%)$/;

// Chuỗi font: mỗi family (tách dấu phẩy) phải thuộc allowlist.
function isAllowedFont(value: string): boolean {
  return value.split(",").every((f) => {
    const family = f.trim().replace(/^['"]|['"]$/g, "").toLowerCase();
    return THEME_FONT_FAMILIES.some(
      (x) => x.replace(/^['"]|['"]$/g, "").toLowerCase() === family,
    );
  });
}

export type ValidTheme = { ok: true; name: string; tokens: Record<string, string> };
export type InvalidTheme = { ok: false; reason: string };

// Kiểm format theme.json (schema + key đóng + hex + độ dài + font allowlist + cấm
// url()/ký tự CSS). Lý do lỗi trả nguyên văn để UI hiện {reason}.
export function validateTheme(json: unknown): ValidTheme | InvalidTheme {
  if (typeof json !== "object" || json === null || Array.isArray(json)) {
    return { ok: false, reason: "File theme phải là JSON object." };
  }
  const o = json as Record<string, unknown>;
  if (o.$schema !== THEME_SCHEMA) {
    return { ok: false, reason: `Trường "$schema" phải là "orbit-theme-1".` };
  }
  if (typeof o.name !== "string" || o.name.trim() === "") {
    return { ok: false, reason: 'Trường "name" phải là chuỗi không rỗng.' };
  }
  const tokens = o.tokens;
  if (typeof tokens !== "object" || tokens === null || Array.isArray(tokens)) {
    return { ok: false, reason: 'Trường "tokens" phải là object.' };
  }
  const out: Record<string, string> = {};
  for (const key of Object.keys(tokens)) {
    const value = (tokens as Record<string, unknown>)[key];
    if (!THEME_TOKEN_VARS[key]) {
      return { ok: false, reason: `Token lạ: "${key}".` };
    }
    if (typeof value !== "string" || value === "") {
      return { ok: false, reason: `Giá trị của "${key}" phải là chuỗi không rỗng.` };
    }
    if (/url\(/i.test(value) || /[;{}<>]/.test(value)) {
      return { ok: false, reason: `Giá trị của "${key}" không được chứa url() hoặc ;{}<>.` };
    }
    if (key.startsWith("color.")) {
      if (!HEX_RE.test(value)) {
        return { ok: false, reason: `Màu "${key}" phải ở dạng #rrggbb.` };
      }
    } else if (key === "radius") {
      if (!LENGTH_RE.test(value)) {
        return { ok: false, reason: `Giá trị "${key}" phải là độ dài (px, rem, em, %).` };
      }
    } else if (!isAllowedFont(value)) {
      return { ok: false, reason: `Font "${key}" chỉ nhận family có trong gói: ${THEME_FONT_FAMILIES.join(", ")}.` };
    }
    out[key] = value;
  }
  return { ok: true, name: o.name, tokens: out };
}

// Áp từng token lên :root qua setProperty (đúng var trong bảng — không đẻ var mới).
export function applyTheme(tokens: Record<string, string>): void {
  if (typeof document === "undefined") return;
  for (const key of Object.keys(tokens)) {
    const cssVar = THEME_TOKEN_VARS[key];
    if (cssVar) document.documentElement.style.setProperty(cssVar, tokens[key]);
  }
}

// Bỏ override runtime — về theme của gói (preset/gốc).
export function clearTheme(): void {
  if (typeof document === "undefined") return;
  for (const key of Object.keys(THEME_TOKEN_VARS)) {
    document.documentElement.style.removeProperty(THEME_TOKEN_VARS[key]);
  }
}

// Đọc theme đã lưu trong localStorage (đã re-validate) — client only.
export function savedTheme(): ValidTheme | null {
  if (typeof window === "undefined") return null;
  try {
    const v = validateTheme(JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) ?? "null"));
    return v.ok ? v : null;
  } catch {
    return null;
  }
}

export function saveTheme(rawJson: string): void {
  localStorage.setItem(THEME_STORAGE_KEY, rawJson);
}

export function deleteTheme(): void {
  localStorage.removeItem(THEME_STORAGE_KEY);
}

// Script inline chạy trước paint đầu (render trong root layout): đọc lại
// localStorage orbit-theme, re-validate rồi setProperty — không innerHTML, không
// sinh chuỗi CSS từ dữ liệu user. ponytail: mini-validator này song song
// validateTheme — đổi luật theme phải sửa cả hai nơi.
export function bootThemeScript(): string {
  const vars = JSON.stringify(THEME_TOKEN_VARS);
  const fonts = JSON.stringify(THEME_FONT_FAMILIES);
  const key = JSON.stringify(THEME_STORAGE_KEY);
  const schema = JSON.stringify(THEME_SCHEMA);
  return `(function(){try{
var V=${vars},F=${fonts},K=${key},S=${schema};
var H=/^#[0-9a-fA-F]{6}$/,L=/^\\d+(?:\\.\\d+)?(?:px|rem|em|%)$/;
var t=JSON.parse(localStorage.getItem(K)||"null");
if(!t||t.$schema!==S||typeof t.tokens!=="object"||!t.tokens)return;
var q=function(x){return String(x).trim().replace(/^['"]|['"]$/g,"").toLowerCase()};
var ok=function(k,v){
 if(!V[k]||typeof v!=="string"||/url\\(|[;{}<>]/i.test(v))return false;
 if(k.indexOf("color.")===0)return H.test(v);
 if(k==="radius")return L.test(v);
 return String(v).split(",").every(function(f){var s=q(f);return F.some(function(x){return q(x)===s})});
};
for(var k in t.tokens){var v=t.tokens[k];if(ok(k,v))document.documentElement.style.setProperty(V[k],v)}
}catch(e){}})();`;
}
