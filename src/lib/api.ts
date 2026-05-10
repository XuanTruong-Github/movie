import {
  BASE_URL,
  REVALIDATE_COMING_SOON,
  REVALIDATE_DETAIL,
  REVALIDATE_LATEST,
  REVALIDATE_LIST,
  REVALIDATE_TAXONOMY,
} from "./constants";
import type {
  Category,
  ListResponse,
  MovieDetailResponse,
  MovieItem,
  Pagination,
} from "./types";

// Raw shape returned by /danh-sach/* endpoints
interface RawLatestResponse {
  status: boolean;
  items: MovieItem[];
  pathImage?: string;
  pagination: Pagination;
}

// Raw shape returned by all /v1/api/* endpoints
interface RawV1Response {
  status: string;
  message: string;
  data: {
    items: MovieItem[];
    params: {
      pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        pageRanges: number;
      };
    };
  };
}

function normalizeV1(raw: RawV1Response): ListResponse {
  const p = raw.data.params.pagination;
  return {
    status: true,
    items: raw.data.items ?? [],
    pagination: {
      totalItems: p.totalItems,
      totalItemsPerPage: p.totalItemsPerPage,
      currentPage: p.currentPage,
      totalPages: Math.ceil(p.totalItems / p.totalItemsPerPage),
    },
  };
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

async function apiFetchV1(url: string, init?: RequestInit): Promise<ListResponse> {
  const raw = await apiFetch<RawV1Response>(url, init);
  return normalizeV1(raw);
}

export async function fetchLatestMovies(page = 1): Promise<ListResponse> {
  const raw = await apiFetch<RawLatestResponse>(
    `${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}&limit=12`,
    { next: { revalidate: REVALIDATE_LATEST } }
  );
  return {
    status: Boolean(raw.status),
    items: raw.items ?? [],
    pagination: raw.pagination,
  };
}

export function fetchMovieDetail(slug: string): Promise<MovieDetailResponse> {
  return apiFetch(`${BASE_URL}/phim/${slug}`, {
    next: { revalidate: REVALIDATE_DETAIL, tags: [`movie-${slug}`] },
  });
}

export function fetchMoviesByGenre(slug: string, page = 1): Promise<ListResponse> {
  return apiFetchV1(
    `${BASE_URL}/v1/api/the-loai/${slug}?page=${page}`,
    { next: { revalidate: REVALIDATE_LIST } }
  );
}

export function fetchMoviesByCountry(slug: string, page = 1): Promise<ListResponse> {
  return apiFetchV1(
    `${BASE_URL}/v1/api/quoc-gia/${slug}?page=${page}`,
    { next: { revalidate: REVALIDATE_LIST } }
  );
}

export function fetchSearch(keyword: string, page = 1): Promise<ListResponse> {
  const encoded = encodeURIComponent(keyword);
  return apiFetchV1(
    `${BASE_URL}/v1/api/tim-kiem?keyword=${encoded}&page=${page}`,
    { cache: "no-store" }
  );
}

export function fetchSeriesList(page = 1): Promise<ListResponse> {
  return apiFetchV1(
    `${BASE_URL}/v1/api/danh-sach/phim-bo?page=${page}&limit=12`,
    { next: { revalidate: REVALIDATE_LATEST } }
  );
}

export function fetchStandaloneList(page = 1): Promise<ListResponse> {
  return apiFetchV1(
    `${BASE_URL}/v1/api/danh-sach/phim-le?page=${page}&limit=12`,
    { next: { revalidate: REVALIDATE_LATEST } }
  );
}

export function fetchComingSoon(page = 1): Promise<ListResponse> {
  return apiFetchV1(
    `${BASE_URL}/v1/api/danh-sach/phim-sap-chieu?page=${page}&limit=12`,
    { next: { revalidate: REVALIDATE_COMING_SOON } }
  );
}

export function fetchTvShows(page = 1): Promise<ListResponse> {
  return apiFetchV1(
    `${BASE_URL}/v1/api/danh-sach/tv-shows?page=${page}`,
    { next: { revalidate: REVALIDATE_LIST } }
  );
}

export function fetchGenres(): Promise<Category[]> {
  return apiFetch(`${BASE_URL}/the-loai`, {
    next: { revalidate: REVALIDATE_TAXONOMY },
  });
}

export function fetchCountries(): Promise<Category[]> {
  return apiFetch(`${BASE_URL}/quoc-gia`, {
    next: { revalidate: REVALIDATE_TAXONOMY },
  });
}
