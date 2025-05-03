"use server";

export async function fetchActivitiesHook() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = process.env.API_SECRET_TOKEN;
  const userId = process.env.STRAVA_USER_ID;
  const projectName = process.env.STRAVA_PROJECT_NAME;

  const res = await fetch(`${apiUrl}/api/user/${userId}/project/${projectName}/activities`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch stats");

  return await res.json();
}