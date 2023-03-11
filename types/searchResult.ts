export type SearchResult = {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
};

export type SeasonAverageData = { season: number; rating: number };

export type EpisodeData = {
  name: string;
  episode: number;
  rating: number;
  overallEpisode: number;
  season: number;
};

export type SeasonEpisodeData = EpisodeData[];
