# deployment/local/ — what belongs here

Everything needed to run the whole system on one machine, and nothing else:

- `docker-compose.yml` — local database + backing services
- `.env` — your filled-in copy of `../.env.example` (never committed)
- `init.sql` / seed data — from the sample-data section of `context/PRD.md`
- `Dockerfile.dev` / start script — only if the stack needs one

Git-ignored. Nothing here ships to production.

## Three things easy to forget

1. The dev command must start the database itself (compose up, wait, migrate,
   seed). Users never run compose by hand.
2. Seed data is a testing prerequisite, not an afterthought — realistic data
   from `context/PRD.md` first, tests second.
3. One compose file for the whole system, not one per service — one command up,
   one command down.
