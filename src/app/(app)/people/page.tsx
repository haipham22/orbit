import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listLabels, listPeople } from "@/features/people/queries";
import { CreatePersonDialog } from "@/features/people/components/create-person-dialog";
import { LabelsCard } from "@/features/people/components/labels-card";
import { PersonAvatar } from "@/features/people/components/person-avatar";
import { PeopleSearch } from "@/features/people/components/people-search";

export async function generateMetadata() {
  const t = await getTranslations("people.meta");
  return { title: t("listTitle") };
}

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const t = await getTranslations("people");
  const { q } = await searchParams;
  const [people, labels] = await Promise.all([listPeople(q), listLabels()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl">{t("list.title")}</h1>
        <CreatePersonDialog />
      </div>

      {/* Comp_SearchInput — tìm kiếm (GET form, enter để tìm) */}
      <PeopleSearch initialQ={q ?? ""} />

      {/* Comp_PersonRow: avatar → tên → chips → meta */}
      <Card>
        <CardContent className="flex flex-col divide-y px-4">
          {people.map((person) => (
            <div key={person.id} className="flex flex-wrap items-center gap-3 py-3">
              <PersonAvatar name={person.fullName} />
              <Link
                href={`/people/${person.id}`}
                aria-label={person.fullName}
                className="text-lg font-bold underline-offset-4 hover:underline"
              >
                {person.fullName}
              </Link>
              <div className="flex flex-wrap gap-1">
                {person.labels.map((label) => (
                  <Badge
                    key={label.id}
                    variant="outline"
                    style={{ borderColor: label.color, color: label.color }}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
              <span className="ml-auto hidden text-sm text-muted-foreground sm:block">
                {[person.relationship, person.dob].filter(Boolean).join(" · ") || "—"}
              </span>
            </div>
          ))}
          {people.length === 0 && (
            <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              {q ? t("list.noMatch") : t("empty")}
            </p>
          )}
        </CardContent>
      </Card>

      <LabelsCard labels={labels} />
    </div>
  );
}
