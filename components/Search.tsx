import useDebounce from '@/hooks/useDebounce';
import React, { Dispatch, SetStateAction } from 'react';
import { useQuery } from 'react-query';
import { Search as SearchBar } from 'semantic-ui-react';
import { SearchResult } from '@/types/searchResult';

interface Search {
    setSelectedId: Dispatch<SetStateAction<number | undefined>>;
}

const search = async (query: string | null) => {
  if (typeof query !== "string") return Promise.resolve(null);
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  return await response.json() as SearchResult[]
}

export const Search = ({ setSelectedId }: Search) => {
    const [searchValue, setSearchValue] = React.useState<string>("");
    const debouncedSearchValue = useDebounce(searchValue, 1000);

  const {data} = useQuery(["search", debouncedSearchValue], () => search(searchValue))

  return (
    <>
      <div>
        <input value={searchValue} onChange={({currentTarget: {value}}) => setSearchValue(value)} />
      </div>
      {data && data.map(result => <button key={result.id} onClick={() => setSelectedId(result.id)}>{result.name}</button>)}
    </>
  );
};

