import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Spinner } from '@/components/Spinner';
import cx from 'classnames';

interface AutocompleteInput<T> {
  value: string;
  onValueChange: (value: string) => void;
  handleSelect: (suggestion: Suggestion<T>) => void;
  handleClose: VoidFunction;
  handleFocus?: VoidFunction;
  placeholder?: string;
  suggestions?: Suggestion<T>[];
  isLoading?: boolean;
}

interface Suggestion<T> {
  label: string;
  value: T;
}

export const AutocompleteInput = <T,>({
  value,
  onValueChange,
  handleSelect,
  handleClose,
  handleFocus,
  suggestions = [],
  placeholder,
  isLoading = false,
}: AutocompleteInput<T>) => {
  const ref = useRef<HTMLDivElement>(null);
  const [highlightedSelection, setHighlightedSelection] = useState(0);

  const selectItem = useCallback(
    (suggestion: Suggestion<T>) => {
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
    <div className="relative w-96" ref={ref}>
      <div className="relative w-full">
        <input
          className="text-black p-2 rounded min-w-full"
          value={value}
          onChange={({ currentTarget: { value } }) => onValueChange(value)}
          onFocus={() => handleFocus?.()}
          placeholder={placeholder}
        />
        {isLoading && (
          <Spinner className="absolute text-black text-xl right-2 top-2.5" />
        )}
      </div>
      <div className="absolute bg-white text-black mt-0.5 rounded w-full shadow-xl">
        {suggestions?.map((suggestion, index) => (
          <div
            key={String(suggestion.value)}
            className={cx(
              'p-2 select-none cursor-pointer rounded hover:bg-neutral-200',
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
    </div>
  );
};
