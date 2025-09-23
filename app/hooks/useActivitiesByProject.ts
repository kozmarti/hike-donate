"use client";
import { useEffect, useState } from "react";
import { Activity } from "../entities/Activity";
import fetchFromApi from "../services/api-client"


export async function activityClient(stravaUserId: string,
  projectName: string
): Promise<Activity[]> {
  return fetchFromApi<Activity[]>("activity", {
    stravaUserId,
    projectName,
  });
}


export default function useActivitiesByProject(stravaUserId: string, projectName: string) {
  const [data, setData] = useState<Activity[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await activityClient(stravaUserId, projectName);
        if (isMounted) {
          setData(result);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch activities");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [stravaUserId, projectName]);

  return { data, loading, error };
}
