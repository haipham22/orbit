"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { toast } from "sonner";
import { gql } from "@/lib/gql-client";
import type { PersonWithLabels } from "@/features/people/queries";

// Comp_Chip (FACET): primary-soft + primary, radius-full, control-h-sm.
const personChip =
  "h-[var(--control-h-sm)] rounded-full border-border bg-muted px-3 text-[length:var(--type-size-sm)] font-medium text-primary";

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
  const unlinked = allPeople.filter((p) => !linkedPeople.some((l) => l.id === p.id));

  async function run(mutation: string, personId: string) {
    try {
      await gql(mutation, { sourceType: "task", sourceId, personId });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("unknownError"));
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {linkedPeople.map((person) => (
        <Badge key={person.id} variant="outline" className={personChip}>
          {person.fullName}
          <button type="button" aria-label={t("removePerson", { name: person.fullName })} onClick={() => run(UNLINK_PERSON, person.id)}>
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      {unlinked.length > 0 && (
        <select
          className="h-[var(--control-h-md)] rounded-sm border border-border bg-background px-3 text-[length:var(--type-size-sm)]"
          value=""
          onChange={(e) => e.target.value && run(LINK_PERSON, e.target.value)}
        >
          <option value="">{t("addPerson")}</option>
          {unlinked.map((person) => (
            <option key={person.id} value={person.id}>{person.fullName}</option>
          ))}
        </select>
      )}
      {allPeople.length === 0 && (
        <p className="text-sm text-muted-foreground">Thêm người ở trang People trước để gắn vào việc.</p>
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

  async function onDelete() {
    if (!confirm(t("deleteTaskConfirm"))) return;
    try {
      await gql("mutation DeleteTask($id: String!) { deleteTask(id: $id) }", { id: taskId });
      router.push("/tasks");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("unknownError"));
    }
  }

  return (
    <Button variant="destructive" size="sm" className="rounded-sm" onClick={onDelete}>
      {t("deleteTask")}
    </Button>
  );
}
