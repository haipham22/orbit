import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listJournalEntries } from "@/features/journal/queries";
import { CreateEntryDialog } from "@/features/journal/components/create-entry-dialog";

// Comp_Chip (FACET) — sắc mặc định: primary-soft + primary, radius-full, control-h-sm.
const personChip =
  "h-[var(--control-h-sm)] rounded-full border-border bg-muted px-3 text-[length:var(--type-size-sm)] font-medium text-primary";

export async function generateMetadata() {
  const t = await getTranslations("journal");
  return { title: t("metaTitle") };
}

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [entries, t] = await Promise.all([listJournalEntries(q), getTranslations("journal")]);

  return (
    <div className="flex flex-col gap-6">
      {/* Hero: h1 mono (qua CSS) + CTA chính */}
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="mr-auto text-[length:var(--type-size-xl)]">{t("title")}</h1>
        <CreateEntryDialog />
      </div>

      {/* S5: một card chứa search + các row ngăn cách border-top */}
      <Card className="gap-0 rounded-md py-0 shadow-[var(--shadow)] ring-border">
        <form className="p-3 pb-1">
          <Input
            name="q"
            defaultValue={q ?? ""}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchLabel")}
          />
        </form>

        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={`/journal/${entry.id}`}
            className="flex items-center gap-3 border-t border-border px-2 py-3 transition-colors hover:bg-muted"
          >
            <span className="flex size-[var(--control-h-sm)] shrink-0 items-center justify-center rounded-full border border-border bg-muted text-primary">
              <BookOpen className="size-3.5" aria-hidden />
            </span>
            <span className="truncate text-[length:var(--type-size-lg)] font-bold">{entry.title}</span>
            {entry.linkedPeople.length > 0 && (
              <span className="hidden gap-1.5 md:flex">
                {entry.linkedPeople.map((person) => (
                  <Badge key={person.id} variant="outline" className={personChip}>
                    {person.fullName}
                  </Badge>
                ))}
              </span>
            )}
            <span className="ml-auto shrink-0 text-[length:var(--type-size-sm)] text-muted-foreground">
              {entry.entryDate}
            </span>
          </Link>
        ))}

        {entries.length === 0 && (
          <p className="m-3 rounded-md border border-dashed border-border p-6 text-center text-[length:var(--type-size-sm)] text-muted-foreground">
            {q ? t("emptySearch") : t("empty")}
          </p>
        )}
      </Card>
    </div>
  );
}
