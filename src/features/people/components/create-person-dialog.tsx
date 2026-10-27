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
import { PersonForm, type PersonFormValues } from "./person-form";

const CREATE_PERSON = `
  mutation CreatePerson($input: PersonInput!) {
    createPerson(input: $input) { id }
  }
`;

export function CreatePersonDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(values: PersonFormValues) {
    setPending(true);
    try {
      await gql(CREATE_PERSON, { input: values });
      setOpen(false);
      toast.success("Đã thêm người");
      router.refresh();
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
          <Plus className="size-4" /> Thêm người
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm người</DialogTitle>
          <DialogDescription>Ghi lại thông tin một người quen.</DialogDescription>
        </DialogHeader>
        <PersonForm onSubmit={onSubmit} submitLabel="Lưu" pending={pending} />
      </DialogContent>
    </Dialog>
  );
}
