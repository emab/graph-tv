const getBest = (type) => (data) => {
  let number;
  let rating = -1;
  data.forEach((val) => {
    if (val.rating > rating) {
      rating = val.rating;
      number = val[type];
    }
  });
  return { number, rating };
};

const getWorst = (type) => (data) => {
  let number;
  let rating = 11;
  data.forEach((val) => {
    if (val.rating < rating) {
      rating = val.rating;
      number = val[type];
    }
  });
  return { number, rating };
};

export const getBestEpisode = getBest('episode');
export const getWorstEpisode = getWorst('episode');
export const getBestSeason = getBest('season');
export const getWorstSeason = getWorst('season');
