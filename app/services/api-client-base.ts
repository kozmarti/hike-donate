"use client";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function fetchFromApi<T>(endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    stravaUserId?: string;
    projectName?: string;
  }
): Promise<T> {
  const { method = "GET", body } = options || {};
  const res = await fetch(`${apiUrl}/api/${endpoint}`, {
    method: method,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch ${endpoint}: ${res.status} ${errorText}`);
  }

  return res.json() as Promise<T>;}