import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { decrypt } from "@/app/utils/encrypt-data";
import { getUserEmailFromCookie } from "@/app/utils/getUserEmail";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // Get JWT from cookie manually (use request.headers)
  const cookieHeader = req.headers.get("cookie") || "";
  const email = getUserEmailFromCookie(cookieHeader);
  if (!email) {
      return NextResponse.redirect(new URL("/welcome", process.env.NEXT_PUBLIC_API_URL));
  }

  if (!code || !email) return new Response("Missing code or email", { status: 400 });

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
  console.log("STRAVA AUTHORIZATION RESPONSE")
  console.log(data)
    /* Response example:
    { 
      "token_type": "Bearer",
      "expires_at": 1562908002,
      "expires_in": 21600,
      "refresh_token": "REFRESHTOKEN",
      "access_token": "ACCESSTOKEN",
      "athlete": {
                  "id": 123456,
                  "username": "MeowTheCat",
                  "resource_state": 2,
                  "firstname": "Meow",
                  "lastname": "TheCat",
                  "city": "",
                  "state": "",
                  "country": null,
                  ...
        }
    } */

  const existing = await db
            .collection("users")
            .findOne({ stravaUserId: data.athlete.id });
  
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
  const res = await fetch("/api/strava/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  console.log("WEBHOOK SUBSCRIPTION")
  console.log(res.json())

  return NextResponse.redirect(
    new URL(
      `dashboard/steps`,
      process.env.NEXT_PUBLIC_API_URL
    )
  );}
