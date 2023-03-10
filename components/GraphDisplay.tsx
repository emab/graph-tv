import React, { useEffect, useRef, useState } from 'react';
import { SeasonAverageData, SeasonEpisodeData } from '@/types/searchResult';
import { Graph } from './Graph';
import {
  getBestEpisode,
  getBestSeason,
  getWorstEpisode,
  getWorstSeason,
} from '@/utils/dataTools';
import { calculateMean } from '@/utils/createLOBF';
import { SeasonHighlights } from '@/components/SeasonHighlights';
import { ShowHighlights } from './ShowHighlights';

const getGraphWidth = (container: HTMLDivElement): number =>
  container?.clientWidth - 50 ?? 0;

export type Data = {
  name: string;
  averageRating: number;
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
    <div className="m-5 mx-2 md:mx-14 lg:mx-28" ref={ref}>
      <h2 className="text-4xl text-center text-white mb-4">
        Average Season Ratings
      </h2>
      <Graph
        title=""
        data={
          data.seasonAverageRatings.map((d) => ({
            x: d.season,
            y: d.rating,
            extra: undefined,
          })) ?? []
        }
        xLabel="Season"
        getTooltipHtml={(d) => `Season: ${d.x + 1}</br>Rating: ${d.y}`}
        width={graphWidth}
        height={400}
      >
        <ShowHighlights seasonData={data.seasonAverageRatings} />
      </Graph>
      <div className="mt-10">
        <h2 className="text-4xl text-center text-white mb-4">Season Ratings</h2>
        {data?.seasonEpisodeRatings.map((seasonEpisodes, index) => {
          return (
            <div key={seasonEpisodes.map((sep) => sep.rating).join('-')}>
              <Graph
                title={`Season ${index + 1}`}
                data={seasonEpisodes.map((value) => ({
                  x: value.episode,
                  y: value.rating,
                  extra: {
                    name: value.name,
                  },
                }))}
                xLabel="Episode"
                getTooltipHtml={(d) =>
                  `<span class="font-bold">${d.extra.name}</span></br><span class="text-neutral-200">Episode: ${d.x}</span></br><span class="text-neutral-200">Rating: ${d.y}</span>`
                }
                width={graphWidth}
                height={400}
              >
                <SeasonHighlights seasonEpisodes={seasonEpisodes} />
              </Graph>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GraphDisplay;
