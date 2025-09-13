import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // Get JWT from cookie manually (use request.headers)
  const cookieHeader = req.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.redirect(new URL("/welcome", process.env.NEXT_PUBLIC_API_URL));
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
  } catch {
    return NextResponse.redirect(new URL("/welcome", process.env.NEXT_PUBLIC_API_URL));
  }
  const email = payload.email;
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
      client_secret: user.stravaClientSecret,
      code,
      grant_type: "authorization_code",
    }),
  });

  const data = await tokenRes.json();

  await usersCollection.updateOne(
    { email },
    {
      $set: {
        stravaUserId: data.athlete.id,
        refreshToken: data.refresh_token,
      },
    }
  );

  return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_API_URL));
}
