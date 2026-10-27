"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { X, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { gql } from "@/lib/gql-client";
import { PersonForm, type PersonFormValues } from "./person-form";
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

const STATUS_LABELS: Record<string, string> = {
  todo: "Chưa làm",
  in_progress: "Đang làm",
  done: "Xong",
};

export function PersonDetail({ person, allLabels }: { person: PersonDetailData; allLabels: LabelRow[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const unassigned = allLabels.filter((l) => !person.labels.some((p) => p.id === l.id));

  async function onUpdate(values: PersonFormValues) {
    setPending(true);
    try {
      await gql(UPDATE_PERSON, { id: person.id, input: values });
      setEditOpen(false);
      toast.success("Đã cập nhật");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setPending(false);
    }
  }

  async function onDelete() {
    if (!confirm(`Xoá ${person.fullName}?`)) return;
    setPending(true);
    try {
      await gql(DELETE_PERSON, { id: person.id });
      toast.success("Đã xoá");
      router.push("/people");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setPending(false);
    }
  }

  async function assignLabel(labelId: string) {
    try {
      await gql(ASSIGN_LABEL, { personId: person.id, labelId });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    }
  }

  async function unassignLabel(labelId: string) {
    try {
      await gql(UNASSIGN_LABEL, { personId: person.id, labelId });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{person.fullName}</h1>
          <p className="text-sm text-muted-foreground">{person.relationship ?? "—"}</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="size-4" /> Sửa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Sửa người</DialogTitle>
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
                submitLabel="Cập nhật"
                pending={pending}
              />
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={onDelete} disabled={pending}>
            <Trash2 className="size-4" /> Xoá
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Thông tin</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <div><span className="text-muted-foreground">Ngày sinh:</span> {person.dob ?? "—"}</div>
          <div>
            <span className="text-muted-foreground">Liên lạc:</span>
            {person.contactMethods.length === 0 && " —"}
            <ul className="mt-1 list-inside">
              {person.contactMethods.map((c, i) => (
                <li key={i}>{c.type}: {c.value}</li>
              ))}
            </ul>
          </div>
          <div><span className="text-muted-foreground">Ghi chú:</span> {person.notes ?? "—"}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Liên quan</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          {person.links.journalEntries.map((entry) => (
            <Link key={entry.id} href={`/journal/${entry.id}`} className="underline-offset-4 hover:underline">
              📔 {entry.title} <span className="text-muted-foreground">({entry.entryDate})</span>
            </Link>
          ))}
          {person.links.tasks.map((task) => (
            <Link key={task.id} href={`/tasks/${task.id}`} className="underline-offset-4 hover:underline">
              ✅ {task.title} <span className="text-muted-foreground">({STATUS_LABELS[task.status] ?? task.status})</span>
            </Link>
          ))}
          {person.links.journalEntries.length === 0 && person.links.tasks.length === 0 && (
            <p className="text-muted-foreground">Chưa có gì gắn với người này.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nhãn</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          {person.labels.map((label) => (
            <Badge key={label.id} variant="outline" style={{ borderColor: label.color }}>
              {label.name}
              <button type="button" onClick={() => unassignLabel(label.id)} aria-label={`Gỡ nhãn ${label.name}`}>
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {unassigned.length > 0 && (
            <Select onValueChange={assignLabel} value="">
              <SelectTrigger size="sm" className="w-40">
                <SelectValue placeholder="+ Gắn nhãn" />
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
              Chưa có nhãn nào — <Link href="/people" className="underline">tạo nhãn ở trang People</Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
