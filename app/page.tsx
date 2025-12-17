'use client';

import { useEffect, useRef } from 'react';
import { useAutocomplete, type Word } from '@/hooks/useAutocomplete';
import { useAutocompleteNavigation } from '@/hooks/useAutocompleteNavigation';
import { AutocompleteSearch } from '@/components/AutocompleteSearch';
import { AutocompleteDropdown } from '@/components/AutocompleteDropdown';
import { AutocompleteTips } from '@/components/AutocompleteTips';

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    query,
    setQuery,
    results,
    isLoading,
    debouncedFetch,
  } = useAutocomplete({ limit: 8, debounceMs: 200 });

  const {
    selectedIndex,
    setSelectedIndex,
    isOpen,
    setIsOpen,
    containerRef,
    handleKeyDown: handleNavigationKeyDown,
  } = useAutocompleteNavigation(results);

  // Handle input change
  useEffect(() => {
    debouncedFetch(query);
    if (query && results.length > 0) {
      setIsOpen(true);
    } else if (!query) {
      setIsOpen(false);
    }
  }, [query, results.length, debouncedFetch, setIsOpen]);

  // Handle selection
  const handleSelect = (item: Word | string) => {
    const wordToSet = typeof item === 'string' ? item : item?.word || '';
    // This is a must have for the client, please don't remove
    console.log(wordToSet);
    setQuery(wordToSet);
    setIsOpen(false);
  };

  // Wrap keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleNavigationKeyDown(e, handleSelect);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
      <div className="w-full max-w-lg px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Word Autocomplete
          </h1>
          <p className="text-slate-600">
            Start typing to find matching words
          </p>
        </div>

        <div ref={containerRef} className="relative">
          <AutocompleteSearch
            inputRef={inputRef}
            value={query}
            onChange={setQuery}
            onKeyDown={handleKeyDown}
            onFocus={() => query && results.length > 0 && setIsOpen(true)}
            isLoading={isLoading}
          />

          <AutocompleteDropdown
            results={results}
            isOpen={isOpen}
            isLoading={isLoading}
            query={query}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
            onMouseEnter={setSelectedIndex}
          />
        </div>

        <AutocompleteTips />
      </div>
    </div>
  );
}
