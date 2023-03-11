import { getBestEpisode, getWorstEpisode } from '@/utils/dataTools';
import { SeasonEpisodeData } from '@/types/searchResult';
import { calculateMean } from '@/utils/createLOBF';
import { FaBalanceScale, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

type SeasonHighlightsProps = {
  seasonEpisodes: SeasonEpisodeData;
};

export const SeasonHighlights = ({ seasonEpisodes }: SeasonHighlightsProps) => {
  const bestEpisode = getBestEpisode(seasonEpisodes);
  const worstEpisode = getWorstEpisode(seasonEpisodes);
  const averageRating = calculateMean(
    seasonEpisodes.map(({ rating }) => rating)
  ).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5  p-5 bg-neutral-600">
      <div className="text-center">
        <h2 className="text-2xl inline-flex">
          Best <FaThumbsUp className="ml-2 text-blue-400" />
        </h2>
        <p className="text-xl italic">{bestEpisode.name}</p>
        <p>Episode: {bestEpisode.episode}</p>
        <p>Rating: {bestEpisode.rating}</p>
      </div>
      <div className="text-center">
        <h2 className="text-2xl inline-flex">
          Average rating{' '}
          <FaBalanceScale className="relative top-1 ml-2 text-yellow-500" />
        </h2>
        <p className="text-xl font-bold">{averageRating}</p>
      </div>
      <div className="text-center">
        <h2 className="text-2xl inline-flex">
          Worst <FaThumbsDown className="relative ml-2 top-2 text-red-600" />
        </h2>
        <p className="text-xl italic">{worstEpisode.name}</p>
        <p>Episode: {worstEpisode.episode}</p>
        <p>Rating: {worstEpisode.rating}</p>
      </div>
    </div>
  );
};
