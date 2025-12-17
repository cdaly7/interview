import { renderHook, act, waitFor } from '@testing-library/react';
import { useAutocomplete } from '@/hooks/useAutocomplete';

describe('useAutocomplete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useAutocomplete());

      expect(result.current.query).toBe('');
      expect(result.current.results).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should accept custom options', () => {
      const { result } = renderHook(() =>
        useAutocomplete({ limit: 10, debounceMs: 300 })
      );

      expect(result.current).toBeDefined();
    });
  });

  describe('Query Management', () => {
    it('should update query state', () => {
      const { result } = renderHook(() => useAutocomplete());

      act(() => {
        result.current.setQuery('test');
      });

      expect(result.current.query).toBe('test');
    });

    it('should clear results when query is empty', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [{ word: 'test' }],
      });

      const { result } = renderHook(() => useAutocomplete());

      act(() => {
        result.current.fetchResults('test');
      });

      await waitFor(() => {
        expect(result.current.results.length).toBeGreaterThan(0);
      });

      // When calling with empty query, results should be cleared
      act(() => {
        result.current.fetchResults('');
      });

      // The hook clears results immediately when query is empty
      expect(result.current.results).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('API Calls', () => {
    it('should fetch results from API', async () => {
      const mockResults = [
        { word: 'test', frequency: 10 },
        { word: 'testing', frequency: 5 },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      });

      const { result } = renderHook(() => useAutocomplete({ limit: 5 }));

      act(() => {
        result.current.debouncedFetch('test');
      });

      await waitFor(() => {
        expect(result.current.results).toEqual(mockResults);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('query=test')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=5')
      );
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'Network error';
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => useAutocomplete());

      act(() => {
        result.current.debouncedFetch('test');
      });

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.results).toEqual([]);
      });
    });

    it('should handle non-ok response status', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const { result } = renderHook(() => useAutocomplete());

      act(() => {
        result.current.debouncedFetch('test');
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });

    it('should handle empty API response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      });

      const { result } = renderHook(() => useAutocomplete());

      act(() => {
        result.current.debouncedFetch('test');
      });

      await waitFor(() => {
        expect(result.current.results).toEqual([]);
      });
    });
  });

  describe('Caching', () => {
    it('should cache results for the same query and limit', async () => {
      const mockResults = [{ word: 'test' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      });

      const { result } = renderHook(() => useAutocomplete({ limit: 8 }));

      // First fetch
      act(() => {
        result.current.debouncedFetch('test');
      });

      await waitFor(() => {
        expect(result.current.results).toEqual(mockResults);
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second fetch with same query
      act(() => {
        result.current.debouncedFetch('test');
      });

      await waitFor(() => {
        expect(result.current.results).toEqual(mockResults);
      });

      // Should not make another API call
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should have different cache entries for different queries', async () => {
      const mockResults1 = [{ word: 'test' }];
      const mockResults2 = [{ word: 'hello' }];

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResults1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResults2,
        });

      const { result } = renderHook(() => useAutocomplete());

      // First fetch
      act(() => {
        result.current.debouncedFetch('test');
      });

      await waitFor(() => {
        expect(result.current.results).toEqual(mockResults1);
      });

      // Second fetch with different query
      act(() => {
        result.current.debouncedFetch('hello');
      });

      await waitFor(() => {
        expect(result.current.results).toEqual(mockResults2);
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should have separate cache for different limits', async () => {
      const mockResults1 = [{ word: 'test' }];
      const mockResults2 = [{ word: 'test' }, { word: 'testing' }];

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResults1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResults2,
        });

      const { result: result1 } = renderHook(() => useAutocomplete({ limit: 1 }));
      const { result: result2 } = renderHook(() => useAutocomplete({ limit: 2 }));

      // First fetch with limit 1
      act(() => {
        result1.current.debouncedFetch('test');
      });

      await waitFor(() => {
        expect(result1.current.results).toEqual(mockResults1);
      });

      // Second fetch with limit 2
      act(() => {
        result2.current.debouncedFetch('test');
      });

      await waitFor(() => {
        expect(result2.current.results).toEqual(mockResults2);
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should invalidate cache after TTL expires', async () => {
      jest.useFakeTimers();

      const mockResults = [{ word: 'test' }];

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResults,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResults,
        });

      const { result } = renderHook(() =>
        useAutocomplete({ limit: 8, cacheTTL: 1000 })
      );

      // First fetch - should hit API
      act(() => {
        result.current.fetchResults('test');
      });

      await waitFor(() => {
        expect(result.current.results).toEqual(mockResults);
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second fetch immediately - should use cache
      act(() => {
        result.current.fetchResults('test');
      });

      await waitFor(() => {
        expect(result.current.results).toEqual(mockResults);
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Advance time past TTL (1000ms)
      act(() => {
        jest.advanceTimersByTime(1100);
      });

      // Third fetch after TTL - should hit API again
      act(() => {
        result.current.fetchResults('test');
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });

      jest.useRealTimers();
    });

    it('should not invalidate cache before TTL expires', async () => {
      jest.useFakeTimers();

      const mockResults = [{ word: 'test' }];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResults,
      });

      const { result } = renderHook(() =>
        useAutocomplete({ limit: 8, cacheTTL: 5000 })
      );

      // First fetch
      act(() => {
        result.current.fetchResults('test');
      });

      await waitFor(() => {
        expect(result.current.results).toEqual(mockResults);
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Advance time less than TTL
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Second fetch within TTL - should use cache
      act(() => {
        result.current.fetchResults('test');
      });

      await waitFor(() => {
        expect(result.current.results).toEqual(mockResults);
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });

    it('should expose cacheTTL value', () => {
      const { result } = renderHook(() =>
        useAutocomplete({ cacheTTL: 30000 })
      );

      expect(result.current.cacheTTL).toBe(30000);
    });

    it('should use default cacheTTL of 30000ms', () => {
      const { result } = renderHook(() => useAutocomplete());

      expect(result.current.cacheTTL).toBe(30000);
    });
  });

  describe('Debouncing', () => {
    it('should debounce API calls', async () => {
      jest.useFakeTimers();
      
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [{ word: 'test' }],
      });

      const { result } = renderHook(() => useAutocomplete({ debounceMs: 200 }));

      // Make multiple calls
      act(() => {
        result.current.debouncedFetch('t');
        result.current.debouncedFetch('te');
        result.current.debouncedFetch('tes');
        result.current.debouncedFetch('test');
      });

      // No API call yet
      expect(global.fetch).not.toHaveBeenCalled();

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Should only make one API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      jest.useRealTimers();
    });
  });

  describe('Loading State', () => {
    it('should set loading state during fetch', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => [{ word: 'test' }],
                }),
              100
            )
          )
      );

      const { result } = renderHook(() => useAutocomplete());

      act(() => {
        result.current.debouncedFetch('test');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Direct Fetch vs Debounced Fetch', () => {
    it('should have both direct and debounced fetch methods', () => {
      const { result } = renderHook(() => useAutocomplete());

      expect(typeof result.current.fetchResults).toBe('function');
      expect(typeof result.current.debouncedFetch).toBe('function');
    });
  });

  describe('Cache Access', () => {
    it('should expose cache for inspection', async () => {
      const mockResults = [{ word: 'test' }];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      });

      const { result } = renderHook(() => useAutocomplete({ limit: 8 }));

      act(() => {
        result.current.fetchResults('test');
      });

      await waitFor(() => {
        expect(result.current.cache.has('test:8')).toBe(true);
        const cacheEntry = result.current.cache.get('test:8');
        expect(cacheEntry?.data).toEqual(mockResults);
        expect(typeof cacheEntry?.timestamp).toBe('number');
      });
    });
  });
});
