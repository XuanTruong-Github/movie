"use client";
import { SearchIcon } from "@/components/ui/icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSearchParams } from "next/navigation";
import { ComponentProps } from "react";

export default function Search(props: ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  return (
    <form action="/search" {...props}>
      <InputGroup className="h-9 bg-white/5 border-white/10 hover:border-white/20 transition-colors">
        <InputGroupInput
          placeholder="Tìm kiếm phim..."
          name="q"
          defaultValue={q || ""}
          required
          className="text-sm placeholder:text-foreground/40"
        />
        <InputGroupAddon align="inline-end">
          <button type="submit" className="cursor-pointer">
            <SearchIcon className="size-4 text-foreground/50" />
          </button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
