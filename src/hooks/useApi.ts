import { useState, useEffect } from 'react';
import { fetchAPI } from '../utils/api';

export function useApi<T>(endpoint: string, enabled: boolean = true) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchAPI<T>(endpoint);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [endpoint, enabled]);

  return { data, loading, error };
}