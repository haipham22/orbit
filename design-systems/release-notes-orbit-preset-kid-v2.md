# orbit-preset-kid v2 — ghi chú bàn giao (2026-10-29)

## Tóm tắt

Polish sau vòng 3 + Crit vòng 4 cho preset: cùng bộ fix TSX/gallery với core (NavItem 44px, XPBar barber-pole + aria, overflow clip, chip chọn nhìn ra, ngày demo động, TSX sạch 3 bug) — giá trị token giữ nguyên bản v1, personality preset không đổi.

## Đổi so với bản trước

| Loại | Mục | Chi tiết |
|---|---|---|
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
- Git tag: `ds-orbit-preset-kid-v2`.
