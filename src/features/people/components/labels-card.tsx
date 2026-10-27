"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";
import { gql } from "@/lib/gql-client";
import type { LabelRow } from "../queries";

const createLabelSchema = z.object({ name: z.string().min(1, "Nhập tên nhãn") });
type CreateLabelValues = z.infer<typeof createLabelSchema>;

const CREATE_LABEL = `
  mutation CreateLabel($input: LabelInput!) { createLabel(input: $input) { id } }
`;
const DELETE_LABEL = `
  mutation DeleteLabel($id: String!) { deleteLabel(id: $id) }
`;

export function LabelsCard({ labels }: { labels: LabelRow[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const form = useForm<CreateLabelValues>({
    resolver: zodResolver(createLabelSchema),
    defaultValues: { name: "" },
  });

  async function onCreate(values: CreateLabelValues) {
    setPending(true);
    try {
      await gql(CREATE_LABEL, { input: { name: values.name.trim() } });
      form.reset();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setPending(false);
    }
  }

  async function onDelete(id: string) {
    try {
      await gql(DELETE_LABEL, { id });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Nhãn</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <Badge key={label.id} variant="outline" style={{ borderColor: label.color }}>
              {label.name}
              <button type="button" onClick={() => onDelete(label.id)} aria-label={`Xoá nhãn ${label.name}`}>
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {labels.length === 0 && <p className="text-sm text-muted-foreground">Chưa có nhãn nào</p>}
        </div>
        <form onSubmit={form.handleSubmit(onCreate)} className="flex gap-2">
          <Input {...form.register("name")} placeholder="Tên nhãn mới…" className="max-w-48" />
          <Button type="submit" size="sm" disabled={pending}>Thêm</Button>
        </form>
      </CardContent>
    </Card>
  );
}
