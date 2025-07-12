"use client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const userId = process.env.NEXT_PUBLIC_STRAVA_USER_ID;
const projectName = process.env.NEXT_PUBLIC_STRAVA_PROJECT_NAME;

export default async function fetchFromApi<T>(endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
  }
): Promise<T> {
  const { method = "GET", body } = options || {};
  const res = await fetch(`${apiUrl}/api/user/${userId}/project/${projectName}/${endpoint}`, {
    method: method,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch ${endpoint}: ${res.status} ${errorText}`);
  }

  return res.json() as Promise<T>;}