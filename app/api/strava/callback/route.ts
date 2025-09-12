import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const email = url.searchParams.get("email");

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

  return Response.redirect("/dashboard", 302);
}
