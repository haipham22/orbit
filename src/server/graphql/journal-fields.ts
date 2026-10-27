import { builder } from "./builder";
import { requireContextUser } from "./require-context-user";
import { runService } from "./run-service";
import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntry,
  listJournalEntries,
  updateJournalEntry,
} from "@/features/journal/queries";
import { linkPerson, unlinkPerson, linkSourceSchema } from "@/features/links/queries";
import { journalEntryRef } from "./types/journal";

const linkSourceType = builder.enumType("LinkSourceType", {
  values: linkSourceSchema.options,
});

builder.queryField("journalEntries", (t) =>
  t.field({
    type: [journalEntryRef],
    args: { query: t.arg.string() },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() => listJournalEntries(args.query ?? undefined));
    },
  }),
);

builder.queryField("journalEntry", (t) =>
  t.field({
    type: journalEntryRef,
    args: { id: t.arg.string({ required: true }) },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() => getJournalEntry(args.id));
    },
  }),
);

builder.mutationField("createJournalEntry", (t) =>
  t.field({
    type: journalEntryRef,
    args: {
      title: t.arg.string({ required: true }),
      body: t.arg.string(),
      entryDate: t.arg.string({ required: true }),
    },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() =>
        createJournalEntry({ title: args.title, body: args.body ?? "", entryDate: args.entryDate }),
      );
    },
  }),
);

builder.mutationField("updateJournalEntry", (t) =>
  t.field({
    type: journalEntryRef,
    args: {
      id: t.arg.string({ required: true }),
      title: t.arg.string({ required: true }),
      body: t.arg.string(),
      entryDate: t.arg.string({ required: true }),
    },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() =>
        updateJournalEntry(args.id, {
          title: args.title,
          body: args.body ?? "",
          entryDate: args.entryDate,
        }),
      );
    },
  }),
);

builder.mutationField("deleteJournalEntry", (t) =>
  t.boolean({
    args: { id: t.arg.string({ required: true }) },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() => deleteJournalEntry(args.id));
    },
  }),
);

builder.mutationField("linkPerson", (t) =>
  t.boolean({
    args: {
      sourceType: t.arg({ type: linkSourceType, required: true }),
      sourceId: t.arg.string({ required: true }),
      personId: t.arg.string({ required: true }),
    },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() => linkPerson(args.sourceType, args.sourceId, args.personId));
    },
  }),
);

builder.mutationField("unlinkPerson", (t) =>
  t.boolean({
    args: {
      sourceType: t.arg({ type: linkSourceType, required: true }),
      sourceId: t.arg.string({ required: true }),
      personId: t.arg.string({ required: true }),
    },
    resolve: (_root, args, ctx) => {
      requireContextUser(ctx);
      return runService(() => unlinkPerson(args.sourceType, args.sourceId, args.personId));
    },
  }),
);
