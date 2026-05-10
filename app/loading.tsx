import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6">
      <Skeleton className="mb-6 h-8 w-48 rounded-lg" style={{ background: "#1c1c1e" }} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 lg:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton
              className="aspect-[2/3] w-full rounded-xl"
              style={{ background: "#1c1c1e" }}
            />
            <Skeleton className="h-4 w-full rounded" style={{ background: "#1c1c1e" }} />
            <Skeleton className="h-3 w-3/4 rounded" style={{ background: "#1c1c1e" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
