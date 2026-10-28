import { Comp_Skeleton } from "@/components/ui/ds/skeleton";

// List page — line rows: header + search + card các hàng avatar + tên.
export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Comp_Skeleton shape="line" width="200px" />
        <Comp_Skeleton shape="line" width="120px" />
      </div>
      <Comp_Skeleton shape="line" width="280px" />
      <div className="rounded-md border border-border bg-card">
        {[64, 40, 48, 40, 56].map((w, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 not-last:border-b border-border">
            <Comp_Skeleton shape="avatar" />
            <Comp_Skeleton shape="line" width={`${w}%`} />
          </div>
        ))}
      </div>
    </div>
  );
}
