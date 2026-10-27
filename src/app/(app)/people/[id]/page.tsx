import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPerson, listLabels } from "@/features/people/queries";
import { getPersonLinksSummary } from "@/features/links/queries";
import { PersonDetail } from "@/features/people/components/person-detail";

export async function generateMetadata() {
  const t = await getTranslations("people.meta");
  return { title: t("detailTitle") };
}

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getPerson(id).catch(() => null);
  if (!person) notFound();

  const [labels, links] = await Promise.all([listLabels(), getPersonLinksSummary(person.id)]);

  return (
    <PersonDetail
      person={{
        id: person.id,
        fullName: person.fullName,
        relationship: person.relationship,
        dob: person.dob,
        notes: person.notes,
        contactMethods: person.contactMethods,
        labels: person.labels,
        links: { journalEntries: links.journalEntries, tasks: links.tasks },
      }}
      allLabels={labels}
    />
  );
}
