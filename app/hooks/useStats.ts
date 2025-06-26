"use client";
import fetchFromApi from "../services/api-clent"

export async function useStats() {
  return fetchFromApi("stats");
}