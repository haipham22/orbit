import { Comp_Skeleton } from "@/components/ui/ds/skeleton";

// Settings — khớp trang: max-w-2xl, header + các Card xếp dọc.
export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Comp_Skeleton shape="line" width="140px" />
        <Comp_Skeleton shape="line" width="260px" />
      </div>
      <Comp_Skeleton shape="card" />
      <Comp_Skeleton shape="card" />
    </div>
  );
}
