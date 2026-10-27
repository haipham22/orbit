import { builder } from "../builder";
import { personRef } from "./people";
import type { JournalEntryWithPeople } from "@/features/journal/queries";

export const journalEntryRef = builder.objectRef<JournalEntryWithPeople>("JournalEntry");
journalEntryRef.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    body: t.exposeString("body"),
    entryDate: t.exposeString("entryDate"),
    linkedPeople: t.field({ type: [personRef], resolve: (entry) => entry.linkedPeople }),
  }),
});
