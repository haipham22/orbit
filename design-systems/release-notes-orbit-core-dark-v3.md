# orbit-core-dark v3 — đồng bộ patch + data flip (2026-10-28)

## Tóm tắt

Đồng bộ toàn bộ patch v3 với orbit-core; data-ink/data-paper lật theo dark (ink gần trắng, paper gần đen) để chip màu data đạt AA.

## Đổi so với bản trước

| Loại | Mục | Chi tiết |
|---|---|---|
| Thêm | `--color-data-ink` | #E9ECEF |
| Thêm | `--color-data-paper` | #14171C |
| Thêm | `Comp_Avatar` | component mới |
| Thêm | `Comp_BottomNav` | component mới |
| Thêm | `Comp_Button` | component mới |
| Thêm | `Comp_Calendar` | component mới |
| Thêm | `Comp_Card` | component mới |
| Thêm | `Comp_Chip` | component mới |
| Thêm | `Comp_ConfirmDialog` | component mới |
| Thêm | `Comp_DateInput` | component mới |
| Thêm | `Comp_DateRange` | component mới |
| Thêm | `Comp_EmptyState` | component mới |
| Thêm | `Comp_Icon` | component mới |
| Thêm | `Comp_Modal` | component mới |
| Thêm | `Comp_NavItem` | component mới |
| Thêm | `Comp_PersonPicker` | component mới |
| Thêm | `Comp_PersonRow` | component mới |
| Thêm | `Comp_SearchInput` | component mới |
| Thêm | `Comp_Skeleton` | component mới |
| Thêm | `Comp_StreakBadge` | component mới |
| Thêm | `Comp_TextInput` | component mới |
| Thêm | `Comp_Toast` | component mới |
| Thêm | `Comp_XPBar` | component mới |
| Thêm | `S9` | màn mới |

## Sắp xoá (có hiệu lực ở bản SAU)

Không có.

## Ánh xạ experience → gói (đề xuất — bên nhận tự khai ở phía mình)

| Experience (tên bên nhận) | Gói |
|---|---|
| (mọi experience — theme switcher) | orbit-core-dark |

## Nội dung gói

| Thành phần | Số lượng |
|---|---|
| Token | 50 |
| Component | 21 |
| Màn hình | 9 |

## Kiểm chứng

- `make verify` xanh ngày 2026-10-28 — gói qua trọn danh mục `handoff/PACKAGE-SPEC.md §8`.
- Nghiệm thu vòng 3: 2026-10-28
- Git tag: `ds-orbit-core-dark-v3`.
