import { notFound } from "next/navigation";
import { getJournalEntry } from "@/features/journal/queries";
import { listPeople } from "@/features/people/queries";
import { EntryDetail } from "@/features/journal/components/entry-detail";

export const metadata = { title: "Nhật ký — orbit" };

export default async function JournalEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getJournalEntry(id).catch(() => null);
  if (!entry) notFound();

  const people = await listPeople();

  return (
    <EntryDetail
      entry={{
        id: entry.id,
        title: entry.title,
        body: entry.body,
        entryDate: entry.entryDate,
        linkedPeople: entry.linkedPeople,
      }}
      allPeople={people}
    />
  );
}
