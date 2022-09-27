export type EpisodeData = {
  episode: number;
  rating: string;
};

export type SeasonData = {
  season: number;
  rating: string;
};

export type Seasons = {
  [season: string]: EpisodeData[];
};
