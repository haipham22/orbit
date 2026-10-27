---
type: decisions
tier: T0
append_only: true
last_reviewed: "2026-10-27"
---

# DECISIONS — orbit

> **Append-only.** Never edit an old row; when a new decision supersedes an old one, add a new row and note `supersedes: <date>`.
>
> This file **replaces asking the project owner**. From now on, anything ambiguous → pick the most reasonable option according to
> `PRD.md` / `ARCHITECTURE.md` / `TECHSTACK.md` → log one row here → keep going.
> The project owner reads it once at the end of the session, without being interrupted mid-row.

**When to log**: stack, main libraries, data model, money calculation, auth, edge-case handling, performance trade-offs — anything that, 3 days later, you'll look back at and ask "why did we do it that way?".

**When not needed**: naming a variable, splitting a file, picking a small utility library that can be swapped anytime.

---

| Date | Decision | Reason | Standing assumption | Reversible? |
|---|---|---|---|---|
| (template) | Log decisions in this file | Small solo product, needs to ship within a week to test the response | Scope can be locked within 2 hours | Yes — switch to a heavier process if that limit is exceeded |
| 2026-10-27 | Pothos resolvers gọi service layer trực tiếp, không wire @pothos/plugin-drizzle cho CRUD | RC risk + n+1 xử lý ở service (batch labels); plugin cài sẵn, wire lại khi cần relational queries | Có — thêm plugin không đổi schema |
| 2026-10-27 | Env thật ở `deployment/local/.env`, KHÔNG file/symlink env nào ở root; `scripts/run-with-env.mjs` preload env cho next dev/build/start, script tsx tự config({path}) | Root sạch theo pack convention; dotenv không ghi đè process env sẵn có → production k8s inject Secret vào env, loader tự no-op | Có — trả file về root bất cứ lúc nào |
| 2026-10-27 | Root `Makefile` là command contract (make dev/check/test/migrate/deploy/doctor), pnpm scripts là implementation | Contract thống nhất theo pack convention; db startup thuộc dev command (compose up --wait), user không chạy compose tay | Có — đổi target make không đụng code |

<!-- The seed row above deliberately carries the date "(template)" so it does NOT count as a decision —
     a decision only counts when it has an ISO date logged by this project itself. -->

<!-- Sample rows:
| 2026-08-01 | Soft delete instead of hard delete for orders | Orders may need restoring when a customer calls back; AC-4 mentions "mistaken cancellation" | Low order volume, no risk of table bloat early on | Yes — switch to hard delete with a migration |
| 2026-08-01 | Clerk for auth instead of building it | 20 minutes instead of 1 day; PRD §7 locked Google sign-in | Accept a third-party dependency + cost at scale | Hard — switching providers means migrating users |
-->
