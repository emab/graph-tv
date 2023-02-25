import React, { useEffect, useRef, useState } from 'react';
import EpisodeGraph from './Graph/EpisodeGraph';
import SeasonGraph from './Graph/SeasonGraph';
import { SeasonAverageData, SeasonEpisodeData } from '@/types/searchResult';

const getGraphWidth = (container: HTMLDivElement): number =>
  container?.clientWidth - 50 ?? 0;

export type Data = {
  seasonAverageRatings: SeasonAverageData[];
  seasonEpisodeRatings: SeasonEpisodeData[];
};

const GraphDisplay = ({ data }: { data: Data }) => {
  const ref = useRef(null);
  const [graphWidth, setGraphWidth] = useState(0);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) {
      return;
    }
    const updateGraphWidth = () => {
      setGraphWidth(getGraphWidth(currentRef));
    };

    window.addEventListener('resize', updateGraphWidth);

    return () => {
      window.removeEventListener('resize', updateGraphWidth);
    };
  }, []);

  useEffect(() => {
    if (ref.current) {
      setGraphWidth(getGraphWidth(ref.current));
    }
  }, []);

  return (
    <div className="m-5 max-w-6xl mx-auto" ref={ref}>
      <h2 className="text-2xl text-center text-white mb-2">
        Average Season Ratings
      </h2>
      <SeasonGraph
        data={data?.seasonAverageRatings ?? []}
        h={300}
        w={graphWidth}
      />
      <div className="mt-10">
        <h2 className="text-2xl text-white text-center mb-2">Season Ratings</h2>
        {data?.seasonEpisodeRatings.map((seasonEpisodes, index) => {
          return (
            <div key={seasonEpisodes.map((sep) => sep.rating).join('-')}>
              <EpisodeGraph
                seasonNumber={index + 1}
                data={seasonEpisodes}
                h={300}
                w={graphWidth}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GraphDisplay;
