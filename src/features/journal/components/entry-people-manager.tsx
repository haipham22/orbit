"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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

export function EntryPeopleManager({ sourceId, linkedPeople, allPeople }: {
  sourceId: string;
  linkedPeople: PersonRow[];
  allPeople: PersonRow[];
}) {
  const t = useTranslations("journal");
  const router = useRouter();
  const unlinked = allPeople.filter((p) => !linkedPeople.some((l) => l.id === p.id));

  async function run(mutation: string, personId: string) {
    try {
      await gql(mutation, { sourceType: "journal_entry", sourceId, personId });
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
          <button
            type="button"
            aria-label={t("removePerson", { name: person.fullName })}
            onClick={() => run(UNLINK_PERSON, person.id)}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      {unlinked.length > 0 && (
        <Select onValueChange={(id) => run(LINK_PERSON, id)} value="">
          <SelectTrigger size="sm" className="w-44">
            <SelectValue placeholder={t("addPerson")} />
          </SelectTrigger>
          <SelectContent>
            {unlinked.map((person) => (
              <SelectItem key={person.id} value={person.id}>{person.fullName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {allPeople.length === 0 && (
        <p className="text-[length:var(--type-size-sm)] text-muted-foreground">{t("peopleEmptyHint")}</p>
      )}
    </div>
  );
}
