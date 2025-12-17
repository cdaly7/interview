import React from 'react';
import { Word } from '@/hooks/useAutocomplete';

interface AutocompleteDropdownProps {
  results: Word[];
  isOpen: boolean;
  isLoading: boolean;
  query: string;
  selectedIndex: number;
  onSelect: (item: Word | string) => void;
  onMouseEnter: (index: number) => void;
}

export function AutocompleteDropdown({
  results,
  isOpen,
  isLoading,
  query,
  selectedIndex,
  onSelect,
  onMouseEnter,
}: AutocompleteDropdownProps) {
  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="absolute right-4 top-3.5">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-300 rounded-lg shadow-lg z-10 p-4 text-center text-slate-500">
        No results found
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
      {results.map((item, index) => {
        const displayWord =
          typeof item === 'string' ? item : item?.word || '';
        const displayFreq =
          typeof item === 'object' && item?.frequency ? item.frequency : '';

        return (
          <button
            key={`${displayWord}-${index}`}
            onClick={() => onSelect(item)}
            onMouseEnter={() => onMouseEnter(index)}
            className={`w-full text-left px-5 py-3 transition-colors ${
              selectedIndex === index
                ? 'bg-blue-500 text-white'
                : 'bg-white text-slate-900 hover:bg-slate-100'
            } first:rounded-t-lg last:rounded-b-lg border-b border-slate-200 last:border-b-0`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{displayWord}</span>
              {displayFreq && (
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    selectedIndex === index
                      ? 'bg-blue-400 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {displayFreq}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
