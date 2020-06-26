const getBestEpisodeAndRating = => {
  let bestEpisode;
  let bestEpisodeRating = -1;
  data.forEach((val) => {
    if (val.rating > bestEpisodeRating) {
      bestEpisodeRating = val.rating;
      bestEpisode = val.episode;
    }
  });
  return { bestEpisode, bestEpisodeRating };
};

const getBestFromData = (data) => {
  let best;
  let bestRating = -1;
  data.forEach((val) => {
    if (val.rating > bestRating) {
      bestRating = val.rating;
      best = val.episode;
    }
  });
  return { bestEpisode, bestEpisodeRating };
}