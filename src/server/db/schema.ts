import { sql } from "drizzle-orm";
import {
  boolean,
  customType,
  date,
  index,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const taskStatusEnum = pgEnum("task_status", ["todo", "in_progress", "done"]);
export const taskPriorityEnum = pgEnum("task_priority", ["low", "medium", "high", "urgent"]);
export const linkSourceTypeEnum = pgEnum("link_source_type", ["journal_entry", "task"]);
export const agentRunStatusEnum = pgEnum("agent_run_status", ["running", "completed", "failed"]);

export type ContactMethod = {
  type: string;
  value: string;
};

export const people = pgTable(
  "people",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: text("full_name").notNull(),
    relationship: text("relationship"),
    dob: date("dob"),
    notes: text("notes"),
    contactMethods: jsonb("contact_methods").$type<ContactMethod[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("people_full_name_trgm_idx").using("gin", sql`lower(${t.fullName}) gin_trgm_ops`)],
);

export const labels = pgTable("labels", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull().default("#6366f1"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const peopleLabels = pgTable(
  "people_labels",
  {
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
    labelId: uuid("label_id")
      .notNull()
      .references(() => labels.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.personId, t.labelId] })],
);

export const journalEntries = pgTable(
  "journal_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    body: text("body").notNull().default(""),
    entryDate: date("entry_date").notNull(),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`setweight(to_tsvector('english', coalesce(title, '')), 'A') || setweight(to_tsvector('english', coalesce(body, '')), 'B')`,
    ),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("journal_entries_search_idx").using("gin", t.searchVector)],
);

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull().default("#6366f1"),
  archived: boolean("archived").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    notes: text("notes"),
    status: taskStatusEnum("status").notNull().default("todo"),
    priority: taskPriorityEnum("priority").notNull().default("medium"),
    dueDate: date("due_date"),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("tasks_due_date_idx").on(t.dueDate)],
);

export const links = pgTable(
  "links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sourceType: linkSourceTypeEnum("source_type").notNull(),
    sourceId: uuid("source_id").notNull(),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("links_source_person_unique").on(t.sourceType, t.sourceId, t.personId)],
);

export const agentRuns = pgTable("agent_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  workflowId: text("workflow_id").notNull(),
  workflowType: text("workflow_type").notNull(),
  status: agentRunStatusEnum("status").notNull().default("running"),
  input: jsonb("input").$type<Record<string, unknown>>(),
  result: jsonb("result").$type<Record<string, unknown>>(),
  error: text("error"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
});

export const appUsers = pgTable("app_user", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
