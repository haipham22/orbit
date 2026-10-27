"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { gql } from "@/lib/gql-client";
import { JournalEntryForm } from "./journal-entry-form";

const CREATE_ENTRY = `
  mutation CreateEntry($title: String!, $body: String, $entryDate: String!) {
    createJournalEntry(title: $title, body: $body, entryDate: $entryDate) { id }
  }
`;

export function CreateEntryDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(values: { title: string; body: string; entryDate: string }) {
    setPending(true);
    try {
      const data = await gql<{ createJournalEntry: { id: string } }>(CREATE_ENTRY, values);
      setOpen(false);
      router.push(`/journal/${data.createJournalEntry.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" /> Viết nhật ký
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Viết nhật ký</DialogTitle>
          <DialogDescription>Ghi lại điều đáng nhớ.</DialogDescription>
        </DialogHeader>
        <JournalEntryForm onSubmit={onSubmit} submitLabel="Lưu" pending={pending} />
      </DialogContent>
    </Dialog>
  );
}
