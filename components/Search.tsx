import { useDebounce } from '@/hooks/useDebounce';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useQuery } from 'react-query';
import { SearchResult } from '@/types/searchResult';
import { AutocompleteInput } from '@/components/AutocompleteInput';

interface Search {
  setSelected: Dispatch<
    SetStateAction<{ name: string; id: number; rating: number } | undefined>
  >;
}

const search = async (query: string | null) => {
  if (typeof query !== 'string') return Promise.resolve(null);
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  return (await response.json()) as SearchResult[];
};

export const Search = ({ setSelected }: Search) => {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const [disableAutocomplete, setDisableAutocomplete] = useState(false);

  const { data, isLoading } = useQuery(
    ['search', debouncedSearchValue],
    () => search(searchValue),
    {
      keepPreviousData: true,
      enabled: !!searchValue && !disableAutocomplete && searchValue.length > 3,
    }
  );

  return (
    <AutocompleteInput
      value={searchValue}
      onValueChange={(value) => {
        setSearchValue(value);
        setDisableAutocomplete(false);
      }}
      handleClear={() => {
        setSearchValue('');
      }}
      handleSelect={(suggestion) => {
        setDisableAutocomplete(true);
        setSearchValue(suggestion.label);
        setSelected({
          name: suggestion.label,
          id: suggestion.value,
          rating: suggestion.context.rating,
        });
      }}
      suggestions={
        disableAutocomplete || !searchValue
          ? []
          : data
              ?.map((result) => ({
                value: result.id,
                label: result.name,
                context: {
                  rating: result.vote_average,
                },
              }))
              .slice(0, 10)
      }
      isLoading={
        isLoading ||
        (debouncedSearchValue !== searchValue && !disableAutocomplete)
      }
      handleClose={() => setDisableAutocomplete(true)}
      handleFocus={() => setDisableAutocomplete(false)}
      placeholder="Enter a TV show..."
    />
  );
};
