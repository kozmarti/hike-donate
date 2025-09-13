import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  /* Authorizes reading strava account activities of user by this App*/
  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  if (!email) return new Response("Missing email", { status: 400 });

  const client = await clientPromise;
  const db = client.db("hike");
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ email });
  if (!user || !user.stravaClientId || !user.stravaClientSecret) {
    return new Response("User missing Strava credentials", { status: 400 });
  }

  const redirectUri = process.env.STRAVA_REDIRECT_URI;
  const stravaUrl = `https://www.strava.com/oauth/authorize?client_id=${user.stravaClientId}&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=activity:read_all`;

  return Response.redirect(stravaUrl, 302);
}
