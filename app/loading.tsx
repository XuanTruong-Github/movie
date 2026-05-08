import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container grid grid-cols-2 gap-4 py-8 sm:grid-cols-3 lg:grid-cols-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <Skeleton key={index} className="aspect-[2/3]" />
      ))}
    </div>
  );
}
