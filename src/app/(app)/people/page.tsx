import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { listLabels, listPeople } from "@/features/people/queries";
import { CreatePersonDialog } from "@/features/people/components/create-person-dialog";
import { LabelsCard } from "@/features/people/components/labels-card";

export const metadata = { title: "People — orbit" };

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [people, labels] = await Promise.all([listPeople(q), listLabels()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">People</h1>
        <CreatePersonDialog />
      </div>

      <form className="flex max-w-md gap-2">
        <Input name="q" defaultValue={q ?? ""} placeholder="Tìm người theo tên…" />
        <Button type="submit" variant="outline" size="sm">Tìm</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Quan hệ</TableHead>
            <TableHead>Ngày sinh</TableHead>
            <TableHead>Nhãn</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map((person) => (
            <TableRow key={person.id}>
              <TableCell>
                <Link href={`/people/${person.id}`} className="font-medium underline-offset-4 hover:underline">
                  {person.fullName}
                </Link>
              </TableCell>
              <TableCell>{person.relationship ?? "—"}</TableCell>
              <TableCell>{person.dob ?? "—"}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {person.labels.map((label) => (
                    <Badge key={label.id} variant="outline" style={{ borderColor: label.color }}>
                      {label.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {people.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                {q ? "Không tìm thấy ai khớp" : "Chưa có ai — thêm người đầu tiên"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <LabelsCard labels={labels} />
    </div>
  );
}
