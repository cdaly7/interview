import { useState, useCallback, useRef, useEffect } from 'react';

export interface Word {
  word?: string;
  frequency?: number;
  [key: string]: any;
}

interface CacheEntry {
  data: Word[];
  timestamp: number;
}

interface UseAutocompleteOptions {
  limit?: number;
  debounceMs?: number;
  cacheTTL?: number; // Time-to-live in milliseconds
}

export function useAutocomplete(options: UseAutocompleteOptions = {}) {
  const { limit = 8, debounceMs = 200, cacheTTL = 30000 } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  
  // Fetch from API
  const fetchFromApi = useCallback(
    async (searchQuery: string): Promise<Word[]> => {
      const response = await fetch(
        `https://autocomplete-lyart.vercel.app/api/words?query=${encodeURIComponent(
          searchQuery
        )}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return response.json();
    },
    [limit]
  );

  // Fetch with caching
  const fetchResults = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setError(null);
        return;
      }

      const cacheKey = `${searchQuery}:${limit}`;
      const now = Date.now();

      // Check cache first
      if (cacheRef.current.has(cacheKey)) {
        const cacheEntry = cacheRef.current.get(cacheKey)!;
        const cacheAge = now - cacheEntry.timestamp;

        // If cache is still valid (within TTL), use it
        if (cacheAge < cacheTTL) {
          setResults(cacheEntry.data);
          setError(null);
          return;
        } else {
          // Cache expired, remove it
          cacheRef.current.delete(cacheKey);
        }
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchFromApi(searchQuery);

        // Store in cache with timestamp
        cacheRef.current.set(cacheKey, {
          data: data || [],
          timestamp: now,
        });

        setResults(data || []);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFromApi, limit, cacheTTL]
  );

  // Debounced fetch
  const debouncedFetch = useCallback(
    (searchQuery: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        fetchResults(searchQuery);
      }, debounceMs);
    },
    [fetchResults, debounceMs]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    debouncedFetch,
    fetchResults,
    cache: cacheRef.current,
    cacheTTL,
  };
}
