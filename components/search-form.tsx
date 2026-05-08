"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchForm({ defaultValue = "", compact = false }: { defaultValue?: string; compact?: boolean }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(defaultValue);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = keyword.trim();
    if (!value) return;
    router.push(`/tim-kiem?keyword=${encodeURIComponent(value)}`);
  }

  return (
    <form className={compact ? "flex min-w-0 flex-1 gap-2" : "mx-auto flex w-full max-w-2xl gap-2"} onSubmit={onSubmit}>
      <Input
        aria-label="Tìm kiếm phim"
        placeholder="Tìm phim, diễn viên, anime..."
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />
      <Button type="submit" size={compact ? "icon" : "default"} aria-label="Tìm kiếm">
        <SearchIcon data-icon="inline-start" />
        {compact ? null : "Tìm kiếm"}
      </Button>
    </form>
  );
}
