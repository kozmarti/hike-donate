import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, email } = req.query;
  if (!code || !email) return res.status(400).send("Missing code or email");

  const client = await clientPromise;
  const db = client.db("hike");
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ email: email.toString() });
  if (!user || !user.stravaClientId || !user.stravaClientSecret) {
    return res.status(400).send("User missing Strava credentials");
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
    { email: email.toString() },
    {
      $set: {
        stravaUserId: data.athlete.id,
        refreshToken: data.refresh_token,
      },
    }
  );

  res.redirect("/dashboard");
}
