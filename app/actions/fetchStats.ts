"use client";
export async function fetchStatsHook() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const userId = process.env.NEXT_PUBLIC_STRAVA_USER_ID;
  const projectName = process.env.NEXT_PUBLIC_STRAVA_PROJECT_NAME;

  const res = await fetch(`${apiUrl}/api/user/${userId}/project/${projectName}/stats`, {
    method: "GET",
  });

  if (!res.ok) {
    const errorText = await res.text(); // optional: log more info
    throw new Error(`Failed to fetch activities: ${res.status} ${errorText}`);
  }

  
  return await res.json();
}