"use client";
import fetchFromApi from "../services/api-client"

interface LastActivityDistanceResponse {
  last_distance: number;
}
export async function useLastActivityDistance(startDateLocal: string): Promise<LastActivityDistanceResponse> {
  return fetchFromApi<LastActivityDistanceResponse>(`activities?start_date_local=${encodeURIComponent(startDateLocal)}`);
}