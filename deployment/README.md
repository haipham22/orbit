# Deployment — orbit

"How to run this project" lives here, not in the repo root. Three rules:

1. `deployment/.env.example` is the ONE env file ever committed — variable NAMES and
   descriptions only, never real values. Copy it to `.env.local` at the repo root
   (Next.js reads it natively; both are git-ignored), fill it in, never commit it.
2. The real `.env` is never committed. Anything secret (credentials, keys,
   connection strings with passwords) stays out of git.
3. Local run artifacts live in `deployment/local/` — compose files, seed data,
   init SQL, dev Dockerfiles. The repo root stays clean.

Local database: `docker compose -f deployment/local/docker-compose.yml up -d db`,
then `pnpm db:migrate`.

Seed data is a prerequisite for testing, not an afterthought. Seed from the
sample-data section of `context/PRD.md` so tests exercise realistic data.
