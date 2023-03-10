import {
  getBestEpisode,
  getBestSeason,
  getWorstEpisode,
  getWorstSeason,
} from '@/utils/dataTools';
import { SeasonAverageData, SeasonEpisodeData } from '@/types/searchResult';
import { calculateMean } from '@/utils/createLOBF';
import { FaBalanceScale, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

type ShowHighlightsProps = {
  seasonData: SeasonAverageData[];
};

export const ShowHighlights = ({ seasonData }: ShowHighlightsProps) => {
  const bestSeason = getBestSeason(seasonData);
  const worstSeason = getWorstSeason(seasonData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-neutral-600">
      <div className="text-center">
        <h2 className="text-2xl inline-flex">
          Best <FaThumbsUp className="ml-2 text-green-600" />
        </h2>
        <p>Season: {bestSeason.season}</p>
        <p>Rating: {bestSeason.rating}</p>
      </div>
      <div className="text-center">
        <h2 className="text-2xl inline-flex">
          Worst <FaThumbsDown className="relative ml-2 top-2 text-red-600" />
        </h2>
        <p>Season: {bestSeason.season}</p>
        <p>Rating: {bestSeason.rating}</p>
      </div>
    </div>
  );
};
