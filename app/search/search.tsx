"use client";
import { SearchIcon } from "@/components/ui/icons";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useSearchParams } from "next/navigation";
import { ComponentProps } from "react";

export default function Search(props: ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  return (
    <form action="/search" {...props}>
      <InputGroup className="h-9 border-white/10 bg-white/5 transition-colors hover:border-white/20">
        <InputGroupInput
          placeholder="Tìm kiếm phim..."
          name="q"
          defaultValue={q || ""}
          required
          className="placeholder:text-foreground/40 text-sm"
        />
        <InputGroupAddon align="inline-end">
          <button type="submit" className="cursor-pointer">
            <SearchIcon className="text-foreground/50 size-4" />
          </button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
