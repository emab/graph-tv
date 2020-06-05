import React, { useState, useEffect } from 'react';
import Search from './Search';

const App = () => {
  const [selectedId, setSelectedId] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
      const getAllRatings = async () => {
        const response = await fetch(`/api/ratings/${selectedId}`);
        const ratingsJson = await response.json();
        setResults(ratingsJson);
      }
      getAllRatings();
  }, [selectedId])
  return (
    <>
      <Search setSelectedId={setSelectedId} />
      <p>{JSON.stringify(results)}</p>
    </>
  );
};

export default App;
