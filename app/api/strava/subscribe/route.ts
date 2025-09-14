// app/api/strava/subscribe/route.ts (App Router)
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { decrypt } from "@/app/utils/encrypt-data";

export async function POST(req: Request) {
  console.log("Received subscription request");
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("hike");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user || !user.stravaClientId || !user.stravaClientSecret) {
      return NextResponse.json({ error: "User missing Strava credentials" }, { status: 400 });
    }

    const formData = new URLSearchParams();
    console.log("Preparing subscription with client ID:", user.stravaClientId);
    console.log("Using callback URL:", `${process.env.NEXT_PUBLIC_API_URL}/api/webhook`);
    console.log("Using verify token:", process.env.VERIFY_STRAVA_TOKEN);
    console.log("Decrypting client secret");
    console.log("Decrypted client secret:", decrypt(user.stravaClientSecret).slice(0, 4) + "****");
    
    formData.append("client_id", user.stravaClientId);
    formData.append("client_secret", decrypt(user.stravaClientSecret));
    formData.append("callback_url", `${process.env.NEXT_PUBLIC_API_URL}/api/webhook`);
    // @ts-ignore
    formData.append("verify_token", process.env.VERIFY_STRAVA_TOKEN);

    const response = await fetch("https://www.strava.com/api/v3/push_subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await response.json();
    console.log("Strava subscription response:", data);

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ message: "Subscription created", data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
