---
type: architecture
tier: T0
status: DRAFT
last_reviewed: "2026-10-27"
---

# ARCHITECTURE — orbit

> **Thin but decisive.** Enough for the agent to decide while coding without asking. Not a 20-page HLD.
>
> **System size — rule #5: one app, one DB, one deploy place — no microservices.** §1 is exactly one row, §2 exactly one row, §3 says `—`.
> Multi-target projects: one folder per boundary/experience, declared in §1–§3 — **never spawn targets beyond that declared list.**
>
> Remove every `_TO_FILL_` marker once filled in.

---

## 1. Backend boundaries

| Boundary | Job (1 line) | Owns data | Loop |
|---|---|---|---|
| `app` | Next.js fullstack: PMS (people/journal) + tasks + dashboard, GraphQL API, optional Temporal jobs | people, labels, people_labels, journal_entries, projects, tasks, links, agent_runs | MVP build-out (plan phases 3–10) |

## 2. Frontend experiences — web

Single-user personal tool → 1 persona (owner).

| Experience | Persona | Exposed capability | Loop | Design system |
|---|---|---|---|---|
| orbit-web | owner (1 user) | dashboard, people, journal, tasks | MVP build-out | orbit-core v1 + orbit-core-dark v1 (source: orbit-facet, tag ds-*-v1) |

## 3. Frontend experiences — mobile

| Experience | Platform | Persona | Loop | Design system |
|---|---|---|---|---|
| — | | | | — |

## 4. Diagram

```
Owner ──► Next.js (k8s, output standalone)
             ├──► Postgres 18 (docker local / k8s)  — Drizzle ORM
             ├──► Auth: local (iron-session cookie) | Clerk (clerkMiddleware)
             ├──► /api/graphql — Yoga + Pothos (guard: requireUser)
             └─► Temporal (optional, JOBS_PROVIDER=temporal)
                    └── orbit-worker process — schedules: birthday daily, reminder hourly
```

## 5. Contracts between targets

One target → `—`: no boundary left to sign a contract across.

| Contract | Provider | Consumer | Kind | Loop |
|---|---|---|---|---|
| — | | | | |

## 6. Core data model

| Entity | Key fields | Relations | Constraints |
|---|---|---|---|
| people | full_name, relationship, dob, notes, contact_methods jsonb | ← people_labels, links | GIN trgm trên `lower(full_name)` |
| labels | name, color | → people_labels | name unique |
| people_labels | person_id, label_id | → people, labels | composite pk, cascade |
| journal_entries | title, body, entry_date | ← links | tsvector generatedAlwaysAs(setweight A/B), GIN; search `websearch_to_tsquery` + `ts_rank` |
| projects | name, color, archived | → tasks | name unique |
| tasks | title, notes, status enum, priority enum, due_date, completed_at | → projects, ← links | index due_date |
| links | source_type enum(journal_entry\|task), source_id, person_id | → journal_entries / tasks, → people | polymorphic, unique (source_type, source_id, person_id) |
| agent_runs | workflow_id, workflow_type, status enum, input jsonb, result jsonb, error, started_at, finished_at | — | reserved cho agent dashboard |

Conventions: uuid PK defaultRandom, timestamptz, pgEnum. `app_user` table chỉ dùng bởi auth local (Clerk là nguồn identity khi clerk mode).

**Decided edge cases** (source: `PRD.md §7`):

| Situation | Handling |
|---|---|
| Duplicates | labels/projects: unique name chặn; links: unique 3 cột |
| Delete | people_labels cascade; person/task/journal delete → links cascade (xác nhận lúc Phase 5–7) |
| Concurrent edit | 1 user → last-write-wins, không optimistic locking (`updated_at` chỉ để sort/hiện thị) |
| Double submit | submit button `disabled={pending}` + label "Đang lưu…" trong mọi form component |

## 7. Core flow

```
1. Login → requireUser() (local cookie | Clerk) — (app)/layout.tsx guard + root GraphQL guard
2. RSC page gọi thẳng features/<x>/queries.ts (service layer: Drizzle + zod validate)
3. Client mutation → lib/gql-client.ts → /api/graphql (Yoga context từ getUser())
4. Resolver gọi cùng hàm service → Postgres
5. (optional temporal) schedule/trigger → workflow (pure) → activity (owns DB) → agent_runs row
```

## 8. Module boundaries

| Directory | Contains | Callable by | Must not do |
|---|---|---|---|
| `src/app/` | routing adapters (thin), layouts, API routes | — | business logic |
| `src/features/*/queries.ts` | service layer: Drizzle + zod validate | RSC trực tiếp + resolvers | import `next/*` ngoài server-safe |
| `src/features/*/components/` | feature UI | chính feature đó | query DB trực tiếp |
| `src/lib/` | client-safe utils: cn, gql-client, dates | mọi nơi | server-only imports |
| `src/server/` | pure Node: auth providers, db, graphql builder, jobs providers | app + worker process | **import `next/*`** — ESLint `no-restricted-imports` error |
| `src/server/jobs/` | JOBS_PROVIDER: none (default) \| temporal — lazy import | service layer | hard-depend Temporal khi none |
| `src/components/ui/` | shadcn CLI-owned | mọi nơi | hand-edit |

Ground rules that never change:
- Only **one layer** touches the DB. The UI never queries directly.
- Business logic does not live in components.
- External service calls go through one single place (easy to mock in tests, easy to swap when a provider breaks).

## 9. External services

| Service | Used for | If it breaks |
|---|---|---|
| Clerk | auth (clerk mode only) | sign-in fail → app unusable với clerk mode; local mode không ảnh hưởng |
| Temporal | scheduled jobs (temporal mode only) | jobs dừng; app core vẫn chạy (birthday tính trực tiếp từ DB khi none) |
| Redis | cache (redis mode, sau) | fallback memory provider |

## 10. Deliberately NOT doing

- Multi-user / multi-tenant — CHƯA trong vòng này: 1 owner, Clerk chỉ là identity gate (ORBIT_USER_EMAIL); mở đăng ký là mục tiêu sau, schema không chặn đường
- Mobile app
- WebSocket / realtime
- i18n — BỎ CHỐT CŨ 2026-10-28: có i18n (next-intl, cookie locale, vi default + en); khung làm trong vòng DS, feature copy dịch dần
- Microservices — 1 app + (optional) 1 worker process
- Bắt buộc Temporal/Redis/Clerk cho OSS user — mọi thứ nặng là opt-in qua provider env
