import React, { useState, useEffect } from 'react';
import Search from './Search';
import GraphDisplay from './GraphDisplay';
import { Loader } from 'semantic-ui-react';

const App = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setResults(null);
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

  return (
    <>
      <Search setSelectedId={setSelectedId} />
      {loading ? (
        <Loader active inline="centered">
          Loading IMDB Data...
        </Loader>
      ) : (
        <GraphDisplay data={results} />
      )}
    </>
  );
};

export default App;
