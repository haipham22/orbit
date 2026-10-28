"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Comp_Button } from "@/components/ui/ds/button";
import { Comp_ConfirmDialog } from "@/components/ui/ds/confirmdialog";
import { Comp_Chip } from "@/components/ui/ds/chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, ChevronLeft, CircleCheck, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { gql } from "@/lib/gql-client";
import { PersonForm, type PersonFormValues } from "./person-form";
import { PersonAvatar } from "./person-avatar";
import type { LabelRow } from "../queries";

export type PersonDetailData = {
  id: string;
  fullName: string;
  relationship: string | null;
  dob: string | null;
  notes: string | null;
  contactMethods: { type: string; value: string }[];
  labels: LabelRow[];
  links: {
    journalEntries: { id: string; title: string; entryDate: string }[];
    tasks: { id: string; title: string; status: string }[];
  };
};

const UPDATE_PERSON = `
  mutation UpdatePerson($id: String!, $input: PersonInput!) {
    updatePerson(id: $id, input: $input) { id }
  }
`;
const DELETE_PERSON = `
  mutation DeletePerson($id: String!) { deletePerson(id: $id) }
`;
const ASSIGN_LABEL = `
  mutation AssignLabel($personId: String!, $labelId: String!) {
    assignPersonLabel(personId: $personId, labelId: $labelId) { id }
  }
`;
const UNASSIGN_LABEL = `
  mutation UnassignLabel($personId: String!, $labelId: String!) {
    unassignPersonLabel(personId: $personId, labelId: $labelId) { id }
  }
`;

export function PersonDetail({ person, allLabels }: { person: PersonDetailData; allLabels: LabelRow[] }) {
  const t = useTranslations("people");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const unassigned = allLabels.filter((l) => !person.labels.some((p) => p.id === l.id));

  const statusLabels: Record<string, string> = {
    todo: t("detail.statusTodo"),
    in_progress: t("detail.statusInProgress"),
    done: t("detail.statusDone"),
  };

  async function onUpdate(values: PersonFormValues) {
    setPending(true);
    try {
      await gql(UPDATE_PERSON, { id: person.id, input: values });
      setEditOpen(false);
      toast.success(t("detail.updated"));
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("form.errorUnknown"));
    } finally {
      setPending(false);
    }
  }

  async function onDelete() {
    setPending(true);
    try {
      await gql(DELETE_PERSON, { id: person.id });
      toast.success(t("detail.deleted"));
      router.push("/people");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("form.errorUnknown"));
    } finally {
      setPending(false);
      setConfirmOpen(false);
    }
  }

  async function assignLabel(labelId: string) {
    try {
      await gql(ASSIGN_LABEL, { personId: person.id, labelId });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("form.errorUnknown"));
    }
  }

  async function unassignLabel(labelId: string) {
    try {
      await gql(UNASSIGN_LABEL, { personId: person.id, labelId });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("form.errorUnknown"));
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Link
        href="/people"
        className="inline-flex h-9 items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> {t("detail.back")}
      </Link>

      <div className="flex items-center gap-4">
        <PersonAvatar name={person.fullName} size="lg" />
        <div>
          <h1 className="text-2xl">{person.fullName}</h1>
          <p className="text-sm text-muted-foreground">
            {[person.relationship, person.dob].filter(Boolean).join(" · ") || "—"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("detail.labels")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          {person.labels.map((label) => (
            <Comp_Chip key={label.id} color={label.color}>
              {label.name}
              <button
                type="button"
                onClick={() => unassignLabel(label.id)}
                aria-label={t("removeLabel", { name: label.name })}
              >
                <X className="size-3" />
              </button>
            </Comp_Chip>
          ))}
          {unassigned.length > 0 && (
            <Select onValueChange={assignLabel} value="">
              <SelectTrigger className="h-9 w-44">
                <SelectValue placeholder={t("detail.assignLabel")} />
              </SelectTrigger>
              <SelectContent>
                {unassigned.map((label) => (
                  <SelectItem key={label.id} value={label.id}>{label.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {allLabels.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {t("empty")} — <Link href="/people" className="underline">{t("detail.createLabelsHint")}</Link>
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("detail.info")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <div><span className="text-muted-foreground">{t("detail.dob")}:</span> {person.dob ?? "—"}</div>
          <div>
            <span className="text-muted-foreground">{t("detail.contacts")}:</span>
            {person.contactMethods.length === 0 && " —"}
            <ul className="mt-1 list-inside">
              {person.contactMethods.map((c, i) => (
                <li key={i}>{c.type}: {c.value}</li>
              ))}
            </ul>
          </div>
          <div><span className="text-muted-foreground">{t("detail.notes")}:</span> {person.notes ?? "—"}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("detail.related")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          {person.links.journalEntries.map((entry) => (
            <Link
              key={entry.id}
              href={`/journal/${entry.id}`}
              className="flex items-center gap-2 underline-offset-4 hover:underline"
            >
              <BookOpen className="size-4 shrink-0 text-muted-foreground" />
              {entry.title} <span className="text-muted-foreground">({entry.entryDate})</span>
            </Link>
          ))}
          {person.links.tasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="flex items-center gap-2 underline-offset-4 hover:underline"
            >
              <CircleCheck className="size-4 shrink-0 text-muted-foreground" />
              {task.title}{" "}
              <span className="text-muted-foreground">({statusLabels[task.status] ?? task.status})</span>
            </Link>
          ))}
          {person.links.journalEntries.length === 0 && person.links.tasks.length === 0 && (
            <p className="text-muted-foreground">{t("empty")}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("detail.actions")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Comp_Button size="sm" state={pending ? "disabled" : "default"}>
                <Pencil className="size-4" /> {t("detail.edit")}
              </Comp_Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("detail.editTitle")}</DialogTitle>
                <DialogDescription>{person.fullName}</DialogDescription>
              </DialogHeader>
              <PersonForm
                defaultValues={{
                  fullName: person.fullName,
                  relationship: person.relationship ?? "",
                  dob: person.dob ?? "",
                  notes: person.notes ?? "",
                  contactMethods: person.contactMethods,
                }}
                onSubmit={onUpdate}
                submitLabel={t("form.update")}
                pending={pending}
              />
            </DialogContent>
          </Dialog>
          <Comp_Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="size-4" /> {t("detail.delete")}
          </Comp_Button>
        </CardContent>
      </Card>

      <Comp_ConfirmDialog
        open={confirmOpen}
        title={t("detail.confirmDelete", { name: person.fullName })}
        desc={t("detail.deleteDesc")}
        confirmLabel={t("detail.delete")}
        cancelLabel={t("detail.cancel")}
        sendingLabel={t("detail.deleting")}
        state={pending ? "sending" : "default"}
        onConfirm={onDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
