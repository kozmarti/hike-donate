"use client";
import { Activity } from "../entities/Activity";
import fetchFromApi from "../services/api-client"


export async function useActivities(): Promise<Activity[]> {
  return fetchFromApi<Activity[]>("activities");
}