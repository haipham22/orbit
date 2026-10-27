# deployment/local/ — what belongs here

Everything needed to run the whole system on one machine, and nothing else:

- `docker-compose.yml` — local database (service `db`, Postgres 18); Temporal services sẽ thêm sau dưới profile `temporal`
- Env file thực tế KHÔNG ở đây — nằm ở repo root `.env.local` (Next.js đọc native, git-ignored). Copy từ `../.env.example`
- `init.sql` / seed data — khi cần, từ sample-data section của `context/PRD.md`
- `Dockerfile.dev` / start script — chỉ nếu stack cần

## Chạy local

```
cp deployment/.env.example .env.local   # rồi fill giá trị
docker compose -f deployment/local/docker-compose.yml up -d db
pnpm db:migrate
pnpm dev
```

## Three things easy to forget

1. `.env.local` phải có `DATABASE_URL` khớp creds trong compose (`postgres://orbit:orbit@localhost:5432/orbit`).
2. Seed data là điều kiện để test, không phải afterthought — data thật từ `context/PRD.md` trước, test sau.
3. Một compose file cho cả hệ, một lệnh up, một lệnh down.
