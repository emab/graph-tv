import React, { useState, useEffect } from 'react';
import Search from './Search';
import GraphDisplay from './GraphDisplay';
import { Button } from 'semantic-ui-react';

const App = () => {
  const [selectedId, setSelectedId] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    setResults(null);
    const getAllRatings = async () => {
      const response = await fetch(`/api/ratings/${selectedId}`);
      const ratingsJson = await response.json();
      setResults(ratingsJson);
    };
    getAllRatings();
  }, [selectedId]);

  const handleButtonOnClick = () => {
    const westworldResults = {
      '1': [
        { episode: 1, rating: '8.9' },
        { episode: 2, rating: '8.6' },
        { episode: 3, rating: '8.4' },
        { episode: 4, rating: '8.7' },
        { episode: 5, rating: '8.7' },
        { episode: 6, rating: '8.9' },
        { episode: 7, rating: '9.5' },
        { episode: 8, rating: '8.8' },
        { episode: 9, rating: '9.4' },
        { episode: 10, rating: '9.7' }
      ],
      '2': [
        { episode: 1, rating: '8.2' },
        { episode: 2, rating: '8.1' },
        { episode: 3, rating: '8.0' },
        { episode: 4, rating: '9.0' },
        { episode: 5, rating: '7.9' },
        { episode: 6, rating: '8.2' },
        { episode: 7, rating: '8.6' },
        { episode: 8, rating: '9.2' },
        { episode: 9, rating: '8.8' },
        { episode: 10, rating: '8.8' }
      ],
      '3': [
        { episode: 1, rating: '8.4' },
        { episode: 2, rating: '8.4' },
        { episode: 3, rating: '8.4' },
        { episode: 4, rating: '9.0' },
        { episode: 5, rating: '8.2' },
        { episode: 6, rating: '8.5' },
        { episode: 7, rating: '8.1' },
        { episode: 8, rating: '7.4' }
      ]
    }
    setResults({});
    setResults(westworldResults);
    setSelectedId("tt0475784")
  }

  return (
    <>
      <Search setSelectedId={setSelectedId} />
      <Button onClick={handleButtonOnClick}>Set westworld results</Button>
      <GraphDisplay data={results} />
    </>
  );
};

export default App;
