import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Spinner } from '@/components/Spinner';
import cx from 'classnames';
import { MdClear } from 'react-icons/md';

interface AutocompleteInput<T, C> {
  value: string;
  onValueChange: (value: string) => void;
  handleSelect: (suggestion: Suggestion<T, C>) => void;
  handleClose: VoidFunction;
  handleFocus?: VoidFunction;
  handleClear: VoidFunction;
  placeholder?: string;
  suggestions?: Suggestion<T, C>[];
  isLoading?: boolean;
}

interface Suggestion<T, C> {
  label: string;
  value: T;
  context: C;
}

export const AutocompleteInput = <T, C>({
  value,
  onValueChange,
  handleSelect,
  handleClose,
  handleFocus,
  handleClear,
  suggestions = [],
  placeholder,
  isLoading = false,
}: AutocompleteInput<T, C>) => {
  const ref = useRef<HTMLDivElement>(null);
  const [highlightedSelection, setHighlightedSelection] = useState(0);

  const selectItem = useCallback(
    (suggestion: Suggestion<T, C>) => {
      handleSelect(suggestion);
      ref.current?.blur();
    },
    [handleSelect]
  );

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) {
      return;
    }

    const handleClick = (event: globalThis.MouseEvent) => {
      if (!currentRef.contains(event.target as Node)) {
        handleClose();
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedSelection((prev) =>
            Math.min(prev + 1, suggestions?.length - 1)
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedSelection((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          event.preventDefault();
          selectItem(suggestions[highlightedSelection]);
          break;
        case 'Escape':
          event.preventDefault();
          handleClose();
          break;
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    handleClose,
    handleSelect,
    highlightedSelection,
    selectItem,
    suggestions,
    suggestions?.length,
  ]);

  useEffect(() => {
    setHighlightedSelection(0);
  }, [suggestions]);

  useEffect(() => {
    const highlightedSuggestion = document.getElementById(
      `suggestion-${highlightedSelection}`
    );

    highlightedSuggestion?.scrollIntoView(false);
  }, [highlightedSelection]);

  return (
    <div className="relative w-full px-2 max-w-lg" ref={ref}>
      <div className="relative w-full">
        <input
          className="text-black p-2 rounded min-w-full pr-20"
          value={value}
          onChange={({ currentTarget: { value } }) => onValueChange(value)}
          onFocus={() => handleFocus?.()}
          placeholder={placeholder}
        />
        {isLoading && (
          <Spinner className="absolute text-black text-xl right-12 top-2.5" />
        )}
      </div>
      <div className="absolute bg-white text-black mt-0.5 rounded w-4/6 md:w-full shadow-xl">
        {suggestions?.map((suggestion, index) => (
          <div
            key={String(suggestion.value)}
            className={cx(
              'p-2 select-none cursor-pointer rounded hover:bg-neutral-100',
              index === highlightedSelection && 'bg-neutral-200'
            )}
            onClick={() => {
              selectItem(suggestion);
            }}
            id={`suggestion-${index}`}
          >
            {suggestion.label}
          </div>
        ))}
      </div>
      <button
        className={cx(
          'absolute right-2 w-10 top-0 flex items-center justify-center bg-neutral-300 hover:bg-neutral-200 h-full rounded-r',
          !value && 'invisible'
        )}
        onClick={() => {
          handleClear();
        }}
      >
        <MdClear />
      </button>
    </div>
  );
};
