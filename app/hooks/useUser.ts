"use client";

import { useState, useEffect } from "react";
import fetchFromApi from "../services/api-client-base";
import { User } from "../entities/User";

export default function useUser(stravaUserId?: string) {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint = "profile";

        if (stravaUserId) {
          endpoint += `?stravaUserId=${stravaUserId}`;
        }

        const result = await fetchFromApi<User>(endpoint, { method: "GET" });

        if (isMounted) {
          setData(result);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch user");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [stravaUserId]);

  return { data, loading, error };
}
