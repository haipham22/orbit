CREATE TYPE "agent_run_status" AS ENUM('running', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "link_source_type" AS ENUM('journal_entry', 'task');--> statement-breakpoint
CREATE TYPE "task_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "task_status" AS ENUM('todo', 'in_progress', 'done');--> statement-breakpoint
CREATE TABLE "agent_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workflow_id" text NOT NULL,
	"workflow_type" text NOT NULL,
	"status" "agent_run_status" DEFAULT 'running'::"agent_run_status" NOT NULL,
	"input" jsonb,
	"result" jsonb,
	"error" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "journal_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"entry_date" date NOT NULL,
	"search_vector" tsvector GENERATED ALWAYS AS (setweight(to_tsvector('english', coalesce(title, '')), 'A') || setweight(to_tsvector('english', coalesce(body, '')), 'B')) STORED,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "labels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL UNIQUE,
	"color" text DEFAULT '#6366f1' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"source_type" "link_source_type" NOT NULL,
	"source_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "links_source_person_unique" UNIQUE("source_type","source_id","person_id")
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"full_name" text NOT NULL,
	"relationship" text,
	"dob" date,
	"notes" text,
	"contact_methods" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "people_labels" (
	"person_id" uuid,
	"label_id" uuid,
	CONSTRAINT "people_labels_pkey" PRIMARY KEY("person_id","label_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL UNIQUE,
	"color" text DEFAULT '#6366f1' NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"notes" text,
	"status" "task_status" DEFAULT 'todo'::"task_status" NOT NULL,
	"priority" "task_priority" DEFAULT 'medium'::"task_priority" NOT NULL,
	"due_date" date,
	"project_id" uuid,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "journal_entries_search_idx" ON "journal_entries" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "people_full_name_trgm_idx" ON "people" USING gin (lower("full_name") gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "tasks_due_date_idx" ON "tasks" ("due_date");--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_person_id_people_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "people_labels" ADD CONSTRAINT "people_labels_person_id_people_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "people_labels" ADD CONSTRAINT "people_labels_label_id_labels_id_fkey" FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL;