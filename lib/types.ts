export type Movie = {
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url?: string;
  year?: number;
  quality?: string;
  lang?: string;
  time?: string;
  type?: string;
  episode_current?: string;
  status?: string;
  category?: { id: string; name: string; slug: string }[];
  country?: { id: string; name: string; slug: string }[];
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
};

export type MovieListResponse = {
  status: boolean;
  items: Movie[];
  pagination: Pagination;
};

export type MovieDetail = {
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  thumb_url: string;
  poster_url?: string;
  trailer_url?: string;
  year: number;
  time?: string;
  episode_total?: string;
  quality: string;
  lang: string;
  actor: string[];
  director?: string[];
  category: { id: string; name: string; slug: string }[];
  country: { id: string; name: string; slug: string }[];
};

export type EpisodeItem = {
  name: string;
  slug: string;
  link_embed: string;
  link_m3u8: string;
};

export type EpisodeServer = {
  server_name: string;
  server_data: EpisodeItem[];
};

export type MovieDetailResponse = {
  status: boolean;
  movie: MovieDetail;
  episodes: EpisodeServer[];
};

export type MenuItem = {
  name: string;
  slug: string;
};
