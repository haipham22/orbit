---
type: design-system
design_system_id: "DS-ORBIT-CORE-DARK"
status: "APPROVED"
version: 1
source: "in-house"
platforms: [web]
owner_authority: "Hải Phạm"
last_reviewed: "2026-10-28"
---

<!-- SINH TỰ ĐỘNG từ tokens.json — không sửa tay, chạy make package -->

# Design System — `orbit-core-dark`

> Bộ chuẩn UI đóng gói: tokens + components + screens. Nguồn máy đọc duy
> nhất: `tokens.json` (cùng thư mục). Bảng dưới do máy sinh từ nguồn đó —
> sửa hình thức thì sửa `tokens.json` rồi chạy `make package`.

---

## 1. Mục đích

Biến thể dark của orbit-core — CÙNG danh sách tên token, KHÁC giá trị (PACKAGE-SPEC §2.7); dịch từ theme night-focus của orbit prototype 0.2.1.

## 2. Nguồn (source)

| Aspect | Value |
|---|---|
| Source | in-house |
| Versioning | số nguyên trong `tokens.json → $meta.version` (hiện: 1) |

## 3. Design tokens

> Nguồn machine-readable: `tokens.json`. Bảng dưới là bản chiếu đầy đủ.

### 3.1 Color (semantic)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--color-accent` | `#3ECF8E` | alias khớp tên orbit = primary |
| `--color-accent-fg` | `#0E1512` | alias khớp tên orbit = on-primary |
| `--color-bg` | `#14171C` | nền trang dark |
| `--color-border` | `#6B7484` | viền input, kẻ chia |
| `--color-danger` | `#E5645C` | lỗi, xoá |
| `--color-fg` | `#E9ECEF` | alias khớp tên orbit = text |
| `--color-fg-muted` | `#A3ABB8` | alias khớp tên orbit = text-muted |
| `--color-on-danger` | `#2B0A08` | chữ TRÊN nền danger |
| `--color-on-primary` | `#0E1512` | chữ TRÊN nền primary |
| `--color-primary` | `#3ECF8E` | hành động chính — xanh night-focus |
| `--color-primary-soft` | `#22403A` | nền chip/hover nhạt từ primary |
| `--color-success` | `#4CC38A` | thành công, đã lưu |
| `--color-surface` | `#1C2027` | nền thẻ nổi trên nền trang |
| `--color-surface-raised` | `#242A33` | nền input/search nổi trên surface |
| `--color-text` | `#E9ECEF` | chữ chính |
| `--color-text-muted` | `#A3ABB8` | chữ phụ, nhãn, meta |
| `--color-warning` | `#D9A13B` | cảnh báo, tới hạn |

### 3.2 Nhóm khác

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--control-height-lg` | `44px` | — |
| `--control-height-md` | `36px` | — |
| `--control-height-sm` | `30px` | — |
| `--font-display` | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | tiêu đề, nhãn console |
| `--font-sans` | `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif` | thân chữ toàn gói |
| `--radius` | `8px` | — |
| `--radius-full` | `999px` | — |
| `--radius-lg` | `16px` | — |
| `--radius-md` | `8px` | — |
| `--radius-sm` | `4px` | — |
| `--shadow` | `0 1px 2px rgba(0,0,0,.40)` | — |
| `--space-1` | `4px` | — |
| `--space-2` | `8px` | — |
| `--space-3` | `12px` | — |
| `--space-4` | `16px` | — |
| `--space-5` | `20px` | — |
| `--space-6` | `24px` | — |
| `--space-7` | `28px` | — |
| `--space-8` | `32px` | — |
| `--space-lg` | `28px` | — |
| `--space-md` | `16px` | — |
| `--space-sm` | `8px` | — |
| `--text-base` | `15px` | — |
| `--text-lg` | `20px` | — |
| `--text-sm` | `13px` | — |
| `--text-xl` | `26px` | — |
| `--type-weight-bold` | `700` | độ đậm tiêu đề display |
| `--type-weight-strong` | `600` | độ đậm nhấn (font-weight) |

## 4. Component index

| Component | File | Status |
|---|---|---|
| Comp_Avatar — Avatar | `components/Comp_Avatar.mdx` | APPROVED |
| Comp_Button — Button | `components/Comp_Button.mdx` | APPROVED |
| Comp_Calendar — Calendar | `components/Comp_Calendar.mdx` | APPROVED |
| Comp_Card — Card | `components/Comp_Card.mdx` | APPROVED |
| Comp_Chip — Chip | `components/Comp_Chip.mdx` | APPROVED |
| Comp_EmptyState — EmptyState | `components/Comp_EmptyState.mdx` | APPROVED |
| Comp_Icon — Icon | `components/Comp_Icon.mdx` | APPROVED |
| Comp_Modal — Modal | `components/Comp_Modal.mdx` | APPROVED |
| Comp_NavItem — NavItem | `components/Comp_NavItem.mdx` | APPROVED |
| Comp_PersonRow — PersonRow | `components/Comp_PersonRow.mdx` | APPROVED |
| Comp_StreakBadge — StreakBadge | `components/Comp_StreakBadge.mdx` | APPROVED |
| Comp_TextInput — TextInput | `components/Comp_TextInput.mdx` | APPROVED |
| Comp_Toast — Toast | `components/Comp_Toast.mdx` | APPROVED |
| Comp_XPBar — XPBar | `components/Comp_XPBar.mdx` | APPROVED |

## 5. Screens

| Screen | File | Tiêu đề |
|---|---|---|
| S1 | `screens/s1.html` + `.json` | Sign-in — DS-ORBIT-CORE-DARK |
| S2 | `screens/s2.html` + `.json` | Dashboard — DS-ORBIT-CORE-DARK |
| S3 | `screens/s3.html` + `.json` | People — danh sách — DS-ORBIT-CORE-DARK |
| S4 | `screens/s4.html` + `.json` | People — chi tiết — DS-ORBIT-CORE-DARK |
| S5 | `screens/s5.html` + `.json` | Journal — danh sách — DS-ORBIT-CORE-DARK |
| S6 | `screens/s6.html` + `.json` | Journal — entry — DS-ORBIT-CORE-DARK |
| S7 | `screens/s7.html` + `.json` | Tasks — board — DS-ORBIT-CORE-DARK |
| S8 | `screens/s8.html` + `.json` | Tasks — chi tiết — DS-ORBIT-CORE-DARK |

## 6. Changelog

| Date | Version | Change |
|---|---|---|
| 2026-10-27 | 1 | Khởi tạo từ night-focus (orbit prototype 0.2.1) |
| 2026-10-28 | 1 | Authority nghiệm thu vòng 1 — APPROVED, đóng gói bàn giao |
