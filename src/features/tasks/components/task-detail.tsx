"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Comp_Button } from "@/components/ui/ds/button";
import { Comp_ConfirmDialog } from "@/components/ui/ds/confirmdialog";
import { Comp_PersonPicker, type PickablePerson } from "@/components/ui/ds/personpicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { gql } from "@/lib/gql-client";
import type { PersonWithLabels } from "@/features/people/queries";

// PersonWithLabels -> { id, name, initials } theo Comp_PersonPicker.
function toPickable(p: PersonWithLabels): PickablePerson {
  const initials = p.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return { id: p.id, name: p.fullName, initials };
}

const LINK_PERSON = `
  mutation LinkPerson($sourceType: LinkSourceType!, $sourceId: String!, $personId: String!) {
    linkPerson(sourceType: $sourceType, sourceId: $sourceId, personId: $personId)
  }
`;
const UNLINK_PERSON = `
  mutation UnlinkPerson($sourceType: LinkSourceType!, $sourceId: String!, $personId: String!) {
    unlinkPerson(sourceType: $sourceType, sourceId: $sourceId, personId: $personId)
  }
`;

export function TaskPeopleManager({
  sourceId,
  linkedPeople,
  allPeople,
}: {
  sourceId: string;
  linkedPeople: PersonWithLabels[];
  allPeople: PersonWithLabels[];
}) {
  const t = useTranslations("tasks");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const unlinked = allPeople.filter((p) => !linkedPeople.some((l) => l.id === p.id));
  const q = query.trim().toLowerCase();
  const suggestions = unlinked
    .filter((p) => p.fullName.toLowerCase().includes(q))
    .map(toPickable);

  async function run(mutation: string, personId: string) {
    try {
      await gql(mutation, { sourceType: "task", sourceId, personId });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("unknownError"));
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Comp_PersonPicker
        suggestions={suggestions}
        selected={linkedPeople.map(toPickable)}
        onPick={(p) => {
          setQuery("");
          void run(LINK_PERSON, p.id);
        }}
        onRemove={(p) => void run(UNLINK_PERSON, p.id)}
        query={query}
        onQueryChange={setQuery}
        placeholder={t("addPerson")}
        emptyText={t("searchEmpty")}
      />
      {allPeople.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("peopleEmptyHint")}</p>
      )}
    </div>
  );
}

export function TaskPeopleCard({
  taskId,
  linkedPeople,
  allPeople,
}: {
  taskId: string;
  linkedPeople: PersonWithLabels[];
  allPeople: PersonWithLabels[];
}) {
  const t = useTranslations("tasks");
  return (
    <Card className="rounded-md shadow-[var(--shadow)] ring-border">
      <CardHeader>
        <CardTitle className="text-[length:var(--type-size-sm)] uppercase tracking-wide text-muted-foreground">
          {t("relatedPeople")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TaskPeopleManager sourceId={taskId} linkedPeople={linkedPeople} allPeople={allPeople} />
      </CardContent>
    </Card>
  );
}

export function TaskDeleteButton({ taskId }: { taskId: string }) {
  const t = useTranslations("tasks");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function onDelete() {
    setPending(true);
    try {
      await gql("mutation DeleteTask($id: String!) { deleteTask(id: $id) }", { id: taskId });
      router.push("/tasks");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("unknownError"));
    } finally {
      setPending(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <Comp_Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
        {t("deleteTask")}
      </Comp_Button>
      <Comp_ConfirmDialog
        open={confirmOpen}
        title={t("deleteTask")}
        desc={t("deleteTaskConfirm")}
        confirmLabel={t("deleteTask")}
        cancelLabel={t("cancel")}
        state={pending ? "sending" : "default"}
        onConfirm={onDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
