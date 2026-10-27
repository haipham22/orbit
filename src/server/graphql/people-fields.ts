import { builder } from "./builder";
import { requireContextUser } from "./require-context-user";
import { runService } from "./run-service";
import { getPerson, listLabels, listPeople } from "@/features/people/queries";
import { personRef, labelRef } from "./types/people";

builder.queryField("people", (t) =>
  t.field({
    type: [personRef],
    args: { query: t.arg.string() },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() => listPeople(args.query ?? undefined));
    },
  }),
);

builder.queryField("person", (t) =>
  t.field({
    type: personRef,
    args: { id: t.arg.string({ required: true }) },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() => getPerson(args.id));
    },
  }),
);

builder.queryField("labels", (t) =>
  t.field({
    type: [labelRef],
    resolve: (_root, _args, ctx) => {
      requireContextUser(ctx);
      return runService(() => listLabels());
    },
  }),
);
