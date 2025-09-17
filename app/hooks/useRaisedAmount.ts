"use client";

import { useState, useEffect } from "react";
import fetchFromApi from "../services/api-client-base";

interface RaisedAmountResponse {
  amount: number;
}

export default function useRaisedAmount(url: string) {
  const [data, setData] = useState<RaisedAmountResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = `get-amount?url=${encodeURIComponent(url)}`;
        const result = await fetchFromApi<RaisedAmountResponse>(endpoint, { method: "GET" });
        if (isMounted) {
          setData(result);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch raised amount");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
