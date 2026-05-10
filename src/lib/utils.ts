import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IMAGE_BASE } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildImageUrl(path: string): string {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE}/${path}`;
}

export function formatEpisodeName(name: string): string {
  if (!name) return "";
  const num = parseInt(name);
  if (!isNaN(num)) return `Tập ${num}`;
  return name;
}

