# orbit-core-dark v2 — ghi chú bàn giao (2026-10-28)

## Tóm tắt

Vòng 2 vá 12 gap orbit báo sau khi consume v1: chuẩn hoá 7 component/pattern orbit đang tự chế (SearchInput, PersonPicker, ConfirmDialog, DateInput, DateRange, Skeleton, BottomNav), mở rộng biến thể Chip/TextInput/NavItem/Modal, chuyển toàn bộ `components/ui/*.tsx` sang bản standalone build được. Kèm đó: lịch custom thay native picker, law trạng thái opacity .8/.7 thống nhất, chip trạng thái 5 bậc theo token.

## Đổi so với bản trước

| Loại | Mục | Chi tiết |
|---|---|---|
| Thêm token | `--color-success-soft` | #1C3328 — nền chip "done" |
| Thêm token | `--color-warning-soft` | #38301C — nền chip "tới hạn" |
| Thêm token | `--color-border-soft` | #333B47 — viền trang trí khối nổi (toast) |
| Thêm component | `Comp_SearchInput` | search + dropdown kết quả + meta (typo vẫn khớp) |
| Thêm component | `Comp_PersonPicker` | gắn người: gợi ý + chip remove |
| Thêm component | `Comp_ConfirmDialog` | xác nhận phá hủy (CTA danger) |
| Thêm component | `Comp_DateInput` | lịch custom theo token (bỏ native popup) |
| Thêm component | `Comp_DateRange` | khoảng ngày: 2 tháng cạnh nhau, 2 click chọn |
| Thêm component | `Comp_Skeleton` | loading shape line/avatar/card |
| Thêm component | `Comp_BottomNav` | tab bar mobile ≤768px |
| Mở rộng | `Comp_Chip` | mapping trạng thái chuẩn: todo/doing/done/overdue/due-soon |
| Mở rộng | `Comp_TextInput` | error state: aria-invalid + message role=alert |
| Mở rộng | `Comp_NavItem` | active (aria-current) áp cả desktop sidebar |
| Mở rộng | `Comp_Modal` | tone primary/danger; copy qua prop |
| Đổi package | `components/ui/*.tsx` | toàn bộ 21 file standalone: không import chéo, deps giới hạn (react, @radix-ui/react-slot, @radix-ui/react-dialog, lucide-react, sonner) |
| Đổi khuôn | trạng thái | sending = mờ .8 · disabled = mờ .7 thống nhất toàn kho (v1 chia 4 mức) |
| Đổi khuôn | chip soft-bg | success/warning nền soft; overdue solid danger; streak radius-full |
| Đổi màn | s1–s8 | flow thật (login đi tiếp, Xóa mở dialog, QUÁ HẠN + kanban advance ở s7, bottomnav mobile) |

## Sắp xoá (có hiệu lực ở bản SAU)

Không có.

## Ánh xạ experience → gói (đề xuất — bên nhận tự khai ở phía mình)

| Experience (tên bên nhận) | Gói |
|---|---|
| Tìm kiếm người / journal, gắn người, chọn ngày, lọc khoảng ngày, xác nhận xoá, mobile nav | orbit-core-dark |

## Nội dung gói

| Thành phần | Số lượng |
|---|---|
| Token | 48 |
| Component | 21 |
| Màn hình | 8 |

## Kiểm chứng

- `make verify` xanh ngày 2026-10-28 — gói qua trọn danh mục `handoff/PACKAGE-SPEC.md §8`.
- Nghiệm thu vòng 2: 2026-10-28
- Git tag: `ds-orbit-core-dark-v2`.
