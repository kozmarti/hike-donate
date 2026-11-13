import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { decrypt } from "@/app/utils/encrypt-data";
import { getSessionUser } from "@/lib/session";
import { createStravaSubscription } from "@/lib/strava-subscription";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  const session = getSessionUser(req);
  if (!session) {
    return NextResponse.redirect(new URL("/welcome", process.env.NEXT_PUBLIC_API_URL));
  }
  const email = session.email;

  // User denied access on Strava, or Strava returned an error
  if (url.searchParams.get("error") || !code) {
    return NextResponse.redirect(new URL("dashboard/step", process.env.NEXT_PUBLIC_API_URL));
  }

  const client = await clientPromise;
  const db = client.db("hike");
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ email });
  if (!user || !user.stravaClientId || !user.stravaClientSecret) {
    return new Response("User missing Strava credentials", { status: 400 });
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: user.stravaClientId,
      client_secret: decrypt(user.stravaClientSecret),
      code,
      grant_type: "authorization_code",
    }),
  });

  const data = await tokenRes.json();
  /* Response shape: { token_type, expires_at, expires_in, refresh_token, access_token, athlete: { id, ... } } */
  if (!tokenRes.ok || !data?.athlete?.id || !data?.refresh_token) {
    console.error("Strava token exchange failed:", tokenRes.status, data?.message ?? data?.errors);
    return new Response("Strava authorization failed. Check your Client ID and Secret and try again.", { status: 400 });
  }

  const existing = await usersCollection.findOne({ stravaUserId: data.athlete.id, email: { $ne: email } });
  if (existing) {
    return new Response(
      JSON.stringify({ error: "❌ StravaUser already used by another user." }),
      { status: 400 }
    );
  }

  await usersCollection.updateOne(
    { email },
    {
      $set: {
        stravaUserId: data.athlete.id,
        refreshToken: data.refresh_token,
      },
    }
  );

  const subscription = await createStravaSubscription({
    stravaClientId: user.stravaClientId,
    stravaClientSecret: user.stravaClientSecret,
  });
  if (!subscription.ok) {
    // Not fatal: e.g. a subscription already exists for this Strava app
    console.error("Strava subscription failed:", subscription.status, subscription.data);
  }

  return NextResponse.redirect(new URL("dashboard/step", process.env.NEXT_PUBLIC_API_URL));
}
