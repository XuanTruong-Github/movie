"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">Có lỗi khi tải dữ liệu</h1>
      <p className="max-w-md text-muted-foreground">Nguồn API có thể đang chậm hoặc tạm thời không phản hồi.</p>
      <Button onClick={reset}>Thử lại</Button>
    </div>
  );
}
