export interface MovieItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  episode_current?: string;
  quality?: string;
  lang?: string;
  trailer_url?: string;
}

export interface Category {
  name: string;
  slug: string;
}

export interface Episode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface EpisodeServer {
  server_name: string;
  server_data: Episode[];
}

export interface MovieDetail extends MovieItem {
  content: string;
  type: string;
  status: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  trailer_url: string;
  category: Category[];
  country: Category[];
  actor: string[];
  director: string[];
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface ListResponse {
  status: boolean;
  items: MovieItem[];
  pagination: Pagination;
}

export interface MovieDetailResponse {
  status: boolean;
  movie: MovieDetail;
  episodes: EpisodeServer[];
}

export interface WatchHistoryEntry {
  movieSlug: string;
  movieName: string;
  thumb_url: string;
  episodeSlug: string;
  episodeName: string;
  watchedAt: number;
}
