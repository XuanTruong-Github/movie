import { FilmIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Empty({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-60 flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-center",
        className
      )}
      style={{ borderColor: "rgba(255,255,255,0.1)" }}
    >
      <FilmIcon className="size-10 opacity-30" />
      <div className="flex flex-col gap-1">
        <p className="font-medium">{title}</p>
        {description && (
          <p className="max-w-md text-sm" style={{ color: "#8e8e93" }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
