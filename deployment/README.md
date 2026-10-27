# Deployment — orbit

"How to run this project" lives here, not in the repo root. Three rules:

1. `.env.example` is the ONE env file ever committed — variable NAMES and
   descriptions only, never real values. Copy it to `deployment/local/.env`,
   fill it in, and never commit that copy.
2. The real `.env` is never committed. Anything secret (credentials, keys,
   connection strings with passwords) stays out of git.
3. Local run artifacts live in `deployment/local/` — compose files, seed data,
   init SQL, dev Dockerfiles. The repo root stays clean.

Each stack's dev command owns its database startup: `pnpm dev` starts Postgres
itself (compose up, wait-for-ready, migrate, seed). Users never run compose by
hand and never guess a startup order.

Seed data is a prerequisite for testing, not an afterthought. Seed from the
sample-data section of `context/PRD.md` so tests exercise realistic data.
