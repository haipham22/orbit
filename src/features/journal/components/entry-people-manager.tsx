"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";
import { gql } from "@/lib/gql-client";
import type { PersonRow } from "@/features/people/queries";

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

export function EntryPeopleManager({
  sourceId,
  linkedPeople,
  allPeople,
}: {
  sourceId: string;
  linkedPeople: PersonRow[];
  allPeople: PersonRow[];
}) {
  const router = useRouter();
  const unlinked = allPeople.filter((p) => !linkedPeople.some((l) => l.id === p.id));

  async function run(mutation: string, personId: string) {
    try {
      await gql(mutation, { sourceType: "journal_entry", sourceId, personId });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {linkedPeople.map((person) => (
        <Badge key={person.id} variant="outline">
          {person.fullName}
          <button
            type="button"
            aria-label={`Gỡ ${person.fullName}`}
            onClick={() => run(UNLINK_PERSON, person.id)}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      {unlinked.length > 0 && (
        <Select onValueChange={(id) => run(LINK_PERSON, id)} value="">
          <SelectTrigger size="sm" className="w-44">
            <SelectValue placeholder="+ Gắn người" />
          </SelectTrigger>
          <SelectContent>
            {unlinked.map((person) => (
              <SelectItem key={person.id} value={person.id}>{person.fullName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {allPeople.length === 0 && (
        <p className="text-sm text-muted-foreground">Thêm người ở trang People trước để gắn vào nhật ký.</p>
      )}
    </div>
  );
}
