# orbit

Personal management system: people/journal + tasks + dashboard, agent-ready qua Temporal.

## Quickstart (2 lệnh, zero SaaS)

Yêu cầu: Docker, mise (`mise install` tự setup node 24 + pnpm 11).

```bash
cp deployment/.env.example deployment/local/.env   # rồi điền SESSION_SECRET (≥32 ký tự) + ORBIT_USER_EMAIL
make dev                                           # db + migrate + next dev
```

Mở http://localhost:3000 → đăng nhập bằng email trong `ORBIT_USER_EMAIL`. Đặt mật khẩu:

```bash
pnpm set-password
```

## Providers (opt-in, default zero infra)

| Env | Giá trị | Cần gì thêm |
|---|---|---|
| `AUTH_PROVIDER` | `local` (default) — iron-session + Argon2id | chỉ Postgres |
| | `clerk` — Clerk keys + `ORBIT_USER_EMAIL` gate | Clerk account |
| `JOBS_PROVIDER` | `none` (default) — birthday tính trực tiếp từ DB, trigger route chạy inline | chỉ Postgres |
| | `temporal` — schedules daily, workflow runs | Temporal server + worker process |
| `CACHE_PROVIDER` | `memory` (default) | không gì |
| | `redis` | Redis server (chưa wire module) |

## Lệnh

```bash
make dev            # db (wait) + migrate + next dev
make check          # lint + typecheck + build
make test           # vitest
pnpm set-password   # đặt mật khẩu cho ORBIT_USER_EMAIL (local auth)
docker compose -f deployment/local/docker-compose.yml --profile temporal up -d   # Temporal + UI (:8080)
pnpm worker         # orbit-worker (chỉ khi JOBS_PROVIDER=temporal)
pnpm schedules      # đăng ký birthday-check-daily schedule
curl -X POST localhost:3000/api/jobs/birthday-check   # manual trigger
```

## Kiến trúc

- `src/app/` — thin route adapters; `src/features/*/queries.ts` — service layer (Drizzle + zod)
- `src/server/` — pure Node (auth/jobs/db/graphql/cache), không import `next/*` — Temporal worker dùng chung được
- RSC gọi service trực tiếp; client mutate qua `src/lib/gql-client.ts` → `/api/graphql` (GraphQL Yoga + Pothos)
- Person/journal/task link nhau qua bảng `links` polymorphic; journal search dùng Postgres FTS (`websearch_to_tsquery` + `ts_rank`), people search dùng pg_trgm

Chi tiết: `context/ARCHITECTURE.md`, quyết định: `context/DECISIONS.md`.

## Deploy (k8s)

`next.config.ts` dùng `output: standalone`. Build image:

```bash
docker build -t orbit .
docker run -p 3000:3000 \
  -e DATABASE_URL=... -e AUTH_PROVIDER=... -e SESSION_SECRET=... -e ORBIT_USER_EMAIL=... \
  orbit
```

- `orbit-web` deployment luôn có. `orbit-worker` deployment chỉ khi `JOBS_PROVIDER=temporal` (cùng image, entrypoint `pnpm worker`)
- Manifests k8s thuộc infra của bạn — repo chỉ cung cấp image
