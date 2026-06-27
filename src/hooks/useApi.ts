"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

interface UseApiOptions<T> {
  url: string;
  autoFetch?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mutate: (method: "POST" | "PATCH" | "DELETE", body?: unknown) => Promise<T | null>;
}

export function useApi<T>({ url, autoFetch = true, onSuccess, onError }: UseApiOptions<T>): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(errData.error || "Request failed");
      }

      const result = await res.json();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  }, [url, onSuccess, onError]);

  const mutate = useCallback(
    async (method: "POST" | "PATCH" | "DELETE", body?: unknown): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: "Request failed" }));
          throw new Error(errData.error || "Request failed");
        }

        const result = await res.json();
        setData(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [url]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, isLoading, error, refetch: fetchData, mutate };
}
