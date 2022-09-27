import React, { useEffect, useState } from 'react';
import { Search as SearchBar } from 'semantic-ui-react';
import useDebounce from '../hooks/useDebounce';

const Search = ({ setSelectedId }) => {
  const [results, setResults] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 750);

  const handleResultSelect = (e, { result }) => {
    setSearchValue(result.title);
    setSelectedId(result.id);
  };

  const handleSearchChange = (e, { value }) => {
    setIsLoading(true);
    setSearchValue(value);
  };

  useEffect(() => {
    const getResults = async (value) => {
      const results = await fetch(`/api/search?q=${value}`);
      const resultJson = await results.json();
      setResults(resultJson);
      setIsLoading(false);
    };
    getResults(debouncedSearchValue);
  }, [debouncedSearchValue]);

  return (
    <SearchBar
      fluid
      size="big"
      loading={isLoading}
      onResultSelect={handleResultSelect}
      onSearchChange={handleSearchChange}
      results={results}
      value={searchValue}
    />
  );
};

export default Search;
