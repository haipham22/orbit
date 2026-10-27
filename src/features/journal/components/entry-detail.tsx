"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
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
  const t = useTranslations("journal");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState(false);

  async function onUpdate(values: { title: string; body: string; entryDate: string }) {
    setPending(true);
    try {
      await gql(UPDATE_ENTRY, { id: entry.id, ...values });
      setEditing(false);
      toast.success(t("updated"));
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("unknownError"));
    } finally {
      setPending(false);
    }
  }

  async function onDelete() {
    if (!confirm(t("deleteConfirm"))) return;
    setPending(true);
    try {
      await gql(DELETE_ENTRY, { id: entry.id });
      router.push("/journal");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("unknownError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      {/* S6: backlink nhỏ, muted, mũi tên trái */}
      <Link
        href="/journal"
        className="inline-flex items-center gap-1 self-start px-2 py-1 text-[length:var(--type-size-sm)] text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronLeft className="size-4" aria-hidden />
        {t("backToList")}
      </Link>

      <div className="flex flex-wrap items-start gap-4">
        <div className="mr-auto min-w-0">
          <h1 className="text-[length:var(--type-size-xl)]">{entry.title}</h1>
          <p className="text-[length:var(--type-size-sm)] text-muted-foreground">{entry.entryDate}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-sm" onClick={() => setEditing((v) => !v)}>
            <Pencil className="size-4" /> {editing ? t("close") : t("edit")}
          </Button>
          <Button variant="destructive" size="sm" className="rounded-sm" onClick={onDelete} disabled={pending}>
            <Trash2 className="size-4" /> {t("delete")}
          </Button>
        </div>
      </div>

      {editing && (
        <JournalEntryForm defaultValues={entry} onSubmit={onUpdate} submitLabel={t("update")} pending={pending} />
      )}

      {!editing && <p className="whitespace-pre-wrap text-sm leading-6">{entry.body || "—"}</p>}

      <Card className="rounded-md shadow-[var(--shadow)] ring-border">
        <CardHeader>
          <CardTitle className="text-[length:var(--type-size-sm)] uppercase tracking-wide text-muted-foreground">
            {t("relatedPeople")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EntryPeopleManager sourceId={entry.id} linkedPeople={entry.linkedPeople} allPeople={allPeople} />
        </CardContent>
      </Card>
    </div>
  );
}
