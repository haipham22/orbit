"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";
import { gql } from "@/lib/gql-client";
import type { LabelRow } from "../queries";

const CREATE_LABEL = `
  mutation CreateLabel($input: LabelInput!) { createLabel(input: $input) { id } }
`;
const DELETE_LABEL = `
  mutation DeleteLabel($id: String!) { deleteLabel(id: $id) }
`;

export function LabelsCard({ labels }: { labels: LabelRow[] }) {
  const t = useTranslations("people");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  // Schema nằm trong component để message lỗi dịch qua i18n.
  const schema = z.object({ name: z.string().min(1, t("list.labelNameRequired")) });
  type CreateLabelValues = z.infer<typeof schema>;
  const form = useForm<CreateLabelValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  async function onCreate(values: CreateLabelValues) {
    setPending(true);
    try {
      await gql(CREATE_LABEL, { input: { name: values.name.trim() } });
      form.reset();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("form.errorUnknown"));
    } finally {
      setPending(false);
    }
  }

  async function onDelete(id: string) {
    try {
      await gql(DELETE_LABEL, { id });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("form.errorUnknown"));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("list.labels")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <Badge
              key={label.id}
              variant="outline"
              style={{ borderColor: label.color, color: label.color }}
            >
              {label.name}
              <button
                type="button"
                onClick={() => onDelete(label.id)}
                aria-label={t("removeLabel", { name: label.name })}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {labels.length === 0 && (
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
          )}
        </div>
        <form onSubmit={form.handleSubmit(onCreate)} className="flex gap-2">
          <Input
            {...form.register("name")}
            placeholder={t("list.newLabelPlaceholder")}
            aria-label={t("list.newLabelPlaceholder")}
            className="h-9 max-w-48"
          />
          <Button type="submit" className="h-9" disabled={pending}>
            {t("list.addLabel")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
