export type TaxonomyItem = {
  id?: string;
  name: string;
  slug: string;
};

export type MovieSummary = {
  id?: string;
  name: string;
  slug: string;
  originName?: string;
  posterUrl?: string;
  thumbUrl?: string;
  year?: number;
  type?: string;
  time?: string;
  episodeCurrent?: string;
  quality?: string;
  lang?: string;
  categories: TaxonomyItem[];
  countries: TaxonomyItem[];
};

export type MovieDetail = MovieSummary & {
  content?: string;
  status?: string;
  episodeTotal?: string;
};

export type EpisodeItem = {
  name: string;
  slug: string;
  filename?: string;
  linkEmbed?: string;
  linkM3u8?: string;
};

export type EpisodeServer = {
  serverName: string;
  serverData: EpisodeItem[];
};

export type Pagination = {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
};

export type MovieListResult = {
  title: string;
  items: MovieSummary[];
  pagination: Pagination;
};

export type MovieDetailResult = {
  movie: MovieDetail;
  episodes: EpisodeServer[];
};
