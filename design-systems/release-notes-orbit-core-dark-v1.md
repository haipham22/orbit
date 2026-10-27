# orbit-core-dark v1 — ghi chú bàn giao (2026-10-28)

## Tóm tắt

**Biến thể dark** của orbit-core (vòng 1): cùng danh sách tên token, khác giá trị — dịch từ theme
night-focus của orbit prototype. Đi kèm orbit-core v1; bật qua ThemeProvider + toggle phía orbit
(`.dark` tokens của orbit hiện có map 1-1 sang bộ này).

## Đổi so với bản trước

| Loại | Mục | Chi tiết |
|---|---|---|
| — | Bản đầu tiên | không có bản trước |

## Sắp xoá (có hiệu lực ở bản SAU)

Không có.

## Ánh xạ experience → gói (đề xuất — bên nhận tự khai ở phía mình)

| Experience (tên bên nhận) | Gói |
|---|---|
| orbit-web | orbit-core-dark |

## Nội dung gói

| Thành phần | Số lượng |
|---|---|
| Token | 45 |
| Component | 14 |
| Màn hình | 8 |

## Kiểm chứng

- `make verify` xanh ngày 2026-10-28 — gói qua trọn danh mục `handoff/PACKAGE-SPEC.md §8`.
- Nghiệm thu vòng 1: 2026-10-28
- Git tag: `ds-orbit-core-dark-v1`.
