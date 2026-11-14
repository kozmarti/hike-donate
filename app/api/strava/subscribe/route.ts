// app/api/strava/subscribe/route.ts (App Router)
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { requireUser } from "@/lib/session";
import { createStravaSubscription } from "@/lib/strava-subscription";

export async function POST(req: Request) {
  try {
    const session = requireUser(req);
    if (session instanceof Response) return session;

    const client = await clientPromise;
    const db = client.db("hike");
    const user = await db.collection("users").findOne({ email: session.email });
    if (!user || !user.stravaClientId || !user.stravaClientSecret) {
      return NextResponse.json({ error: "User missing Strava credentials" }, { status: 400 });
    }

    const result = await createStravaSubscription({
      stravaClientId: user.stravaClientId,
      stravaClientSecret: user.stravaClientSecret,
    });

    if (!result.ok) {
      console.error("Strava subscription failed:", result.status, result.data);
      return NextResponse.json({ error: "Failed to create Strava subscription" }, { status: result.status });
    }

    return NextResponse.json({ message: "Subscription created" });
  } catch (err: any) {
    console.error("Error creating Strava subscription:", err);
    return NextResponse.json({ error: "Failed to create Strava subscription" }, { status: 500 });
  }
}
