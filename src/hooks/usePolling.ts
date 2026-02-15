import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePollingOptions<T> {
  fetcher: () => Promise<T>;
  interval: number;
  enabled?: boolean;
}

interface UsePollingResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePolling<T>({ fetcher, interval, enabled = true }: UsePollingOptions<T>): UsePollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const doFetch = useCallback(async (showLoading: boolean = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const result = await fetcherRef.current();
      setData(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Fetch failed'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Main polling setup — re-runs when fetcher identity changes (e.g. date change)
  useEffect(() => {
    if (!enabled) return;

    doFetch(true);

    intervalRef.current = setInterval(() => doFetch(false), interval);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        doFetch(false);
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => doFetch(false), interval);
      } else {
        clearInterval(intervalRef.current);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [fetcher, interval, enabled, doFetch]);

  return { data, isLoading, error, refetch: () => doFetch(true) };
}
