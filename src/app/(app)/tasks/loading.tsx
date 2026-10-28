import { Comp_Skeleton } from "@/components/ui/ds/skeleton";

// Board page — grid 3 cột như TaskBoard: mỗi cột line tiêu đề + 2 card.
export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Comp_Skeleton shape="line" width="200px" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((c) => (
          <div key={c} className="flex flex-col gap-2">
            <Comp_Skeleton shape="line" width="96px" />
            <Comp_Skeleton shape="card" />
            <Comp_Skeleton shape="card" />
          </div>
        ))}
      </div>
    </div>
  );
}
