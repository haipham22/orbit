---
type: design-system
design_system_id: "DS-ORBIT-PRESET-STICKER"
status: "APPROVED"
version: 3
source: "in-house"
platforms: [web]
owner_authority: "Hải Phạm"
last_reviewed: "2026-10-29"
---

<!-- SINH TỰ ĐỘNG từ tokens.json — không sửa tay, chạy make package -->

# Design System — `orbit-preset-sticker`

> Bộ chuẩn UI đóng gói: tokens + components + screens. Nguồn máy đọc duy
> nhất: `tokens.json` (cùng thư mục). Bảng dưới do máy sinh từ nguồn đó —
> sửa hình thức thì sửa `tokens.json` rồi chạy `make package`.

---

## 1. Mục đích

Preset sticker (sổ dán — huong-2 vòng 1, Authority mời vào vòng 3) — fuchsia kẹo trên nền kem giấy, bo tròn, shadow kẹo; Plus Jakarta Sans.

## 2. Nguồn (source)

| Aspect | Value |
|---|---|
| Source | in-house |
| Versioning | số nguyên trong `tokens.json → $meta.version` (hiện: 3) |

## 3. Design tokens

> Nguồn machine-readable: `tokens.json`. Bảng dưới là bản chiếu đầy đủ.

### 3.1 Color (semantic)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--color-accent` | `#C2410C` | alias khớp tên orbit = primary |
| `--color-accent-fg` | `#FFF7ED` | alias khớp tên orbit = on-primary |
| `--color-bg` | `#F6EFE3` | nền trang |
| `--color-border` | `#87909C` | viền input, kẻ chia — là chỉ báo duy nhất của input thì ≥3:1 |
| `--color-border-soft` | `#E7DCC6` | viền trang trí (toast, khối nổi) — border là mức input cần 3:1 |
| `--color-danger` | `#B91C1C` | lỗi, xoá |
| `--color-data-ink` | `#1F2933` | chữ trên nền màu data sáng (chip user-color, law DECISIONS 2026-10-28) |
| `--color-data-paper` | `#FFFFFF` | chữ trên nền màu data tối |
| `--color-fg` | `#2C2114` | alias khớp tên orbit = text |
| `--color-fg-muted` | `#6D5E49` | alias khớp tên orbit = text-muted |
| `--color-on-danger` | `#FFFFFF` | chữ TRÊN nền danger |
| `--color-on-primary` | `#FFF7ED` | chữ TRÊN nền primary |
| `--color-primary` | `#C2410C` | hành động chính, link, trạng thái active |
| `--color-primary-soft` | `#FFEDD5` | nền chip/hover nhạt từ primary |
| `--color-success` | `#267c37` | thành công, đã lưu |
| `--color-success-soft` | `#E9F4EC` | nền chip/nhãn nhạt từ success (text success lên trên) |
| `--color-surface` | `#FFFFFF` | nền thẻ nổi trên nền trang |
| `--color-surface-raised` | `#FFFFFF` | nền input/search nổi trên surface |
| `--color-tape-a` | `#FDE68A` | nhãn dán washi vàng (trang trí góc card, chỉ trang trí, không mang nội dung) |
| `--color-tape-b` | `#D8B4FE` | nhãn dán washi tím nhạt (trang trí, xen kẽ tape-a) |
| `--color-text` | `#2C2114` | chữ chính |
| `--color-text-muted` | `#6D5E49` | chữ phụ, nhãn, meta |
| `--color-warning` | `#8A5A00` | cảnh báo, tới hạn |
| `--color-warning-soft` | `#F7EEDA` | nền chip/nhãn nhạt từ warning (text warning lên trên) |

### 3.2 Nhóm khác

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--control-height-lg` | `44px` | — |
| `--control-height-md` | `36px` | — |
| `--control-height-sm` | `30px` | — |
| `--font-display` | `'Plus Jakarta Sans', system-ui, sans-serif` | tiêu đề, nhãn console — tính cách cool-console |
| `--font-sans` | `'Plus Jakarta Sans', system-ui, sans-serif` | thân chữ toàn gói |
| `--radius` | `20px` | — |
| `--radius-full` | `999px` | — |
| `--radius-lg` | `28px` | — |
| `--radius-md` | `20px` | — |
| `--radius-sm` | `12px` | — |
| `--shadow` | `3px 4px 0 rgba(44,33,20,.85)` | — |
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
| S1 | `screens/s1.html` + `.json` | Sign-in — DS-ORBIT-PRESET-STICKER |
| S2 | `screens/s2.html` + `.json` | Dashboard — DS-ORBIT-PRESET-STICKER |
| S3 | `screens/s3.html` + `.json` | People — danh sách — DS-ORBIT-PRESET-STICKER |
| S4 | `screens/s4.html` + `.json` | People — chi tiết — DS-ORBIT-PRESET-STICKER |
| S5 | `screens/s5.html` + `.json` | Journal — danh sách — DS-ORBIT-PRESET-STICKER |
| S6 | `screens/s6.html` + `.json` | Journal — entry — DS-ORBIT-PRESET-STICKER |
| S7 | `screens/s7.html` + `.json` | Tasks — board — DS-ORBIT-PRESET-STICKER |
| S8 | `screens/s8.html` + `.json` | Tasks — chi tiết — DS-ORBIT-PRESET-STICKER |
| S9 | `screens/s9.html` + `.json` | Cài đặt — theme & ngôn ngữ — DS-ORBIT-PRESET-STICKER |

## 6. Changelog

| Date | Version | Change |
|---|---|---|
| 2026-10-28 | 1 | Khởi tạo từ huong-2 sổ dán (Authority mời thêm lúc nghiệm thu vòng 3) — token-only: màu + bo tròn + shadow kẹo; washi-tape/2px viền là refinement backlog |
| 2026-10-28 | 1 | Authority nghiệm thu vòng 3 — APPROVED, đóng gói bàn giao v1 |
| 2026-10-28 | 2 | v1.1 trung thành huong-2 gốc: accent cam đất #C2410C (bỏ fuchsia), chữ nâu #2C2114, shadow sticker cứng 3px 4px 0 — Authority so với candidates/huong-2 gốc |
| 2026-10-28 | 2 | v1.1: thêm color.tape-a/tape-b (washi tape góc card — Authority điểm danh ở huong-2) |
| 2026-10-29 | 3 | v3: polish sau vòng 3 (trước đó giao sớm qua main): XPBar sending sọc barber-pole + fill bo cap · NavItem padding ngang 12px · washi tape · dim law .8/.7 · crit vòng 4: NavItem min-height 44, XPBar role=progressbar, overflow clip (Avatar/Calendar/PersonRow), chip đang chọn viền primary + đậm, ngày demo tính lúc render, daterange/picker TSX sạch 3 bug TS |
