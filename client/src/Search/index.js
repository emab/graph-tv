import React, { useState, useEffect } from 'react';
import { Search as SearchBar } from 'semantic-ui-react';

const Search = ({ setSelectedId }) => {
  const [results, setResults] = useState([]);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResultSelect = (e, { result }) => {
    setValue(result.title);
    setSelectedId(result.id);
  };

  const handleSearchChange = (e, { value }) => {
    setIsLoading(true);
    setValue(value);
  };

  useEffect(() => {
    const getResults = async (value) => {
      const results = await fetch(`/api/search?q=${value}`);
      const resultJson = await results.json();
      setResults(resultJson);
      setIsLoading(false);
    };
    getResults(value);
  }, [value]);

  return (
    <SearchBar
      loading={isLoading}
      onResultSelect={handleResultSelect}
      onSearchChange={handleSearchChange}
      results={results}
      value={value}
    />
  );
};

export default Search;
