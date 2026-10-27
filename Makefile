.PHONY: dev preview check test migrate deploy doctor

COMPOSE := docker compose -f deployment/local/docker-compose.yml

dev: ## db (wait healthy) + migrate + app
	$(COMPOSE) up -d --wait db
	pnpm db:migrate
	pnpm dev

preview: ## production preview: build + next start :3002 (dev vẫn ở :3000)
	$(COMPOSE) up -d --wait db
	pnpm build
	node scripts/run-with-env.mjs next start -p 3002

check: ## lint + typecheck + build
	pnpm lint
	pnpm typecheck
	pnpm build

test: ## vitest (Phase 10)
	pnpm test

migrate: ## db (wait healthy) + run migrations
	$(COMPOSE) up -d --wait db
	pnpm db:migrate

deploy: ## docker build standalone image (Phase 10)
	@echo "Dockerfile chua co — Phase 10"; exit 1

doctor: ## check env + db connection
	node scripts/doctor.mjs
