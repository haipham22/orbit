import { Comp_Skeleton } from "@/components/ui/ds/skeleton";

// List page — line rows: header + card search + các hàng icon + title + date.
export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Comp_Skeleton shape="line" width="200px" />
      <div className="rounded-md border border-border bg-card">
        <div className="p-3 pb-1">
          <Comp_Skeleton shape="line" width="100%" />
        </div>
        {[80, 55, 70, 55].map((w, i) => (
          <div key={i} className="flex items-center gap-3 border-t border-border px-2 py-3">
            <span className="flex size-[var(--control-h-sm)] shrink-0 items-center justify-center rounded-full border border-border bg-muted" />
            <Comp_Skeleton shape="line" width={`${w}%`} />
            <div className="ml-auto">
              <Comp_Skeleton shape="line" width="56px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
