import { notFound } from "next/navigation";
import { getPerson, listLabels } from "@/features/people/queries";
import { PersonDetail } from "@/features/people/components/person-detail";

export const metadata = { title: "Người — orbit" };

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getPerson(id).catch(() => null);
  if (!person) notFound();

  const labels = await listLabels();

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
      }}
      allLabels={labels}
    />
  );
}
