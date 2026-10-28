"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Comp_PersonPicker, type PickablePerson } from "@/components/ui/ds/personpicker";
import { toast } from "sonner";
import { gql } from "@/lib/gql-client";
import type { PersonRow } from "@/features/people/queries";

// PersonRow -> { id, name, initials } theo Comp_PersonPicker.
function toPickable(p: PersonRow): PickablePerson {
  const initials = p.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return { id: p.id, name: p.fullName, initials };
}

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
  const [query, setQuery] = useState("");
  const unlinked = allPeople.filter((p) => !linkedPeople.some((l) => l.id === p.id));
  const q = query.trim().toLowerCase();
  const suggestions = unlinked
    .filter((p) => p.fullName.toLowerCase().includes(q))
    .map(toPickable);

  async function run(mutation: string, personId: string) {
    try {
      await gql(mutation, { sourceType: "journal_entry", sourceId, personId });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("unknownError"));
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Comp_PersonPicker
        query={query}
        onQueryChange={setQuery}
        suggestions={suggestions}
        selected={linkedPeople.map(toPickable)}
        onPick={(p) => {
          setQuery("");
          void run(LINK_PERSON, p.id);
        }}
        onRemove={(p) => void run(UNLINK_PERSON, p.id)}
        placeholder={t("addPerson")}
        emptyText={t("emptySearch")}
      />
      {allPeople.length === 0 && (
        <p className="text-[length:var(--type-size-sm)] text-muted-foreground">{t("peopleEmptyHint")}</p>
      )}
    </div>
  );
}
