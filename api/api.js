import express from 'express';
var router = express.Router();
import imdb from 'js-imdb-scraper';

/* GET search results. */
router.get('/search', (req, res, next) => {
  const show = req.query.q;
  search(show).then((showResults) => {
    res.send(showResults);
  });
});

router.get('/ratings/:showid', (req, res, next) => {
  const showId = req.params.showid;
  getAllRatings(showId).then((ratingResults) => {
    res.send(ratingResults);
  });
});

router.get('/ratings/:showid/:season', (req, res, next) => {
  const showId = req.params.showid;
  const season = req.params.season;
  getSeasonRatings(showId, season).then((ratingResults) => {
    res.send(ratingResults);
  });
});

const search = async (show) => {
  const showResults = await imdb.getSearchResults(show);
  return showResults;
};

const getAllRatings = async (showId) => {
  const ratingResults = await imdb.getAllRatings(showId);
  return ratingResults;
};

const getSeasonRatings = async (showId, season) => {
  const ratingResults = await imdb.getSeasonRatings(showId, season);
  return ratingResults;
};

export default router;
