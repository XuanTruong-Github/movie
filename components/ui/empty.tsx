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
    <div className={cn("flex min-h-60 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-8 text-center", className)}>
      <FilmIcon className="size-10 text-muted-foreground" />
      <div className="flex flex-col gap-1">
        <p className="font-medium">{title}</p>
        {description ? <p className="max-w-md text-sm text-muted-foreground">{description}</p> : null}
      </div>
    </div>
  );
}
