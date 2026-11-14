// Reads the login cookie, so it must never be pre-rendered at build time
export const dynamic = "force-dynamic";

import clientPromise from "@/lib/mongodb";
import { getSessionUser } from "@/lib/session";

export async function GET(req: Request) {
  /* Authorizes reading strava account activities of user by this App*/
  const session = getSessionUser(req);
  if (!session) {
    // Browser navigation, so redirect to login rather than returning JSON
    return Response.redirect(new URL("/welcome", req.url), 302);
  }

  const client = await clientPromise;
  const db = client.db("hike");
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ email: session.email });
  if (!user || !user.stravaClientId || !user.stravaClientSecret) {
    return new Response("User missing Strava credentials", { status: 400 });
  }

  const params = new URLSearchParams({
    client_id: String(user.stravaClientId),
    response_type: "code",
    redirect_uri: process.env.STRAVA_REDIRECT_URI ?? "",
    approval_prompt: "auto",
    scope: "activity:read_all",
  });

  return Response.redirect(`https://www.strava.com/oauth/authorize?${params.toString()}`, 302);
}
