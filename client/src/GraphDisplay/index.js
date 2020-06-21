import React from 'react';
import EpisodeGraph from '../Graph/EpisodeGraph';
import SeasonGraph from '../Graph/SeasonGraph';

const GraphDisplay = ({ data }) => {
  if (data) {
    const seasonAverage = (seasonData) => {
      let ratingTotal = 0;
      seasonData.forEach((ep) => (ratingTotal += parseFloat(ep.rating)));
      return ratingTotal / seasonData.length;
    };
    const getSeasonAverage = () => {
      return Object.getOwnPropertyNames(data).map((season) => {
        return { season: [season], rating: seasonAverage(data[season]) };
      });
    };

    return (
      <>
        <div>
          <h2>Season Ratings</h2>
          <SeasonGraph data={getSeasonAverage()} h={300} w={600} />
        </div>
        <div>
          {Object.getOwnPropertyNames(data).map((sNumber) => {
            return (
              <div>
                <h2>Season {sNumber}</h2>
                <EpisodeGraph data={data[sNumber]} h={300} w={600} />
              </div>
            );
          })}
        </div>
      </>
    );
  } else {
    return 'No data';
  }
};

export default GraphDisplay;
