---
type: techstack
tier: T0
status: DRAFT
last_reviewed: "2026-10-27"
---

# TECHSTACK — orbit

> Locked upfront, with a one-line reason in `DECISIONS.md`. Changing the stack after the lock breaks rule #1 — the trade-off must be logged.

---

## 1. Stack per target

### Target: `app`

| Item | Choice | Version | Reason |
|---|---|---|---|
| Skill in use | `stack-nextjs-fullstack` | — | Next.js fullstack, thin routes + features/ |
| Language | TypeScript | 5.9.3 (pin, không nâng TS7) | TS7 toolchain chưa verify |
| Framework | Next.js (Turbopack) + React | 16.4.3 / 19.3.0 | App Router, RSC |
| Database | Postgres | 18 | docker compose local, k8s ở infra user |
| ORM / query layer | Drizzle + postgres-js | 1.0.0-rc.5 (pinned RC) | Pothos drizzle plugin peer `>=1.0.0-beta` |
| GraphQL | GraphQL Yoga + Pothos | 6 / 4 | planned Phase 4 — chưa cài |
| Auth | AuthProvider abstraction: `local` (iron-session + Argon2id, default) \| `clerk` (@clerk/nextjs) | 9.0.1 / 7.9.20 | OSS zero-SaaS default; user deploy với clerk — deps cả 2 cài sẵn |
| Jobs | JOBS_PROVIDER: `none` (default) \| Temporal | — | planned Phase 9 — @temporalio/* lazy install sau |
| UI kit | Tailwind v4 (CSS-first) + shadcn new-york + RHF/zod | 4.x / — / 7.x + zod 4.x | Field pattern, không legacy Form |
| Test runner | vitest | — | planned Phase 10 — chưa cài |
| Deploy | k8s (user cluster) qua Docker `output: standalone` | — | orbit-web luôn có; orbit-worker chỉ khi JOBS_PROVIDER=temporal |

`Skill in use` must be one of: `stack-nextjs-fullstack` · `stack-nestjs` · `stack-go` (+ `addon-graphql` if available), or `custom` for a project-specific stack. Build details, folder structure, and the production-ready preset live in `.claude/skills/<name>/SKILL.md` — **do not copy them here**.

## 2. Shared infrastructure

| Item | Choice | Version | Used by which target |
|---|---|---|---|
| Postgres | docker compose (`db` service, dev local) | 18 | app |
| Temporal | docker compose profile `temporal` + worker process | — | app (chỉ khi JOBS_PROVIDER=temporal) |
| Redis | CACHE_PROVIDER `memory` default; `redis` sau | — | app (optional) |
| Tooling | mise (node 24 + pnpm 11) | node 24 / pnpm 11.28.8 | app |

## 3. Why this stack

Personal PMS chạy 1 user, deploy k8s sẵn có của user, đồng thời open-source được → mọi integration nặng (Clerk, Temporal, Redis) phải opt-in qua provider env, default chỉ cần Postgres. Next 16 + Drizzle RC chọn vì plan đã research-verified 2026-10 (gotchas: proxy.ts, cacheComponents OFF). Chi tiết từng lock nằm trong `DECISIONS.md`.

## 4. Version pinning

Đọc từ `package.json` (2026-10-27):

```
next 16.4.3 · react 19.3.0 · typescript 5.9.3 · drizzle-orm 1.0.0-rc.5
drizzle-kit 1.0.0-rc.5 · postgres 3.4.9 · @clerk/nextjs 7.9.20
iron-session 9.0.1 · @node-rs/argon2 2.2.2 · zod 4.6.7
react-hook-form 7.91.0 · tailwindcss 4.x · eslint 9.39.5
node 24 · pnpm 11.28.8 (mise.toml + packageManager)
```

## 5. Command contract

Root `Makefile` là contract duy nhất; pnpm scripts là implementation bên trong:

| Command | What it does | Working? |
|---|---|---|
| `make dev` | db (wait healthy) + migrate + app | ☑ |
| `make check` | Lint + typecheck + build | ☑ |
| `make test` | Smoke + critical flows (vitest) | ☐ placeholder đến Phase 10 |
| `make migrate` | db (wait healthy) + versioned migrations | ☑ |
| `make deploy` | Docker image standalone → k8s (Dockerfile Phase 10) | ☐ placeholder |
| `make doctor` | Check env + db connection (+ SESSION_SECRET, TEMPORAL khi bật) | ☑ |

## 6. Environment variables

Full list in `deployment/.env.example`. Never commit a real `.env` —
the real filled-in copy lives at `deployment/local/.env`; root `.env.local` is a symlink to it (Next.js reads native).

| Variable | Used for | Target | Required? |
|---|---|---|---|
| `DATABASE_URL` | Postgres connection | app | yes |
| `AUTH_PROVIDER` | `local` (default) \| `clerk` | app | no (default local) |
| `ORBIT_USER_EMAIL` | local mode: email duy nhất được login | app | local mode |
| `SESSION_SECRET` | local mode: mã hoá session cookie (≥32 ký tự) | app | local mode |
| `NEXT_PUBLIC_CLERK_*` / `CLERK_SECRET_KEY` | clerk mode keys | app | clerk mode |
| `JOBS_PROVIDER` | `none` (default) \| `temporal` | app | no |
| `TEMPORAL_ADDRESS` / `TEMPORAL_NAMESPACE` / `TEMPORAL_TASK_QUEUE` | Temporal connection | app | temporal mode |
| `CACHE_PROVIDER` / `REDIS_URL` | cache provider chọn | app | no |
