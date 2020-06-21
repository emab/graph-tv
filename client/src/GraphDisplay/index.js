import React from 'react';
import Graph from '../Graph';

const GraphDisplay = ({ data }) => {
  if (data) {
    return Object.getOwnPropertyNames(data).map((sNumber) => {
      return (
        <div>
          <h2>Season {sNumber}</h2>
          <Graph data={data[sNumber]} h={300} w={600} />
        </div>
      );
    });
  } else {
    return 'No data';
  }
};

export default GraphDisplay;
