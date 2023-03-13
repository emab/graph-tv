import * as d3 from 'd3';

export const interpolateRating = (normalizedRating: number) =>
  d3.interpolateRgb('darkred', 'darkgreen')(normalizedRating);
