import { FilmIcon, MenuIcon } from "lucide-react";
import Link from "next/link";

import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { movieTypes } from "@/lib/kkphim";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <FilmIcon className="size-5" />
          </span>
          <span>TruongLX Movie</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {movieTypes.slice(0, 4).map((type) => (
            <Button key={type.slug} asChild variant="ghost" size="sm">
              <Link href={`/danh-sach/${type.slug}`}>{type.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="ml-auto hidden max-w-md flex-1 md:flex">
          <SearchForm compact />
        </div>
        <Button className="ml-auto md:hidden" variant="ghost" size="icon" aria-label="Mở menu">
          <MenuIcon />
        </Button>
      </div>
    </header>
  );
}
