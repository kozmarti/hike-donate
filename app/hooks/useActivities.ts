"use client";
import fetchFromApi from "../services/api-clent"


export async function useActivities() {
  return fetchFromApi("activities");
}