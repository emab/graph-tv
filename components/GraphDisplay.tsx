import React, { useEffect, useRef, useState } from 'react';
import { SeasonAverageData, SeasonEpisodeData } from '@/types/searchResult';
import { Graph, RateEpisodeState } from './Graph';
import { SeasonHighlights } from '@/components/SeasonHighlights';
import { ShowHighlights } from './ShowHighlights';
import { AllEpisodeGraph } from './AllEpisodeGraph';
import { AllEpisodeSummary } from '@/components/AllEpisodeSummary';
import { SeasonSelector } from '@/components/SeasonSelector';
import { Modal } from '@/components/Modal';
import { RateEpisode } from './RateEpisode';

const getGraphWidth = (container: HTMLDivElement): number =>
  container?.clientWidth - 10 ?? 0;

export type Data = {
  name: string;
  averageRating: number;
  seasonAverageRatings: SeasonAverageData[];
  seasonEpisodeRatings: SeasonEpisodeData[];
};

const GraphDisplay = ({ data, showId }: { data: Data; showId: number }) => {
  const ref = useRef(null);
  const [graphWidth, setGraphWidth] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState<RateEpisodeState>();

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
      {!!showRatingModal && (
        <Modal handleClose={() => setShowRatingModal(undefined)}>
          <div className="text-center px-4 md:pb-5">
            <h2 className="text-4xl">Rate episode</h2>
            <p className="text-lg mt-2">
              {
                data.seasonEpisodeRatings[showRatingModal.season - 1][
                  showRatingModal.episode - 1
                ].name
              }
            </p>
            <p className="italic">
              Season: {showRatingModal.season}
              {' - '}Episode: {showRatingModal.episode}
            </p>
            <div className="mt-10">
              <RateEpisode
                episode={showRatingModal.episode}
                season={showRatingModal.season}
                showId={showId}
              />
            </div>
          </div>
        </Modal>
      )}
      <AllEpisodeGraph
        title=""
        getTooltipHtml={(d) =>
          `<span class='font-bold'>Season ${d.extra.season}</span></br><span class='font-bold'>Episode ${d.extra.actualEpisode}</span></br><span class='font-medium'>${d.extra.name}</span></br><span class='text-neutral-200'>Episode: ${d.x}</span></br><span class='text-neutral-200'>Rating: ${d.y}</span>`
        }
        width={graphWidth}
        height={400}
        xLabel="Episode"
        data={data.seasonEpisodeRatings.map((season, index) =>
          season.map((episode) => ({
            x: episode.overallEpisode,
            y: episode.rating,
            extra: {
              name: episode.name,
              season: index + 1,
              actualEpisode: episode.episode,
              jumpToSeasonOnClick: false,
            },
          }))
        )}
        setShowRatingModal={setShowRatingModal}
      >
        <AllEpisodeSummary data={data.seasonEpisodeRatings} />
      </AllEpisodeGraph>
      <SeasonSelector seasonCount={data.seasonAverageRatings.length} />
      <h2 className="text-4xl text-center text-white mb-4">
        Average Season Ratings
      </h2>
      <Graph
        title=""
        data={
          data.seasonAverageRatings.map((d) => ({
            x: d.season,
            y: d.rating,
            extra: {
              season: d.season,
              name: '',
              actualEpisode: 0,
              jumpToSeasonOnClick: true,
            },
          })) ?? []
        }
        xLabel="Season"
        getTooltipHtml={(d) => `Season: ${d.x}</br>Rating: ${d.y}`}
        width={graphWidth}
        height={400}
      >
        <ShowHighlights seasonData={data.seasonAverageRatings} />
      </Graph>
      <div className="mt-10 pb-2">
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
                    season: index + 1,
                    actualEpisode: value.overallEpisode,
                    jumpToSeasonOnClick: false,
                  },
                }))}
                xLabel="Episode"
                getTooltipHtml={(d) =>
                  `<span class='font-bold'>${d.extra?.name}</span></br><span class='text-neutral-200'>Episode: ${d.x}</span></br><span class='text-neutral-200'>Rating: ${d.y}</span>`
                }
                width={graphWidth}
                height={400}
                id={`season-${index + 1}`}
                key={`season-${index + 1}`}
                setShowRatingModal={setShowRatingModal}
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
