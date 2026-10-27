import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db/client";
import { links, journalEntries, people, tasks } from "@/server/db/schema";
import { ServiceError } from "@/server/service-error";
import { ERROR_CODES } from "@/server/error-codes";
import { parseUuid } from "@/features/people/queries";

export const linkSourceSchema = z.enum(["journal_entry", "task"]);
export type LinkSourceType = z.infer<typeof linkSourceSchema>;

export type LinkSourceRef = { sourceType: LinkSourceType; sourceId: string };

export async function linkPerson(
  sourceType: LinkSourceType,
  sourceId: string,
  personId: string,
): Promise<boolean> {
  const pid = parseUuid(personId);
  const sid = parseUuid(sourceId);

  const [person] = await db.select({ id: people.id }).from(people).where(eq(people.id, pid)).limit(1);
  if (!person) throw new ServiceError(ERROR_CODES.NOT_FOUND, "Person not found");

  const table = sourceType === "journal_entry" ? journalEntries : tasks;
  const [source] = await db.select({ id: table.id }).from(table).where(eq(table.id, sid)).limit(1);
  if (!source) throw new ServiceError(ERROR_CODES.NOT_FOUND, "Source not found");

  await db.insert(links).values({ sourceType, sourceId: sid, personId: pid }).onConflictDoNothing();
  return true;
}

export async function unlinkPerson(
  sourceType: LinkSourceType,
  sourceId: string,
  personId: string,
): Promise<boolean> {
  const rows = await db
    .delete(links)
    .where(
      and(
        eq(links.sourceType, sourceType),
        eq(links.sourceId, parseUuid(sourceId)),
        eq(links.personId, parseUuid(personId)),
      ),
    )
    .returning({ id: links.id });
  return rows.length > 0;
}

export async function listLinksForPerson(personId: string): Promise<LinkSourceRef[]> {
  const rows = await db
    .select({ sourceType: links.sourceType, sourceId: links.sourceId })
    .from(links)
    .where(eq(links.personId, parseUuid(personId)));
  return rows;
}

export type PersonLinksSummary = {
  journalEntries: { id: string; title: string; entryDate: string }[];
  tasks: { id: string; title: string; status: string }[];
};

export async function getPersonLinksSummary(personId: string): Promise<PersonLinksSummary> {
  const linkRows = await listLinksForPerson(personId);
  const entryIds = linkRows.filter((r) => r.sourceType === "journal_entry").map((r) => r.sourceId);
  const taskIds = linkRows.filter((r) => r.sourceType === "task").map((r) => r.sourceId);

  const entryRows = entryIds.length
    ? await db
        .select({ id: journalEntries.id, title: journalEntries.title, entryDate: journalEntries.entryDate })
        .from(journalEntries)
        .where(inArray(journalEntries.id, entryIds))
    : [];

  const taskRows = taskIds.length
    ? await db
        .select({ id: tasks.id, title: tasks.title, status: tasks.status })
        .from(tasks)
        .where(inArray(tasks.id, taskIds))
    : [];

  return { journalEntries: entryRows, tasks: taskRows };
}
