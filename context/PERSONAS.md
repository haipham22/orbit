---
type: personas
tier: T1
status: APPROVED
last_reviewed: "2026-10-28"
---

# PERSONAS — orbit

## 1. Danh sách persona

### Persona 1 — P-OWN: Chủ hệ thống (owner)

| Field | Value |
|---|---|
| Mã (intake) | P-OWN |
| Role | Người duy nhất dùng orbit hàng ngày: quản người quen, nhật ký, việc cần làm — đồng thời là người deploy và OSS maintainer |
| Goals | • Tra người quen < 5 giây • Ghi nhật ký có link người liên quan • Nhìn dashboard 1 phát nắm tình hình |
| Pains | • Thông tin rải trong ghi chú/app/đầu • Tra người quen phải nhớ đã ghi ở đâu • UI "vô chủ" — dùng được nhưng không cảm giác là của mình |
| Thiết bị chính | Laptop/desktop chính + điện thoại đáng kể *(chốt phỏng vấn F-1, 2026-10-27)* |
| Môi trường sử dụng | Nhà/làm việc; tra nhanh trên điện thoại khi ra ngoài *(suy từ F-1)* |
| Thời lượng phiên | Hỗn hợp: vài chớp 30 giây tra người + phiên dài ghi nhật ký 10–20 phút *(ước lượng — crit-firsttime sẽ bắt nếu sai)* |
| Anti-persona | Không phải multi-user, khách vãng lai, hay mobile-only — orbit không có multi-user, không PWA |

## 2. Bối cảnh đọc giao diện

P-OWN đọc orbit theo hai nhịp: **chớp** (tra người, liếc dashboard 30 giây — thứ bậc
phải đọc được trong một liếc, màn danh sách phải scan được) và **ngồi** (ghi nhật ký,
sắp việc — editor phải thoải mái phiên dài). **Desktop chính + mobile đáng kể**
(F-1): danh sách phải dùng được ở 360px, kanban tasks cần phương án mobile; vùng chạm
≥44px cả hai nền. Dark + light đồng cấp từ vòng 1 (F-2) — không coi dark là afterthought.
**Đối tượng định hướng thiết kế (amendment 2026-10-27): Gen Z từ 13 tuổi**, có điện
thoại + dùng được máy tính — **mobile = đơn giản, tối giản; desktop = nịnh mắt; tùy
chỉnh cao** (mọi màu qua semantic token, accent là slot thay được — theme preset là
vòng sau). Giọng Gen Z tiếng Việt thân mật — "Chưa có gì ở đây cả ✌️" hơn là
"Không có dữ liệu".

## 3. Phân vai crit

| Vai | Đóng persona | Đợt |
|---|---|---|
| facet-crit-a11y | P-OWN | 1 |
| facet-crit-brand | P-OWN | 1 |
| facet-crit-consistency | P-OWN | 1 |
| facet-crit-smallscreen | P-OWN | 2 |
| facet-crit-content | P-OWN | 2 |
| facet-crit-firsttime | P-OWN | 2 |

