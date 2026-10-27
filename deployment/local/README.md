# deployment/local/ — what belongs here

Everything needed to run the whole system on one machine, and nothing else:

- `docker-compose.yml` — local database (service `db`, Postgres 18); Temporal services sẽ thêm sau dưới profile `temporal`
- `.env` — env file THẬT, copy từ `../.env.example` rồi fill (git-ignored). Root `.env.local` là symlink trỏ vào đây để Next.js đọc native
- `init.sql` / seed data — khi cần, từ sample-data section của `context/PRD.md`
- `Dockerfile.dev` / start script — chỉ nếu stack cần

## Chạy local

```
cp deployment/.env.example deployment/local/.env   # rồi fill giá trị
make doctor                                         # check env + db
make dev                                            # db + migrate + app
```

Mọi lệnh app (`pnpm dev/build/start`) preload env từ file này qua `scripts/run-with-env.mjs` — root repo không có file env nào.

## Three things easy to forget

1. `.env.local` phải có `DATABASE_URL` khớp creds trong compose (`postgres://orbit:orbit@localhost:5432/orbit`).
2. Seed data là điều kiện để test, không phải afterthought — data thật từ `context/PRD.md` trước, test sau.
3. Một compose file cho cả hệ, một lệnh up, một lệnh down.
