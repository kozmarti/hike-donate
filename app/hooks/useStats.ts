"use client";
import fetchFromApi from "../services/api-client"
import { PhotoEntry } from "../utils/calculation_functions_client";

export interface StatsResponse {
  totalDistance: number;
  totalElevationGain: number;
  totalElevationLoss: number;
  totalMovingTimeHours: number;
  minAltitude: number;
  maxAltitude: number;
  timeElapsed: number;
  photosUrl: PhotoEntry [];
  coordinates: number[][];
  altitudes: number[];
  distance_by_day: number[][];
  coordinate_by_day: number[][];
  startHikeDate: Date;
  lastHikeDate: Date;
  distances: number[];
  altitude_by_day: number[][];
  distance_aggregated: number[];
  delta_distances: number[];
  delta_altitudes: number[];
};

export async function useStats(  stravaUserId?: string,
  projectName?: string
): Promise<StatsResponse> {
  return fetchFromApi<StatsResponse>("stats", {
    stravaUserId,
    projectName,
  });
}