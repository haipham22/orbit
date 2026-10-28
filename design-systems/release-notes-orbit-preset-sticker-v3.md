# orbit-preset-sticker v3 — ghi chú bàn giao (2026-10-29)

## Tóm tắt

v1.1 trung thành huong-2 (đổi giá trị token + washi tape + theme.css personality, đã chốt sau khi Authority soi lại ứng viên gốc) nâng version lần đầu, cộng polish + Crit vòng 4 (cùng bộ fix TSX/gallery với core).

## Đổi so với bản trước

| Loại | Mục | Chi tiết |
|---|---|---|
| Đổi giá trị | `--color-accent` · `--color-primary` | #B022C1 → #C2410C — v1.1 trung thành huong-2 gốc (bỏ fuchsia) |
| Đổi giá trị | `--color-text` · `--color-fg` · `--color-fg-muted` · `--color-bg` · `--color-border-soft` · `--color-danger` · `--color-success` · `--color-on-primary` · `--color-accent-fg` | đổi theo huong-2: chữ nâu #2C2114, nền kem #F6EFE3… — AA đo lại đạt toàn bộ |
| Đổi giá trị | `--shadow` | 0 3px 8px rgba(176,34,193,.14) → 3px 4px 0 rgba(44,33,20,.85) — shadow sticker cứng |
| Thêm | `--color-tape-a` · `--color-tape-b` | #FDE68A / #D8B4FE — washi tape trang trí góc card |
| Thêm | `theme.css` | personality CSS (viền 2px màu chữ, chip nét đứt, shadow cứng, washi) — chỉ var() token; xoá file = về BASE |
| Đổi | `ui/navitem.tsx` | padding ngang 12px (px-3) + min-height 44 (inline-flex) — vùng chạm đạt ngưỡng; gallery cùng luật |
| Đổi | `ui/xpbar.tsx` | sending = sọc barber-pole chạy tại chỗ (tile 16px, keyframes bên tiêu thụ định nghĩa) + fill bo cap theo track + role=progressbar/aria-valuenow khi biết % |
| Đổi | `ui/avatar.tsx` · `ui/calendar.tsx` · `ui/personrow.tsx` | overflow clip/ellipsis — nội dung dài không lọt khỏi vòng tròn/ô ngày/hàng |
| Đổi | `ui/*.tsx` | daterange tự chứa DateRangeLabels (hết lệch standalone), default VI đầy đủ (hết TS2722), panelId dedupe (hết TS2451), personpicker bỏ cn — 3 bug TS của bản tag trước đã sạch |
| Đổi | screens s1–s9 | NavItem 12px; ngày demo tính lúc render (hạn mai · 30/10 — không già đi); s7 có link vào s8; s8 task thống nhất 'tới hạn'; chip đang chọn ở s9 viền primary + đậm; avatar topbar là link Cài đặt |

## Sắp xoá (có hiệu lực ở bản SAU)

Không có.

## Ánh xạ experience → gói (đề xuất — bên nhận tự khai ở phía mình)

Lần giao này gồm 9 gói (orbit-core v4 · orbit-core-dark v4 · 7 preset). Đề xuất:

| Experience (tên bên nhận) | Gói |
|---|---|
| App shell light — nav, forms, people/journal/tasks | orbit-core |
| Dark mode (night-focus) | orbit-core-dark |
| Theme preset picker (6 đối tượng) | orbit-preset-kid · teen-cool · soft · bold · warm-earth · pastel-dream |
| Preset "Sổ dán" (huong-2) | orbit-preset-sticker |
| i18n catalog vi/en (messages/) | orbit-core (dark + preset dùng chung catalog) |

## Nội dung gói

| Thành phần | Số lượng |
|---|---|
| Token | 50 |
| Component | 21 |
| Màn hình | 9 |

## Kiểm chứng

- `make verify` xanh ngày 2026-10-29 — 108/108, gói qua trọn danh mục `handoff/PACKAGE-SPEC.md §8`.
- Nghiệm thu vòng 4: 2026-10-29 — Authority chốt qua chat (yêu cầu orbit-4f đóng gói + tag + copy sang orbit), meta ghi hộ.
- Git tag: `ds-orbit-preset-sticker-v3`.
