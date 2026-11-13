import { decrypt } from "@/app/utils/encrypt-data";

export interface StravaAppCredentials {
  stravaClientId: string;
  stravaClientSecret: string; // encrypted, as stored in the users collection
}

/** Registers this app's webhook endpoint with the user's Strava API application. */
export async function createStravaSubscription(user: StravaAppCredentials) {
  const formData = new URLSearchParams();
  formData.append("client_id", user.stravaClientId);
  formData.append("client_secret", decrypt(user.stravaClientSecret));
  formData.append("callback_url", `${process.env.NEXT_PUBLIC_API_URL}/api/webhook`);
  formData.append("verify_token", process.env.VERIFY_STRAVA_TOKEN ?? "");

  const response = await fetch("https://www.strava.com/api/v3/push_subscriptions", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}
