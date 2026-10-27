---
type: prd
tier: T0
status: DRAFT
last_reviewed: "2026-10-27"
---

# PRD — orbit

> **Describe the product at the slice of the CURRENT LOOP.** Fill in upfront. After the scope is locked, this file is the source of truth for every agent decision.
> Delete every `_TO_FILL_` line once filled in — checks look for this marker.

---

## 1. Pain point

Thông tin cá nhân (quan hệ, nhật ký, việc cần làm) nằm rải rác — ghi chú điện thoại, app ghi chú, đầu. Cần 1 nơi duy nhất: tra người quen nhanh (search tên), ghi nhật ký kèm link tới người liên quan, theo dõi task + sinh nhật trên 1 dashboard. Yêu cầu thứ 2: system phải agent-ready — agent chạy được jobs qua Temporal, đọc/ghi qua GraphQL.

## 2. Audience

1 người duy nhất — chủ project (personal management system, không multi-user). Deploy lên k8s cluster cá nhân; đồng thời công khai source (OSS) nên mọi setup phải chạy được với zero SaaS.

Detailed personas + per-role capabilities + permission matrix: `context/PERSONAS.md`.

## 3. Acceptance criteria (AC) — this loop

| # | What can be done | Done when | Capability |
|---|---|---|---|
| AC-1 | Login vào dashboard | `local` mode: set-password → login → dashboard; `clerk` mode: sign-in → dashboard; sai email bị chặn; curl GraphQL không session = 401 | |
| AC-2 | Quản lý people + labels | CRUD qua UI + GraphiQL; gán/nhỡ labels | |
| AC-3 | Viết nhật ký + search | editor + full-text search (tsvector) ranked; typo vẫn khớp qua trgm; link entry tới person | |
| AC-4 | Quản lý tasks | board + projects + due date + priority; link task tới person; person detail hiện links | |
| AC-5 | Dashboard tổng quan | 4 sections (birthday, upcoming due, recent journal, task summary) render đúng với seed data | |
| AC-6 | (optional) Jobs tự động | `none`: birthday vẫn hiện (tính trực tiếp từ DB); `temporal`: schedules chạy, agent_runs ghi row, thấy run trên Temporal UI | |

## 4. Priority — what this loop ships, where the rest lives

Loop này ship hết AC-1..AC-5 (core PMS chạy được end-to-end, plan phases 3–8); AC-6 là phase 9 (opt-in). Agent-ready deploy artifacts (Dockerfile, worker) ở phase 10. Tất cả Out-of-scope khác nằm ROADMAP.

## 5. Out-of-scope — definitely NOT done in this loop

- Multi-user / sharing / permission phân cấp
- Mobile app / PWA
- Realtime sync (WebSocket)
- i18n framework
- Bắt buộc SaaS nào (Clerk/Temporal/Redis) cho user tự host — chỉ opt-in
- Import/export data từ nguồn ngoài
- Agent dashboard UI (chỉ schema agent_runs reserved)

## 6. Hypothesis + success metric

Công cụ cá nhân — loop này không đo metric kinh doanh; done = ACs §3 xanh + E2E fresh-clone checklist chạy trót (plan §E2E). Đánh giá thực tế = user tự dùng hàng ngày sau deploy k8s.

---

## 7. Decisions already locked

| Item | Locked |
|---|---|
| Login | AuthProvider abstraction: `local` (iron-session + Argon2id, default, zero SaaS) \| `clerk` (user deploy); clerk mode gate bằng `ORBIT_USER_EMAIL` |
| Charging money | không — OSS + personal |
| Core data model | people, labels, people_labels, journal_entries, projects, tasks, links, agent_runs — chi tiết `ARCHITECTURE.md §6` |
| Edge cases to handle | unique names, links unique 3 cột, cascade delete; còn lại `ARCHITECTURE.md §6` |
| Empty state | _TO_FILL_ |
| Error state | _TO_FILL_ |
| Sample data | _TO_FILL_ |
| Name / domain / voice | orbit — tiếng Việt thân mật, không corporate |
| Deploy place | k8s cluster cá nhân (image standalone; manifests thuộc infra user) |

## 8. Sources

- Plan scaffold: `~/.claude/plans/floating-hugging-lemur.md` (stack đã research + chốt 2026-10)
- Thảo luận trực tiếp với owner trước khi lên plan
