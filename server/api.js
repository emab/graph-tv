var express = require("express");
var router = express.Router();
var imdb = require("js-imdb-scraper");

/* GET search results. */
router.get("/search", (req, res, next) => {
  const show = req.query.q;
  search(show).then((showResults) => {
    res.send(showResults);
  });
});

router.get("/ratings/:showid", (req, res, next) => {
  const showId = req.params.showid;
  getAllRatings(showId).then((ratingResults) => {
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

module.exports = router;
