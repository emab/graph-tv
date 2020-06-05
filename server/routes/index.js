var express = require('express');
var router = express.Router();
var imdb = require('js-imdb-scraper');

/* GET home page. */
router.get('/', function(req, res, next) {
  f();
  res.render('index', { title: 'Express' });
});

const f = async () => {
  const showResults = await imdb.getSearchResults('westworld');
  console.log(showResults);
}

module.exports = router;
