export interface DownloadLinkRef {
  id: string;
  name: string;
}
export interface QualityGroup {
  quality: string;
  links: DownloadLinkRef[];
}
export interface Movie {
  id: string;
  title: string;
  slug: string;
  poster_url: string | null;
  description: string | null;
  year: number | null;
  qualities: QualityGroup[];
  created_at: string;
}
export interface Episode {
  episodeNumber: number;
  qualities: QualityGroup[];
}
export interface Season {
  seasonNumber: number;
  seasonZip?: QualityGroup[];
  episodes: Episode[];
}
export interface Show {
  id: string;
  title: string;
  slug: string;
  poster_url: string | null;
  description: string | null;
  year: number | null;
  seasons: Season[];
  created_at: string;
}
