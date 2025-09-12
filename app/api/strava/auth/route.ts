import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;
  if (!email) return res.status(400).send("Missing email");

  const client = await clientPromise;
  const db = client.db("hike");
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ email: email.toString() });
  if (!user || !user.stravaClientId || !user.stravaClientSecret) {
    return res.status(400).send("User missing Strava credentials");
  }

  const redirectUri = process.env.STRAVA_REDIRECT_URI;
  const url = `https://www.strava.com/oauth/authorize?client_id=${user.stravaClientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=auto&scope=activity:read_all`;
  res.redirect(url);
}
