import React from 'react';
import EpisodeGraph from '../Graph/EpisodeGraph';
import SeasonGraph from '../Graph/SeasonGraph';
import { Container } from 'semantic-ui-react';

import style from './graphDisplay.module.css';

const GraphDisplay = ({ data }) => {
  if (data) {
    const seasonAverage = (seasonData) => {
      let ratingTotal = 0;
      seasonData.forEach((ep) => (ratingTotal += parseFloat(ep.rating)));
      return (ratingTotal = 0 ? undefined : ratingTotal / seasonData.length);
    };
    const getSeasonAverage = () => {
      return Object.getOwnPropertyNames(data).map((season) => {
        return { season: [season], rating: seasonAverage(data[season]) };
      });
    };

    return (
      <>
        <div className={style.overview}>
          <Container textAlign="center">
            <h2>Average Season Ratings</h2>
          </Container>
          <SeasonGraph data={getSeasonAverage()} h={300} w={600} />
        </div>
        <div>
          {Object.getOwnPropertyNames(data).map((sNumber) => {
            return (
              <div key={sNumber} className={style.season}>
                <Container textAlign="center">
                  <h2>Season {sNumber}</h2>
                </Container>
                <EpisodeGraph data={data[sNumber]} h={300} w={600} />
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
