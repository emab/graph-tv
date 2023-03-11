import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import {
  getBest,
  getBestEpisode,
  getWorst,
  getWorstEpisode,
} from '@/utils/dataTools';
import { EpisodeData } from '@/types/searchResult';

type AllEpisodeDataProps = {
  data: EpisodeData[][];
};

export const AllEpisodeSummary = ({ data }: AllEpisodeDataProps) => {
  const bestEpisode = getBest<EpisodeData>('overallEpisode')(
    data.flatMap((data) => data)
  );
  const worstEpisode = getWorst<EpisodeData>('overallEpisode')(
    data.flatMap((data) => data)
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-neutral-600">
      <div className="text-center">
        <h2 className="text-2xl inline-flex">
          Best ever episode <FaThumbsUp className="ml-2 text-blue-400" />
        </h2>
        <p className="font-bold">{bestEpisode.name}</p>
        <p>Season: {bestEpisode.season}</p>
        <p>Episode: {bestEpisode.episode}</p>
        <p>Rating: {bestEpisode.rating}</p>
      </div>
      <div className="text-center">
        <h2 className="text-2xl inline-flex">
          Worst ever episode{' '}
          <FaThumbsDown className="relative ml-2 top-2 text-red-600" />
        </h2>
        <p className="font-bold">{worstEpisode.name}</p>
        <p>Season: {worstEpisode.season}</p>
        <p>Episode: {worstEpisode.episode}</p>
        <p>Rating: {worstEpisode.rating}</p>
      </div>
    </div>
  );
};
