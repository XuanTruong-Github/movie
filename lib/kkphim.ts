import "server-only";
import { cache } from "react";

import type {
  EpisodeItem,
  EpisodeServer,
  MovieDetail,
  MovieDetailResult,
  MovieListResult,
  MovieSummary,
  Pagination,
  TaxonomyItem,
} from "@/lib/types";

export const KKPHIM_BASE_URL = "https://phimapi.com";
export const IMAGE_BASE_URL = "https://phimimg.com";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function asString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown) {
  return typeof value === "number" ? value : undefined;
}

export function imageUrl(value?: string) {
  if (!value) return undefined;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${IMAGE_BASE_URL}${path}`;
}

function normalizeTaxonomy(value: unknown): TaxonomyItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = asRecord(item);
      const name = asString(record.name);
      const slug = asString(record.slug);
      if (!name || !slug) return null;
      return { id: asString(record.id), name, slug };
    })
    .filter(Boolean) as TaxonomyItem[];
}

function normalizeMovieSummary(value: unknown): MovieSummary {
  const record = asRecord(value);
  return {
    id: asString(record._id),
    name: asString(record.name) ?? "Không rõ tên phim",
    slug: asString(record.slug) ?? "",
    originName: asString(record.origin_name),
    posterUrl: imageUrl(asString(record.poster_url)),
    thumbUrl: imageUrl(asString(record.thumb_url)),
    year: asNumber(record.year),
    type: asString(record.type),
    time: asString(record.time),
    episodeCurrent: asString(record.episode_current),
    quality: asString(record.quality),
    lang: asString(record.lang),
    categories: normalizeTaxonomy(record.category),
    countries: normalizeTaxonomy(record.country),
  };
}

function normalizeMovieDetail(value: unknown): MovieDetail {
  const record = asRecord(value);
  return {
    ...normalizeMovieSummary(value),
    content: asString(record.content),
    status: asString(record.status),
    episodeTotal: asString(record.episode_total),
  };
}

function normalizePagination(value: unknown, page: number, itemCount: number): Pagination {
  const record = asRecord(value);
  const totalItems = asNumber(record.totalItems) ?? itemCount;
  const totalItemsPerPage = asNumber(record.totalItemsPerPage) ?? Math.max(itemCount, 1);
  const currentPage = asNumber(record.currentPage) ?? page;
  const totalPages = asNumber(record.totalPages) ?? Math.max(1, Math.ceil(totalItems / totalItemsPerPage));
  return { totalItems, totalItemsPerPage, currentPage, totalPages };
}

function normalizeEpisode(value: unknown): EpisodeItem {
  const record = asRecord(value);
  return {
    name: asString(record.name) ?? "Tập phim",
    slug: asString(record.slug) ?? "",
    filename: asString(record.filename),
    linkEmbed: asString(record.link_embed),
    linkM3u8: asString(record.link_m3u8),
  };
}

function normalizeEpisodeServer(value: unknown): EpisodeServer {
  const record = asRecord(value);
  return {
    serverName: asString(record.server_name) ?? "Server",
    serverData: Array.isArray(record.server_data) ? record.server_data.map(normalizeEpisode) : [],
  };
}

async function fetchJson(path: string, revalidate: number | false = 300) {
  const cacheOption: RequestInit =
    revalidate === false
      ? { cache: "no-store" }
      : ({ next: { revalidate } } as RequestInit);

  const response = await fetch(`${KKPHIM_BASE_URL}${path}`, {
    ...cacheOption,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`KKPhim API failed ${response.status} for ${path}`);
  }

  return response.json() as Promise<unknown>;
}

function listFromPayload(payload: unknown, page: number, fallbackTitle: string): MovieListResult {
  const root = asRecord(payload);
  const data = asRecord(root.data);
  const params = asRecord(data.params);
  const itemsValue = Array.isArray(root.items) ? root.items : Array.isArray(data.items) ? data.items : [];
  const items = itemsValue.map(normalizeMovieSummary).filter((movie) => movie.slug);
  return {
    title: asString(data.titlePage) ?? asString(root.titlePage) ?? fallbackTitle,
    items,
    pagination: normalizePagination(params.pagination ?? root.pagination, page, items.length),
  };
}

export async function getLatestMovies(page = 1) {
  return listFromPayload(
    await fetchJson(`/danh-sach/phim-moi-cap-nhat?page=${page}`, 180),
    page,
    "Phim mới cập nhật",
  );
}

export async function getMoviesByType(type: string, page = 1) {
  return listFromPayload(await fetchJson(`/v1/api/danh-sach/${type}?page=${page}`), page, "Danh sách phim");
}

export async function searchMovies(keyword: string, page = 1) {
  const query = new URLSearchParams({ keyword, page: String(page) });
  return listFromPayload(await fetchJson(`/v1/api/tim-kiem?${query}`, false), page, `Tìm kiếm: ${keyword}`);
}

export const getCategories = cache(async (): Promise<TaxonomyItem[]> => {
  const payload = await fetchJson("/the-loai", 3600);
  return normalizeTaxonomy(payload);
});

export const getCountries = cache(async (): Promise<TaxonomyItem[]> => {
  const payload = await fetchJson("/quoc-gia", 3600);
  return normalizeTaxonomy(payload);
});

export async function getMoviesByCategory(slug: string, page = 1) {
  return listFromPayload(await fetchJson(`/v1/api/the-loai/${slug}?page=${page}`), page, "Phim theo thể loại");
}

export async function getMoviesByCountry(slug: string, page = 1) {
  return listFromPayload(await fetchJson(`/v1/api/quoc-gia/${slug}?page=${page}`), page, "Phim theo quốc gia");
}

export const getMovieDetail = cache(async (slug: string): Promise<MovieDetailResult> => {
  const payload = asRecord(await fetchJson(`/phim/${slug}`, 600));
  return {
    movie: normalizeMovieDetail(payload.movie),
    episodes: Array.isArray(payload.episodes) ? payload.episodes.map(normalizeEpisodeServer) : [],
  };
});

export { movieTypes } from "@/lib/movie-types";
