# Deployment — orbit

"How to run this project" lives here, not in the repo root. Three rules:

1. `deployment/.env.example` is the ONE env file ever committed — variable NAMES and
   descriptions only, never real values. The real filled-in copy lives at
   `deployment/local/.env` (git-ignored); root `.env.local` is a symlink to it so
   Next.js reads it natively.
2. The real `.env` is never committed. Anything secret (credentials, keys,
   connection strings with passwords) stays out of git.
3. Local run artifacts live in `deployment/local/` — compose files, seed data,
   init SQL, dev Dockerfiles. The repo root stays clean.

Local database: `make migrate` (tự compose up + wait healthy + migrate).
Run all: `make dev`.

Seed data is a prerequisite for testing, not an afterthought. Seed from the
sample-data section of `context/PRD.md` so tests exercise realistic data.
