"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { gql } from "@/lib/gql-client";
import { JournalEntryForm } from "./journal-entry-form";
import { EntryPeopleManager } from "./entry-people-manager";
import type { PersonRow } from "@/features/people/queries";

export type EntryDetailData = {
  id: string;
  title: string;
  body: string;
  entryDate: string;
  linkedPeople: PersonRow[];
};

const UPDATE_ENTRY = `
  mutation UpdateEntry($id: String!, $title: String!, $body: String, $entryDate: String!) {
    updateJournalEntry(id: $id, title: $title, body: $body, entryDate: $entryDate) { id }
  }
`;
const DELETE_ENTRY = `
  mutation DeleteEntry($id: String!) { deleteJournalEntry(id: $id) }
`;

export function EntryDetail({
  entry,
  allPeople,
}: {
  entry: EntryDetailData;
  allPeople: PersonRow[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState(false);

  async function onUpdate(values: { title: string; body: string; entryDate: string }) {
    setPending(true);
    try {
      await gql(UPDATE_ENTRY, { id: entry.id, ...values });
      setEditing(false);
      toast.success("Đã cập nhật");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setPending(false);
    }
  }

  async function onDelete() {
    if (!confirm("Xoá bài nhật ký này?")) return;
    setPending(true);
    try {
      await gql(DELETE_ENTRY, { id: entry.id });
      router.push("/journal");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{entry.title}</h1>
          <p className="text-sm text-muted-foreground">{entry.entryDate}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
            <Pencil className="size-4" /> {editing ? "Đóng" : "Sửa"}
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete} disabled={pending}>
            <Trash2 className="size-4" /> Xoá
          </Button>
        </div>
      </div>

      {editing && <JournalEntryForm defaultValues={entry} onSubmit={onUpdate} submitLabel="Cập nhật" pending={pending} />}

      {!editing && <p className="whitespace-pre-wrap text-sm leading-6">{entry.body || "—"}</p>}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Người liên quan</CardTitle>
        </CardHeader>
        <CardContent>
          <EntryPeopleManager sourceId={entry.id} linkedPeople={entry.linkedPeople} allPeople={allPeople} />
        </CardContent>
      </Card>
    </div>
  );
}
