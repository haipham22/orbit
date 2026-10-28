import { Comp_Skeleton } from "@/components/ui/ds/skeleton";

// Comp_Skeleton shape card — khớp grid 2 cột của dashboard (4 card).
export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Comp_Skeleton shape="line" width="220px" />
        <Comp_Skeleton shape="line" width="150px" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Comp_Skeleton shape="card" />
        <Comp_Skeleton shape="card" />
        <Comp_Skeleton shape="card" />
        <Comp_Skeleton shape="card" />
      </div>
    </div>
  );
}
