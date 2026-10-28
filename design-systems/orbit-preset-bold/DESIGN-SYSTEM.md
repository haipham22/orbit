---
type: design-system
design_system_id: "ORBIT-PRESET-BOLD"
status: "APPROVED"
version: 2
source: "in-house"
platforms: [web]
owner_authority: "Hải Phạm"
last_reviewed: "2026-10-29"
---

<!-- SINH TỰ ĐỘNG từ tokens.json — không sửa tay, chạy make package -->

# Design System — `orbit-preset-bold`

> Bộ chuẩn UI đóng gói: tokens + components + screens. Nguồn máy đọc duy
> nhất: `tokens.json` (cùng thư mục). Bảng dưới do máy sinh từ nguồn đó —
> sửa hình thức thì sửa `tokens.json` rồi chạy `make package`.

---

## 1. Mục đích

Preset bold (nam tính, góc cạnh) — crimson, Space Grotesk, góc 4px; huong-7, vòng 3.

## 2. Nguồn (source)

| Aspect | Value |
|---|---|
| Source | in-house |
| Versioning | số nguyên trong `tokens.json → $meta.version` (hiện: 2) |

## 3. Design tokens

> Nguồn machine-readable: `tokens.json`. Bảng dưới là bản chiếu đầy đủ.

### 3.1 Color (semantic)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--color-accent` | `#B91C1C` | alias khớp tên orbit = primary |
| `--color-accent-fg` | `#FFFFFF` | alias khớp tên orbit = on-primary |
| `--color-bg` | `#FEF2F2` | nền trang |
| `--color-border` | `#87909C` | viền input, kẻ chia — là chỉ báo duy nhất của input thì ≥3:1 |
| `--color-border-soft` | `#F0D5D5` | viền trang trí (toast, khối nổi) — border là mức input cần 3:1 |
| `--color-danger` | `#C0261B` | lỗi, xoá |
| `--color-data-ink` | `#1F2933` | chữ trên nền màu data sáng (chip user-color, law DECISIONS 2026-10-28) |
| `--color-data-paper` | `#FFFFFF` | chữ trên nền màu data tối |
| `--color-fg` | `#1F2933` | alias khớp tên orbit = text |
| `--color-fg-muted` | `#5A6472` | alias khớp tên orbit = text-muted |
| `--color-on-danger` | `#FFFFFF` | chữ TRÊN nền danger |
| `--color-on-primary` | `#FFFFFF` | chữ TRÊN nền primary |
| `--color-primary` | `#B91C1C` | hành động chính, link, trạng thái active |
| `--color-primary-soft` | `#FEE2E2` | nền chip/hover nhạt từ primary |
| `--color-success` | `#177034` | thành công, đã lưu |
| `--color-success-soft` | `#E6F2E9` | nền chip/nhãn nhạt từ success (text success lên trên) |
| `--color-surface` | `#FFFFFF` | nền thẻ nổi trên nền trang |
| `--color-surface-raised` | `#FFFFFF` | nền input/search nổi trên surface |
| `--color-text` | `#1F2933` | chữ chính |
| `--color-text-muted` | `#5A6472` | chữ phụ, nhãn, meta |
| `--color-warning` | `#8A5A00` | cảnh báo, tới hạn |
| `--color-warning-soft` | `#F7EDD8` | nền chip/nhãn nhạt từ warning (text warning lên trên) |

### 3.2 Nhóm khác

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--control-height-lg` | `44px` | — |
| `--control-height-md` | `36px` | — |
| `--control-height-sm` | `30px` | — |
| `--font-display` | `'Space Grotesk', system-ui, sans-serif` | tiêu đề, nhãn console — tính cách cool-console |
| `--font-sans` | `'Space Grotesk', system-ui, sans-serif` | thân chữ toàn gói |
| `--radius` | `4px` | — |
| `--radius-full` | `999px` | — |
| `--radius-lg` | `8px` | — |
| `--radius-md` | `4px` | — |
| `--radius-sm` | `2px` | — |
| `--shadow` | `0 2px 8px rgba(185,28,28,.16)` | — |
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
| S1 | `screens/s1.html` + `.json` | Sign-in — ORBIT-PRESET-BOLD |
| S2 | `screens/s2.html` + `.json` | Dashboard — ORBIT-PRESET-BOLD |
| S3 | `screens/s3.html` + `.json` | People — danh sách — ORBIT-PRESET-BOLD |
| S4 | `screens/s4.html` + `.json` | People — chi tiết — ORBIT-PRESET-BOLD |
| S5 | `screens/s5.html` + `.json` | Journal — danh sách — ORBIT-PRESET-BOLD |
| S6 | `screens/s6.html` + `.json` | Journal — entry — ORBIT-PRESET-BOLD |
| S7 | `screens/s7.html` + `.json` | Tasks — board — ORBIT-PRESET-BOLD |
| S8 | `screens/s8.html` + `.json` | Tasks — chi tiết — ORBIT-PRESET-BOLD |
| S9 | `screens/s9.html` + `.json` | Cài đặt — theme & ngôn ngữ — ORBIT-PRESET-BOLD |

## 6. Changelog

| Date | Version | Change |
|---|---|---|
| 2026-10-28 | 1 | Khởi tạo từ huong-7 full personality (vòng 3) — góc 4px, crimson, đậm; thêm color.data-ink/data-paper (law màu data) |
| 2026-10-28 | 1 | Authority nghiệm thu vòng 3 — APPROVED, đóng gói bàn giao v1 |
| 2026-10-29 | 2 | v2: polish sau vòng 3 (trước đó giao sớm qua main): XPBar sending sọc barber-pole + fill bo cap · NavItem padding ngang 12px · washi tape · dim law .8/.7 · crit vòng 4: NavItem min-height 44, XPBar role=progressbar, overflow clip (Avatar/Calendar/PersonRow), chip đang chọn viền primary + đậm, ngày demo tính lúc render, daterange/picker TSX sạch 3 bug TS |
