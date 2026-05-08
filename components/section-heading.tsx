import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SectionHeading({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">{title}</h2>
      </div>
      {href ? (
        <Button asChild variant="ghost" size="sm">
          <Link href={href}>Xem thêm</Link>
        </Button>
      ) : null}
    </div>
  );
}
