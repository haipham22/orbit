import { builder } from "./builder";
import { requireContextUser } from "./require-context-user";
import { runService } from "./run-service";
import {
  assignPersonLabel,
  createLabel,
  createPerson,
  deleteLabel,
  deletePerson,
  getPerson,
  unassignPersonLabel,
  updatePerson,
} from "@/features/people/queries";
import { personRef, labelRef } from "./types/people";

const contactMethodInput = builder.inputType("ContactMethodInput", {
  fields: (t) => ({
    type: t.string({ required: true }),
    value: t.string({ required: true }),
  }),
});

const personInput = builder.inputType("PersonInput", {
  fields: (t) => ({
    fullName: t.string({ required: true }),
    relationship: t.string(),
    dob: t.string(),
    notes: t.string(),
    contactMethods: t.field({ type: [contactMethodInput] }),
  }),
});

const labelInput = builder.inputType("LabelInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    color: t.string(),
  }),
});

builder.mutationType({
  fields: (t) => ({
    createPerson: t.field({
      type: personRef,
      args: { input: t.arg({ type: personInput, required: true }) },
      resolve: (_root, args, ctx) => {
        requireContextUser(ctx);
        return runService(() =>
          createPerson({
            fullName: args.input.fullName,
            relationship: args.input.relationship,
            dob: args.input.dob,
            notes: args.input.notes,
            contactMethods: args.input.contactMethods ?? [],
          }),
        );
      },
    }),
    updatePerson: t.field({
      type: personRef,
      args: {
        id: t.arg.string({ required: true }),
        input: t.arg({ type: personInput, required: true }),
      },
      resolve: (_root, args, ctx) => {
        requireContextUser(ctx);
        return runService(() =>
          updatePerson(args.id, {
            fullName: args.input.fullName,
            relationship: args.input.relationship,
            dob: args.input.dob,
            notes: args.input.notes,
            contactMethods: args.input.contactMethods ?? [],
          }),
        );
      },
    }),
    deletePerson: t.boolean({
      args: { id: t.arg.string({ required: true }) },
      resolve: (_root, args, ctx) => {
        requireContextUser(ctx);
        return runService(() => deletePerson(args.id));
      },
    }),
    createLabel: t.field({
      type: labelRef,
      args: { input: t.arg({ type: labelInput, required: true }) },
      resolve: (_root, args, ctx) => {
        requireContextUser(ctx);
        return runService(() => createLabel(args.input));
      },
    }),
    deleteLabel: t.boolean({
      args: { id: t.arg.string({ required: true }) },
      resolve: (_root, args, ctx) => {
        requireContextUser(ctx);
        return runService(() => deleteLabel(args.id));
      },
    }),
    assignPersonLabel: t.field({
      type: personRef,
      args: {
        personId: t.arg.string({ required: true }),
        labelId: t.arg.string({ required: true }),
      },
      resolve: (_root, args, ctx) => {
        requireContextUser(ctx);
        return runService(async () => {
          await assignPersonLabel(args.personId, args.labelId);
          return getPerson(args.personId);
        });
      },
    }),
    unassignPersonLabel: t.field({
      type: personRef,
      args: {
        personId: t.arg.string({ required: true }),
        labelId: t.arg.string({ required: true }),
      },
      resolve: (_root, args, ctx) => {
        requireContextUser(ctx);
        return runService(async () => {
          await unassignPersonLabel(args.personId, args.labelId);
          return getPerson(args.personId);
        });
      },
    }),
  }),
});
