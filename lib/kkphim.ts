import "server-only";
import { cache } from "react";
import type {
  MovieSummary,
  MovieDetail,
  EpisodeItem,
  EpisodeServer,
  Pagination,
  MovieListResult,
  MovieDetailResult,
  TaxonomyItem,
} from "./types";

export const KKPHIM_BASE_URL = "https://phimapi.com";
const IMAGE_BASE_URL = "https://phimimg.com";

export function imageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${IMAGE_BASE_URL}/${path.replace(/^\//, "")}`;
}

// ── helpers ────────────────────────────────────────────────────────────────

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v ? v : undefined;
}

function asNumber(v: unknown): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

async function fetchJson<T>(url: string, revalidate: number | false): Promise<T> {
  const res = await fetch(url, {
    next: revalidate === false ? { revalidate: 0 } : { revalidate },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`KKPhim fetch failed: ${res.status} ${url}`);
  return res.json() as Promise<T>;
}

// ── normalizers ───────────────────────────────────────────────────────────

function normalizeTaxonomy(arr: unknown[]): TaxonomyItem[] {
  return arr.map((item) => {
    const r = asRecord(item);
    return {
      id: asString(r.id),
      name: asString(r.name) ?? "",
      slug: asString(r.slug) ?? "",
    };
  });
}

function normalizeMovie(raw: unknown): MovieSummary {
  const r = asRecord(raw);
  return {
    id: asString(r._id ?? r.id),
    name: asString(r.name) ?? "",
    slug: asString(r.slug) ?? "",
    originName: asString(r.origin_name),
    posterUrl: imageUrl(asString(r.poster_url)),
    thumbUrl: imageUrl(asString(r.thumb_url)),
    year: asNumber(r.year),
    type: asString(r.type),
    time: asString(r.time),
    episodeCurrent: asString(r.episode_current),
    quality: asString(r.quality),
    lang: asString(r.lang),
    categories: normalizeTaxonomy(asArray(r.category)),
    countries: normalizeTaxonomy(asArray(r.country)),
  };
}

function normalizeMovieDetail(raw: unknown): MovieDetail {
  const r = asRecord(raw);
  return {
    ...normalizeMovie(raw),
    content: asString(r.content),
    status: asString(r.status),
    episodeTotal: asString(r.episode_total),
  };
}

function normalizeEpisode(raw: unknown): EpisodeItem {
  const r = asRecord(raw);
  return {
    name: asString(r.name) ?? "",
    slug: asString(r.slug) ?? "",
    filename: asString(r.filename),
    linkEmbed: asString(r.link_embed),
    linkM3u8: asString(r.link_m3u8),
  };
}

function normalizeServer(raw: unknown): EpisodeServer {
  const r = asRecord(raw);
  return {
    serverName: asString(r.server_name) ?? "Server",
    serverData: asArray(r.server_data).map(normalizeEpisode),
  };
}

function normalizePagination(raw: unknown): Pagination {
  const r = asRecord(raw);
  return {
    totalItems: asNumber(r.totalItems) ?? 0,
    totalItemsPerPage: asNumber(r.totalItemsPerPage) ?? 24,
    currentPage: asNumber(r.currentPage) ?? 1,
    totalPages: asNumber(r.totalPages) ?? 1,
  };
}

function listFromPayload(payload: unknown, title: string): MovieListResult {
  const p = asRecord(payload);

  // Shape 1: root-level items (danh-sach/phim-moi-cap-nhat)
  if (Array.isArray(p.items)) {
    return {
      title,
      items: asArray(p.items).map(normalizeMovie),
      pagination: normalizePagination(p.pagination),
    };
  }

  // Shape 2: data.items (v1/api/...)
  const data = asRecord(p.data);
  return {
    title: asString(data.titlePage) ?? title,
    items: asArray(data.items).map(normalizeMovie),
    pagination: normalizePagination(data.params ? asRecord(asRecord(data.params).pagination) : data.pagination),
  };
}

// ── API functions ─────────────────────────────────────────────────────────

export async function getLatestMovies(page = 1): Promise<MovieListResult> {
  const url = `${KKPHIM_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`;
  const data = await fetchJson<unknown>(url, 180);
  return listFromPayload(data, "Phim Mới Cập Nhật");
}

export async function getMoviesByType(type: string, page = 1): Promise<MovieListResult> {
  const url = `${KKPHIM_BASE_URL}/v1/api/danh-sach/${type}?page=${page}`;
  const data = await fetchJson<unknown>(url, 300);
  return listFromPayload(data, type);
}

export const getMovieDetail = cache(async (slug: string): Promise<MovieDetailResult> => {
  const url = `${KKPHIM_BASE_URL}/phim/${slug}`;
  const data = await fetchJson<unknown>(url, 600);
  const p = asRecord(data);
  return {
    movie: normalizeMovieDetail(p.movie),
    episodes: asArray(p.episodes).map(normalizeServer),
  };
});

export async function searchMovies(keyword: string, page = 1): Promise<MovieListResult> {
  const params = new URLSearchParams({ keyword, page: String(page) });
  const url = `${KKPHIM_BASE_URL}/v1/api/tim-kiem?${params}`;
  const data = await fetchJson<unknown>(url, false);
  return listFromPayload(data, `Tìm kiếm: "${keyword}"`);
}

export async function getCategories(): Promise<TaxonomyItem[]> {
  const url = `${KKPHIM_BASE_URL}/the-loai`;
  const data = await fetchJson<unknown>(url, 3600);
  return asArray(data).map((item) => {
    const r = asRecord(item);
    return {
      id: asString(r._id ?? r.id),
      name: asString(r.name) ?? "",
      slug: asString(r.slug) ?? "",
    };
  });
}

export async function getMoviesByCategory(slug: string, page = 1): Promise<MovieListResult> {
  const url = `${KKPHIM_BASE_URL}/v1/api/the-loai/${slug}?page=${page}`;
  const data = await fetchJson<unknown>(url, 300);
  return listFromPayload(data, slug);
}

export async function getCountries(): Promise<TaxonomyItem[]> {
  const url = `${KKPHIM_BASE_URL}/quoc-gia`;
  const data = await fetchJson<unknown>(url, 3600);
  return asArray(data).map((item) => {
    const r = asRecord(item);
    return {
      id: asString(r._id ?? r.id),
      name: asString(r.name) ?? "",
      slug: asString(r.slug) ?? "",
    };
  });
}

export async function getMoviesByCountry(slug: string, page = 1): Promise<MovieListResult> {
  const url = `${KKPHIM_BASE_URL}/v1/api/quoc-gia/${slug}?page=${page}`;
  const data = await fetchJson<unknown>(url, 300);
  return listFromPayload(data, slug);
}
