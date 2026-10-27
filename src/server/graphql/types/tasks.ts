import { builder } from "../builder";
import { personRef } from "./people";
import type { ProjectRow, TaskWithMeta } from "@/features/tasks/queries";

export const projectRef = builder.objectRef<ProjectRow>("Project");
projectRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    color: t.exposeString("color"),
    archived: t.exposeBoolean("archived"),
  }),
});

export const taskRef = builder.objectRef<TaskWithMeta>("Task");
taskRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    notes: t.exposeString("notes", { nullable: true }),
    status: t.exposeString("status"),
    priority: t.exposeString("priority"),
    dueDate: t.exposeString("dueDate", { nullable: true }),
    completedAt: t.field({
      type: "String",
      nullable: true,
      resolve: (task) => task.completedAt?.toISOString() ?? null,
    }),
    project: t.field({ type: projectRef, nullable: true, resolve: (task) => task.project }),
    linkedPeople: t.field({ type: [personRef], resolve: (task) => task.linkedPeople }),
  }),
});
