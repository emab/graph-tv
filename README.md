# graph-tv

## <http://g-tv.herokuapp.com>

## Description

An attempted recreation of this website: <http://graphtv.kevinformatics.com/>. It unfortunately went offline a while ago and newer sites don't look as nice.

The aim is to be able to search for a TV show and have all its seasons ratings shown on a pretty graph. It should be easy to use and have a simplistic design.

## Front-end

The front-end is built with [React](https://reactjs.org/). I'm also using [Semantic UI](https://react.semantic-ui.com/) for my basic components. I'll be using [D3](https://d3js.org/) to draw a (hopefully) pretty graph.

## Back-end

The React app is served using [Express](https://expressjs.com/), which also exposes the API endpoints which gets the IMDB show data.

To get the IMDB data, I made a simple [scraper](https://github.com/emab/js-imdb-scraper) to fetch the search pages and return results. The IMDB API could be used here as it is currently free for up to 1000 requests per day. In the future I may use the API by default and switch to the scraper if the request limit is reached.
