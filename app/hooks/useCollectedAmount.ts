"use client";
import fetchFromApi from "../services/api-clent"

export async function useCollectedAmount() {
  return fetchFromApi("collected-amount");
}