import React, { useEffect, useState } from 'react';
import Search from './Search';
import GraphDisplay from './GraphDisplay';
import { Loader, Transition } from 'semantic-ui-react';
import style from './App.module.css';
import { Seasons } from './types';
import * as d3 from 'd3';

const App = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [results, setResults] = useState<Seasons>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setResults(undefined);
    const getAllRatings = async () => {
      setLoading(true);
      const response = await fetch(`/api/ratings/${selectedId}`);
      const ratingsJson = await response.json();
      setResults(ratingsJson);
      setLoading(false);
    };
    if (selectedId) {
      getAllRatings();
    }
  }, [selectedId]);

  useEffect(() => {
    d3.select('body').append('div').attr('class', 'tooltip');
  }, []);

  return (
    <>
      <div className={style.searchBar}>
        <h1>Graph TV</h1>
        <Search setSelectedId={setSelectedId} />
      </div>
      {loading ? (
        <div className={style.loader}>
          <Loader active inline='centered'>
            Loading IMDB Data...
          </Loader>
        </div>
      ) : (
        <Transition visible={!loading} animation='scale' duration={500}>
          <GraphDisplay data={results} />
        </Transition>
      )}
    </>
  );
};

export default App;
