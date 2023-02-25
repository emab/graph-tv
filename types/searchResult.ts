export type SearchResult = {
  id: number;
  name: string;
  poster_path: string;
  vote_average: string;
};

export type SeasonAverageData = { season: number; rating: number };

export type EpisodeData = { episode: number; rating: number };

export type SeasonEpisodeData = EpisodeData[];
