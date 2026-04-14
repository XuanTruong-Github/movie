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
      <InputGroup className="h-10">
        <InputGroupInput
          placeholder="Tìm kiếm..."
          name="q"
          defaultValue={q || ""}
          required
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
