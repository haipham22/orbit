import { builder } from "../builder";
import type { LabelRow, PersonWithLabels } from "@/features/people/queries";

const contactMethodRef = builder.objectRef<{ type: string; value: string }>("ContactMethod");
contactMethodRef.implement({
  fields: (t) => ({
    type: t.exposeString("type"),
    value: t.exposeString("value"),
  }),
});

export const labelRef = builder.objectRef<LabelRow>("Label");
labelRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    color: t.exposeString("color"),
  }),
});

export const personRef = builder.objectRef<PersonWithLabels>("Person");
personRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    fullName: t.exposeString("fullName"),
    relationship: t.exposeString("relationship", { nullable: true }),
    dob: t.exposeString("dob", { nullable: true }),
    notes: t.exposeString("notes", { nullable: true }),
    contactMethods: t.field({
      type: [contactMethodRef],
      resolve: (person) => person.contactMethods,
    }),
    labels: t.field({ type: [labelRef], resolve: (person) => person.labels }),
  }),
});
