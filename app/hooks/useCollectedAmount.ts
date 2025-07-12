"use client";
import fetchFromApi from "../services/api-client"

interface CollectedAmountResponse {
  _id: string,
  date: string,
  amount: number
}

export async function useCollectedAmount(): Promise<CollectedAmountResponse[]> {
  return fetchFromApi<CollectedAmountResponse[]>("collected-amount");
}