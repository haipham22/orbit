import { builder } from "./builder";
import { requireContextUser } from "./require-context-user";
import { runService } from "./run-service";
import {
  createProject,
  createTask,
  deleteProject,
  deleteTask,
  getTask,
  listProjects,
  listTasks,
  updateTask,
} from "@/features/tasks/queries";
import { taskRef, projectRef } from "./types/tasks";

const taskStatusEnum = builder.enumType("TaskStatus", {
  values: ["todo", "in_progress", "done"] as const,
});

const taskPriorityEnum = builder.enumType("TaskPriority", {
  values: ["low", "medium", "high", "urgent"] as const,
});

builder.queryField("tasks", (t) =>
  t.field({
    type: [taskRef],
    args: {
      status: t.arg({ type: taskStatusEnum }),
      projectId: t.arg.string(),
    },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() =>
        listTasks({ status: args.status ?? undefined, projectId: args.projectId ?? undefined }),
      );
    },
  }),
);

builder.queryField("task", (t) =>
  t.field({
    type: taskRef,
    args: { id: t.arg.string({ required: true }) },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() => getTask(args.id));
    },
  }),
);

builder.queryField("projects", (t) =>
  t.field({
    type: [projectRef],
    resolve: (_root, _args, ctx) => {
      requireContextUser(ctx);
      return runService(() => listProjects());
    },
  }),
);

builder.mutationField("createTask", (t) =>
  t.field({
    type: taskRef,
    args: {
      title: t.arg.string({ required: true }),
      notes: t.arg.string(),
      status: t.arg({ type: taskStatusEnum }),
      priority: t.arg({ type: taskPriorityEnum }),
      dueDate: t.arg.string(),
      projectId: t.arg.string(),
    },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() =>
        createTask({
          title: args.title,
          notes: args.notes,
          status: args.status ?? undefined,
          priority: args.priority ?? undefined,
          dueDate: args.dueDate,
          projectId: args.projectId,
        }),
      );
    },
  }),
);

builder.mutationField("updateTask", (t) =>
  t.field({
    type: taskRef,
    args: {
      id: t.arg.string({ required: true }),
      title: t.arg.string({ required: true }),
      notes: t.arg.string(),
      status: t.arg({ type: taskStatusEnum }),
      priority: t.arg({ type: taskPriorityEnum }),
      dueDate: t.arg.string(),
      projectId: t.arg.string(),
    },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() =>
        updateTask(args.id, {
          title: args.title,
          notes: args.notes,
          status: args.status ?? undefined,
          priority: args.priority ?? undefined,
          dueDate: args.dueDate,
          projectId: args.projectId,
        }),
      );
    },
  }),
);

builder.mutationField("deleteTask", (t) =>
  t.boolean({
    args: { id: t.arg.string({ required: true }) },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() => deleteTask(args.id));
    },
  }),
);

builder.mutationField("createProject", (t) =>
  t.field({
    type: projectRef,
    args: {
      name: t.arg.string({ required: true }),
      color: t.arg.string(),
    },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() => createProject(args));
    },
  }),
);

builder.mutationField("deleteProject", (t) =>
  t.boolean({
    args: { id: t.arg.string({ required: true }) },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() => deleteProject(args.id));
    },
  }),
);
