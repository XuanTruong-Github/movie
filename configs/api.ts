"use server";

import {
  MovieListResponse,
  MovieDetailResponse,
  MenuItem,
} from "@/lib/types";

const BASE = "https://phimapi.com";

async function apiV1(path: string, init?: RequestInit) {
  return fetch(`${BASE}/v1/api${path}`, init);
}

async function api(path: string, init?: RequestInit) {
  return fetch(`${BASE}${path}`, init);
}

export async function getNewMovies(page = 1): Promise<MovieListResponse | null> {
  try {
    const res = await api(`/danh-sach/phim-moi-cap-nhat?page=${page}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    // Handle { data: { items, params } }
    if (json.data) {
      return {
        status: json.status,
        items: json.data.items || [],
        pagination: {
          currentPage: json.data.params?.pagination?.currentPage || 1,
          totalPages: json.data.params?.pagination?.totalPages || 1,
        },
      };
    }
    return json;
  } catch {
    return null;
  }
}

export async function getMoviesByType(
  type: string,
  page = 1
): Promise<MovieListResponse | null> {
  try {
    const res = await apiV1(`/danh-sach/${type}?page=${page}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    // Handle both old format { data: { items, params } } and new { items, pagination }
    if (json.data) {
      return {
        status: json.status,
        items: json.data.items || [],
        pagination: {
          currentPage: json.data.params?.pagination?.currentPage || 1,
          totalPages: json.data.params?.pagination?.totalPages || 1,
        },
      };
    }
    return json;
  } catch {
    return null;
  }
}

export async function getMovieDetail(
  slug: string
): Promise<MovieDetailResponse | null> {
  try {
    const res = await api(`/phim/${slug}`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function searchMovies(
  keyword: string,
  page = 1
): Promise<MovieListResponse | null> {
  try {
    const res = await apiV1(
      `/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (json.data) {
      return {
        status: json.status,
        items: json.data.items || [],
        pagination: {
          currentPage: json.data.params?.pagination?.currentPage || 1,
          totalPages: json.data.params?.pagination?.totalPages || 1,
        },
      };
    }
    return json;
  } catch {
    return null;
  }
}

export async function getMoviesByCategory(
  category: string,
  page = 1
): Promise<MovieListResponse | null> {
  try {
    const res = await apiV1(`/the-loai/${category}?page=${page}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.data) {
      return {
        status: json.status,
        items: json.data.items || [],
        pagination: {
          currentPage: json.data.params?.pagination?.currentPage || 1,
          totalPages: json.data.params?.pagination?.totalPages || 1,
        },
      };
    }
    return json;
  } catch {
    return null;
  }
}

export async function getMoviesByCountry(
  country: string,
  page = 1
): Promise<MovieListResponse | null> {
  try {
    const res = await apiV1(`/quoc-gia/${country}?page=${page}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.data) {
      return {
        status: json.status,
        items: json.data.items || [],
        pagination: {
          currentPage: json.data.params?.pagination?.currentPage || 1,
          totalPages: json.data.params?.pagination?.totalPages || 1,
        },
      };
    }
    return json;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<MenuItem[]> {
  try {
    const res = await api("/the-loai", { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    // Direct array response
    return Array.isArray(data) ? data : data.items ?? [];
  } catch {
    return [];
  }
}

export async function getCountries(): Promise<MenuItem[]> {
  try {
    const res = await api("/quoc-gia", { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    // Direct array response
    return Array.isArray(data) ? data : data.items ?? [];
  } catch {
    return [];
  }
}
