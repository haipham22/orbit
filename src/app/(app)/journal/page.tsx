import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listJournalEntries } from "@/features/journal/queries";
import { CreateEntryDialog } from "@/features/journal/components/create-entry-dialog";

export const metadata = { title: "Journal — orbit" };

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const entries = await listJournalEntries(q);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Journal</h1>
        <CreateEntryDialog />
      </div>

      <form className="flex max-w-md gap-2">
        <Input name="q" defaultValue={q ?? ""} placeholder="Tìm trong nhật ký…" />
        <Button type="submit" variant="outline" size="sm">Tìm</Button>
      </form>

      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={`/journal/${entry.id}`}
            className="rounded-lg border p-4 transition-colors hover:bg-accent"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium">{entry.title}</span>
              <span className="text-xs text-muted-foreground">{entry.entryDate}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{entry.body}</p>
            {entry.linkedPeople.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {entry.linkedPeople.map((person) => (
                  <Badge key={person.id} variant="outline">{person.fullName}</Badge>
                ))}
              </div>
            )}
          </Link>
        ))}
        {entries.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">
            {q ? "Không tìm thấy bài nào khớp" : "Chưa có bài nào — viết bài đầu tiên"}
          </p>
        )}
      </div>
    </div>
  );
}
