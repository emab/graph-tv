import { EpisodeData, SeasonAverageData } from '@/types/searchResult';

export const getBest =
  <T extends { rating: number }>(type: keyof T) =>
  (data: T[]) => {
    let number: T[keyof T];
    let rating = -1;
    data.forEach((val) => {
      if (Number(val.rating) > rating) {
        rating = Number(val.rating);
        number = val[type]!;
      }
    });
    return data.find((d) => d[type] === number)!;
  };

export const getWorst =
  <T extends { rating: number }>(type: keyof T) =>
  (data: T[]) => {
    let number: T[keyof T];
    let rating = 11;
    data.forEach((val) => {
      if (Number(val.rating) < rating) {
        rating = Number(val.rating);
        number = val[type];
      }
    });
    return data.find((d) => d[type] === number)!;
  };

export const getBestEpisode = getBest<EpisodeData>('episode');
export const getWorstEpisode = getWorst<EpisodeData>('episode');
export const getBestSeason = getBest<SeasonAverageData>('season');
export const getWorstSeason = getWorst<SeasonAverageData>('season');

export const ratingNormalizer =
  (minRating: number, maxRating: number) => (rating: number) =>
    (rating - minRating) / (maxRating - minRating);
