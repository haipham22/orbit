---
type: conventions
tier: T0
last_reviewed: "2026-10-27"
---

# CONVENTIONS — orbit

> Shared conventions, independent of stack. Stack-specific conventions live in `.claude/skills/stack-<name>/SKILL.md §3, §7`.
> Deliberately short — nobody reads long conventions.

---

## 1. Structure

- Module boundaries follow `ARCHITECTURE.md §8`. Putting logic in the wrong layer is a bug, not a style issue.
- One file, one job. A file over 200 lines is a signal to split, not a hard rule.
- Only **one layer** touches the database — `src/features/*/queries.ts` (service layer).
- External service calls go through one single place.
- Project-specific (orbit):
  - `src/server/**` pure Node — cấm `import next/*` (ESLint enforce). Worker Temporal share được.
  - RSC gọi service trực tiếp; client components mutate qua `src/lib/gql-client.ts` → `/api/graphql`.
  - Provider pattern cho mọi integration nặng: `AUTH_PROVIDER`, `JOBS_PROVIDER`, `CACHE_PROVIDER` — default là option zero-infra (local / none / memory). Lazy import provider không dùng.
  - `src/components/ui/` là shadcn CLI-owned — không hand-edit.

## 2. UI (when there is a UI)

- Colors / font sizes / spacing / radii come from the tokens in `DESIGN-SYSTEM.md §2` — hardcoding values is a bug, not a matter of taste.
- UI blocks are assembled from the component library in `DESIGN-SYSTEM.md §4`; need a new block → add it to the library first (with the required states), then use it.
- Empty / error / loading states follow the patterns in `DESIGN-SYSTEM.md §5` — don't invent a per-screen error style.
- Changing tokens after the project owner has signed off the prototype → one row in `DECISIONS.md` (rule #3).

## 3. Naming

- Name by the business domain, not the technical layer: `bookingConflict`, not `dataProcessor2`.
- Use the exact terminology from `PRD.md`. If the PRD says "appointment", the code is `appointment`, not `booking` here and `schedule` there.
- Use English for identifiers; the product's language for user-facing content and comments that explain **why**.
- Repeated value sets (status, role, event, route, error code) → `const`/enum in one place. Scattered hardcoded strings are forbidden — one character off is a silent bug.

## 4. Comments

- Comments explain **why**, not **what** (the code already says what).
- Where the code deviates from the obvious → comment with a reference: `// soft delete — see DECISIONS.md D3`.
- Don't keep dead code as comments. Delete it — git remembers for you.

## 5. Error handling

- Never swallow errors. A `catch` that neither logs nor handles is forbidden.
- Centralized error logging: every error goes through **one single point** of the stack (error
  middleware/filter/handler) so it is logged one way, in one place. Other layers only wrap with context
  (`%w`, `zap.Error`) and push it up; no per-layer log styles.
- Error codes are declared centrally in the project's **one enum/const**. The BE returns only the
  machine-readable `code` from that enum — **no** detailed messages, no human-language copy from the BE. No ad-hoc codes in controllers/handlers.
- Errors are returned in **one project-wide envelope** — e.g.
  `{ ok: false, error: { code } }` — shape decided once (log it in `DECISIONS.md`
  if there are variants) and every endpoint uses exactly that shape. The FE reads `error.code` to
  look up i18n; no endpoint invents its own error shape.
- System errors: log enough context to trace back (who, what action, which data).

## 6. Backend — shared ground across stacks

- Structured logging is mandatory: the stack's logger (pino · zap), log input/output of every
  mutation. No `console.log` / `fmt.Println` in production code.
- Graceful shutdown: SIGTERM is a warning, not a kill — stop accepting new requests first,
  let in-flight requests/jobs finish within a deadline, close DB/resources last.
  Never hard-exit and drop in-flight requests.
- A required env var is missing → the app **dies immediately at boot**, no half-running state.
- Migrations are versioned, committed to the repo, and run before app start. No `db push` in production.
- Business-logic unit tests **mock the repository** (mocks generated from the interface) — no real
  DB. Touching the DB is an integration test, kept separate.
- API docs are generated **from code** (Swagger/OpenAPI via the stack's annotation/decorator/schema) — no hand-written YAML files. The UI is only enabled in dev environments. Next.js
  fullstack: every route handler (`app/api/**`) must have docs generated from the zod schema.

## 7. Web frontend — shared ground across stacks

- Form inputs use `react-hook-form` + `zodResolver` pointing at the feature's schema.
  Never control inputs with manual `useState` — it re-renders on every keystroke.
- i18n is mandatory from day one (the framework's official library). Every user-visible string goes
  through the dictionary, including the **BE error code → user-facing message** map that tells the
  user what to do next. A code missing from the dictionary → a generic fallback message
  ("Something went wrong, please try again"), never a raw `code` or stack trace shown to the user.
- Minimal client state: store only what the client genuinely shares across many
  components. Server data is always fetched through a server action / service, never stuffed into the store.

## 8. Git

- Small commits, one idea per commit.
- Imperative, active-voice messages: `add appointment booking screen`, not `updates`.
- Non-obvious decision → reference it in the commit: `# DECISION: DECISIONS.md D3`.
- Code diverges from docs → fix the docs **in the same commit** (rule #4).

## 9. Dependencies

- Adding a library is a decision — log it in `DECISIONS.md` if it touches the architecture or is hard to remove.
- Prefer what the framework already ships over a new library.
- Don't add a library just to use one function.

## 10. Before saying "done"

```
make check   green
make test    green
manual run-through done — findings fixed or logged
```

Missing any of the three means not done (rule #8).

#### Candidate rules

Rules observed in practice but not yet promoted. One line per rule:

`<!-- cand: YYYY-MM-DD --> <the rule in one sentence>`

Promote into `## Forbidden patterns` once confirmed by real usage; delete if stale.

#### Forbidden patterns

The `ek_context_conventions_guard` hook reads ONLY the fenced block below (one regex per line, `#` starts a comment) and blocks newly written lines that match a pattern. Edit this file to change the law — the hook re-reads it on every edit, no config needed.

````regex
# TypeScript / JavaScript
console\.log\(          # debug prints
:\s*any\b               # any type
# Python
# except\s*:              # bare except
````
