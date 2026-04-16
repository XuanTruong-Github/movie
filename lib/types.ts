export type MenuItem = {
  name: string;
  slug: string;
};

export type SeoOnPage = {
  titleHead: string;
  descriptionHead: string;
  og_type: string;
  og_url?: string;
  og_image: string[];
};

export type MovieListItem = {
  _id: string;
  name: string;
  origin_name: string;
  slug: string;
  thumb_url: string;
  episode_current: string;
};

export type PaginationData = {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  pageRanges: number;
};

export type ListSearchParams = {
  page?: string;
  limit?: string;
};

export type MovieListResponse = {
  APP_DOMAIN_CDN_IMAGE: string;
  items: MovieListItem[];
  params: {
    pagination: PaginationData;
  };
  seoOnPage: SeoOnPage;
  titlePage: string;
};

export type MovieCategory = {
  name: string;
  slug: string;
};

export type MovieCountry = {
  name: string;
  slug: string;
};

export type BreadcrumbItemData = {
  isCurrent: boolean;
  name: string;
  slug: string;
};

export type MovieEpisode = {
  link_m3u8?: string;
  name: string;
  slug: string;
};

export type MovieEpisodeServer = {
  server_data: MovieEpisode[];
  server_name: string;
};

export type MovieDetail = {
  actor: string[];
  category: MovieCategory[];
  content: string;
  country: MovieCountry[];
  director?: string[];
  episode_total?: string;
  episodes: MovieEpisodeServer[];
  lang: string;
  name: string;
  origin_name: string;
  quality: string;
  status: string;
  trailer_url?: string;
  type: string;
  year: number | string;
};

export type MovieDetailResponse = {
  APP_DOMAIN_CDN_IMAGE: string;
  breadCrumb: BreadcrumbItemData[];
  item: MovieDetail;
  seoOnPage: SeoOnPage;
};
