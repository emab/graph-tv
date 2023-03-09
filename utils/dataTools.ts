import { EpisodeData, SeasonAverageData } from '@/types/searchResult';

const getBest =
  <T extends { rating: number }>(type: keyof T) =>
  (data: T[]) => {
    let number;
    let rating = -1;
    data.forEach((val) => {
      if (Number(val.rating) > rating) {
        rating = Number(val.rating);
        number = val[type]!;
      }
    });
    return { number, rating };
  };

const getWorst =
  <T extends { rating: number }>(type: keyof T) =>
  (data: T[]) => {
    let number;
    let rating = 11;
    data.forEach((val) => {
      if (Number(val.rating) < rating) {
        rating = Number(val.rating);
        number = val[type];
      }
    });
    return { number, rating };
  };

export const getBestEpisode = getBest<EpisodeData>('episode');
export const getWorstEpisode = getWorst<EpisodeData>('episode');
export const getBestSeason = getBest<SeasonAverageData>('season');
export const getWorstSeason = getWorst<SeasonAverageData>('season');
