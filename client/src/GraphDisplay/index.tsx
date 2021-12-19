import React, { useEffect } from 'react';
import EpisodeGraph from '../Graph/EpisodeGraph';
import SeasonGraph from '../Graph/SeasonGraph';
import { Container } from 'semantic-ui-react';

import style from './graphDisplay.module.css';
import { EpisodeData, SeasonData, Seasons } from '../types';

const getGraphWidth = (): number => window.innerWidth - 100;

const GraphDisplay = ({ data }: { data: Seasons | undefined }) => {
  const [graphWidth, setGraphWidth] = React.useState(getGraphWidth());
  if (data) {
    const seasonAverage = (episodeData: EpisodeData[]): string => {

      const ratingTotal = episodeData.reduce(
        (acc, curr) => acc + Number(curr.rating),
        0,
      );

      return String((ratingTotal === 0 ? undefined : ratingTotal / episodeData.length)?.toFixed(2));
    };

    const getSeasonAverage = (): SeasonData[] => {
      return Object.keys(data).map((season) => {
        return { season: Number(season), rating: seasonAverage(data[season]) };
      });
    };

    useEffect(() => {
      const updateGraphWidth = () => {
        setGraphWidth(getGraphWidth());
      };

      window.addEventListener('resize', updateGraphWidth);

      return () => {
        window.removeEventListener('resize', updateGraphWidth);
      };
    }, []);

    return (
      <>
        <h2 className={style.heading}>Average Season Ratings</h2>
        <div className={style.overview}>
          <SeasonGraph data={getSeasonAverage()} h={300} w={graphWidth} />
        </div>
        <div>
          <h2 className={style.heading}>Season Ratings</h2>

          {Object.getOwnPropertyNames(data).map((seasonNumber) => {
            return (
              <div key={seasonNumber} className={style.season}>
                <Container textAlign='center'>
                  <h2>Season {seasonNumber}</h2>
                </Container>
                <EpisodeGraph data={data[seasonNumber]} h={300} w={graphWidth} />
              </div>
            );
          })}
        </div>
      </>
    );
  } else {
    return <></>;
  }
};

export default GraphDisplay;
