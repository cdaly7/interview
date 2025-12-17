import React from 'react';

interface AutocompleteSearchProps {
  inputRef: React.RefObject<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  isLoading: boolean;
}

export function AutocompleteSearch({
  inputRef,
  value,
  onChange,
  onKeyDown,
  onFocus,
  isLoading,
}: AutocompleteSearchProps) {
  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        placeholder="Search words..."
        className="w-full px-5 py-3 text-lg border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        autoComplete="off"
      />

      {isLoading && (
        <div className="absolute right-4 top-3.5">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
}
