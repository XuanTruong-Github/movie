"use client";

import { useEffect, useState } from "react";

export default function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-white/5 bg-background/90 backdrop-blur-md"
          : "lg:border-transparent lg:bg-transparent border-white/5 bg-background/90 backdrop-blur-md"
      }`}
    >
      {children}
    </header>
  );
}
