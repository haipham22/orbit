---
type: decisions
tier: T0
append_only: true
last_reviewed: "2026-10-27"
---

# DECISIONS — orbit

> **Append-only.** Never edit an old row; when a new decision supersedes an old one, add a new row and note `supersedes: DN`. Rows are numbered sequentially — reference a decision by its `DN`.
>
> This file **replaces asking the project owner**. From now on, anything ambiguous → pick the most reasonable option according to
> `PRD.md` / `ARCHITECTURE.md` / `TECHSTACK.md` → log one row here → keep going.
> The project owner reads it once at the end of the session, without being interrupted mid-row.

**When to log**: stack, main libraries, data model, money calculation, auth, edge-case handling, performance trade-offs — anything that, 3 days later, you'll look back at and ask "why did we do it that way?".

**When not needed**: naming a variable, splitting a file, picking a small utility library that can be swapped anytime.

---

| # | Date | Decision | Reason | Standing assumption | Reversible? |
|---|---|---|---|---|---|
| D1 | 2026-10-27 | Pothos resolvers gọi service layer trực tiếp, không wire @pothos/plugin-drizzle cho CRUD | RC risk + n+1 xử lý ở service (batch labels); plugin cài sẵn, wire lại khi cần relational queries | Có — thêm plugin không đổi schema |
| D2 | 2026-10-27 | Env thật ở `deployment/local/.env`, KHÔNG file/symlink env nào ở root; `scripts/run-with-env.mjs` preload env cho next dev/build/start, script tsx tự config({path}) | Root sạch theo pack convention; dotenv không ghi đè process env sẵn có → production k8s inject Secret vào env, loader tự no-op | Có — trả file về root bất cứ lúc nào |
| D3 | 2026-10-27 | Root `Makefile` là command contract (make dev/check/test/migrate/deploy/doctor), pnpm scripts là implementation | Contract thống nhất theo pack convention; db startup thuộc dev command (compose up --wait), user không chạy compose tay | Có — đổi target make không đụng code |
| D4 | 2026-10-27 | Clerk keyless dev: `run-with-env.mjs` tự bootstrap accountless keys vào env trước khi spawn next (`scripts/clerk-keyless-dev.mjs`, cache `.clerk/.tmp/keyless.json`) | `clerkMiddleware()` assert env keys trước mọi render, handshake chỉ chạy ở ClerkProvider RSC → không có keys = 500 vĩnh viễn; endpoint `POST /v1/accountless_applications` public | Production luôn inject keys thật qua env, bootstrap tự no-op | Có — xóa file + set keys env thật |
| D5 | 2026-10-27 | UI multi-theme: 3 theme (cool-console default, warm-ledger, night-focus) switch qua `data-theme` trên `<html>`; token law ở `prototype/tokens.json` | Owner muốn cả 3 direction Phase A; shadcn/tailwind vốn CSS vars → 3 bộ vars rẻ; spec: `prototype/` (tokens + gallery là contract cho build thật) | Có — thêm/bớt theme = thêm/bớt 1 block vars |
| D6 | 2026-10-27 | Thiết kế định hướng Gen Z 13+ (mobile tối giản · desktop nịnh mắt); 1-user vòng 1 nhưng multi-user/monetize là 'chưa' thay vì 'không bao giờ'; accent/bg/font là slot user đổi được; dark mode vòng 1; theme preset library = vòng sau | Lời Authority ghi hộ `orbit-facet/intake/loops/loop-1/AMENDMENT-2026-10-27-audience-theme.md` — file này thắng các dòng PRD/PERSONAS lệch với nó | Có — đổi định hướng = đổi token/giọng copy |
| D7 | 2026-10-28 | Consume gói DS v1 (orbit-core + orbit-core-dark, tag ds-*-v1): tokens → src/app/globals.css (shadcn vars map 1-1 alias DS), dark pair qua next-themes (.dark), control sizes sm/md/lg 30/36/44, font slot = system + mono (Space Grotesk/Geist/PJS dời vòng sau); BC additive-first — đổi token/component phải qua facet trước | Hợp đồng APPROVED từ facet, DECISIONS facet ghi cùng luật | Có — token là data, revert = trả globals.css cũ |
| D8 | 2026-10-28 | Có i18n: next-intl không-routing (locale cookie NEXT_LOCALE, vi default + en), NextIntlClientProvider global, catalog src/messages/{vi,en}.json; en seed scope shell+auth, feature copy dịch dần theo từng màn restyle | Owner: "làm giao diện phải có i18n" — đảo ghi chú cũ 'i18n framework — không' ở ARCHITECTURE §10 | Có — bỏ provider + catalog là về trạng thái cũ |
