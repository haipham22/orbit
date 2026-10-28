"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Comp_Button } from "@/components/ui/ds/button";
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
  const t = useTranslations("people");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(values: PersonFormValues) {
    setPending(true);
    try {
      await gql(CREATE_PERSON, { input: values });
      setOpen(false);
      toast.success(t("create.submitted"));
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("form.errorUnknown"));
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Comp_Button size="lg">
          <Plus className="size-4" /> {t("create.trigger")}
        </Comp_Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>
        <PersonForm onSubmit={onSubmit} submitLabel={t("form.save")} pending={pending} />
      </DialogContent>
    </Dialog>
  );
}
