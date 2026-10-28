---
type: design-system
design_system_id: "ORBIT-PRESET-WARM-EARTH"
status: "APPROVED"
version: 1
source: "in-house"
platforms: [web]
owner_authority: "Hải Phạm"
last_reviewed: "2026-10-28"
---

<!-- SINH TỰ ĐỘNG từ tokens.json — không sửa tay, chạy make package -->

# Design System — `orbit-preset-warm-earth`

> Bộ chuẩn UI đóng gói: tokens + components + screens. Nguồn máy đọc duy
> nhất: `tokens.json` (cùng thư mục). Bảng dưới do máy sinh từ nguồn đó —
> sửa hình thức thì sửa `tokens.json` rồi chạy `make package`.

---

## 1. Mục đích

Preset warm-earth (đất ấm) — olive, Geist, bo 12px; huong-7, vòng 3.

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
| `--color-accent` | `#48740E` | alias khớp tên orbit = primary |
| `--color-accent-fg` | `#FFFFFF` | alias khớp tên orbit = on-primary |
| `--color-bg` | `#F7F6EE` | nền trang |
| `--color-border` | `#87909C` | viền input, kẻ chia — là chỉ báo duy nhất của input thì ≥3:1 |
| `--color-border-soft` | `#E2E0CC` | viền trang trí (toast, khối nổi) — border là mức input cần 3:1 |
| `--color-danger` | `#C0261B` | lỗi, xoá |
| `--color-data-ink` | `#1F2933` | chữ trên nền màu data sáng (chip user-color, law DECISIONS 2026-10-28) |
| `--color-data-paper` | `#FFFFFF` | chữ trên nền màu data tối |
| `--color-fg` | `#1F2933` | alias khớp tên orbit = text |
| `--color-fg-muted` | `#5A6472` | alias khớp tên orbit = text-muted |
| `--color-on-danger` | `#FFFFFF` | chữ TRÊN nền danger |
| `--color-on-primary` | `#FFFFFF` | chữ TRÊN nền primary |
| `--color-primary` | `#48740E` | hành động chính, link, trạng thái active |
| `--color-primary-soft` | `#ECEBD8` | nền chip/hover nhạt từ primary |
| `--color-success` | `#177034` | thành công, đã lưu |
| `--color-success-soft` | `#EAF2E4` | nền chip/nhãn nhạt từ success (text success lên trên) |
| `--color-surface` | `#FFFFFF` | nền thẻ nổi trên nền trang |
| `--color-surface-raised` | `#FFFFFF` | nền input/search nổi trên surface |
| `--color-text` | `#1F2933` | chữ chính |
| `--color-text-muted` | `#5A6472` | chữ phụ, nhãn, meta |
| `--color-warning` | `#8A5A00` | cảnh báo, tới hạn |
| `--color-warning-soft` | `#F5EDD6` | nền chip/nhãn nhạt từ warning (text warning lên trên) |

### 3.2 Nhóm khác

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--control-height-lg` | `44px` | — |
| `--control-height-md` | `36px` | — |
| `--control-height-sm` | `30px` | — |
| `--font-display` | `'Geist', system-ui, sans-serif` | tiêu đề, nhãn console — tính cách cool-console |
| `--font-sans` | `'Geist', system-ui, sans-serif` | thân chữ toàn gói |
| `--radius` | `12px` | — |
| `--radius-full` | `999px` | — |
| `--radius-lg` | `20px` | — |
| `--radius-md` | `12px` | — |
| `--radius-sm` | `6px` | — |
| `--shadow` | `0 1px 3px rgba(72,116,14,.12)` | — |
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
| Comp_BottomNav — BottomNav | `components/Comp_BottomNav.mdx` | APPROVED |
| Comp_Button — Button | `components/Comp_Button.mdx` | APPROVED |
| Comp_Calendar — Calendar | `components/Comp_Calendar.mdx` | APPROVED |
| Comp_Card — Card | `components/Comp_Card.mdx` | APPROVED |
| Comp_Chip — Chip | `components/Comp_Chip.mdx` | APPROVED |
| Comp_ConfirmDialog — ConfirmDialog | `components/Comp_ConfirmDialog.mdx` | APPROVED |
| Comp_DateInput — DateInput | `components/Comp_DateInput.mdx` | APPROVED |
| Comp_DateRange — DateRange | `components/Comp_DateRange.mdx` | APPROVED |
| Comp_EmptyState — EmptyState | `components/Comp_EmptyState.mdx` | APPROVED |
| Comp_Icon — Icon | `components/Comp_Icon.mdx` | APPROVED |
| Comp_Modal — Modal | `components/Comp_Modal.mdx` | APPROVED |
| Comp_NavItem — NavItem | `components/Comp_NavItem.mdx` | APPROVED |
| Comp_PersonPicker — PersonPicker | `components/Comp_PersonPicker.mdx` | APPROVED |
| Comp_PersonRow — PersonRow | `components/Comp_PersonRow.mdx` | APPROVED |
| Comp_SearchInput — SearchInput | `components/Comp_SearchInput.mdx` | APPROVED |
| Comp_Skeleton — Skeleton | `components/Comp_Skeleton.mdx` | APPROVED |
| Comp_StreakBadge — StreakBadge | `components/Comp_StreakBadge.mdx` | APPROVED |
| Comp_TextInput — TextInput | `components/Comp_TextInput.mdx` | APPROVED |
| Comp_Toast — Toast | `components/Comp_Toast.mdx` | APPROVED |
| Comp_XPBar — XPBar | `components/Comp_XPBar.mdx` | APPROVED |

## 5. Screens

| Screen | File | Tiêu đề |
|---|---|---|
| S1 | `screens/s1.html` + `.json` | Sign-in — ORBIT-PRESET-WARM-EARTH |
| S2 | `screens/s2.html` + `.json` | Dashboard — ORBIT-PRESET-WARM-EARTH |
| S3 | `screens/s3.html` + `.json` | People — danh sách — ORBIT-PRESET-WARM-EARTH |
| S4 | `screens/s4.html` + `.json` | People — chi tiết — ORBIT-PRESET-WARM-EARTH |
| S5 | `screens/s5.html` + `.json` | Journal — danh sách — ORBIT-PRESET-WARM-EARTH |
| S6 | `screens/s6.html` + `.json` | Journal — entry — ORBIT-PRESET-WARM-EARTH |
| S7 | `screens/s7.html` + `.json` | Tasks — board — ORBIT-PRESET-WARM-EARTH |
| S8 | `screens/s8.html` + `.json` | Tasks — chi tiết — ORBIT-PRESET-WARM-EARTH |
| S9 | `screens/s9.html` + `.json` | Cài đặt — theme & ngôn ngữ — ORBIT-PRESET-WARM-EARTH |

## 6. Changelog

| Date | Version | Change |
|---|---|---|
| 2026-10-28 | 1 | Khởi tạo từ huong-7 full personality (vòng 3) — 12px, olive đất, Geist; thêm color.data-ink/data-paper (law màu data) |
| 2026-10-28 | 1 | Authority nghiệm thu vòng 3 — APPROVED, đóng gói bàn giao v1 |
