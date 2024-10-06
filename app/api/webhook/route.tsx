import { getActivity, getActivityPhotos, getActivityStreams } from "@/lib/strava";

interface Webhook {
  aspect_type: "update" | "create" | "delete";
  event_time: number;
  object_id: number; //activty id
  object_type: string;
  owner_id: number; //strava user id
  subscription_id: number;
  updates: {};
}


export async function POST(request: Request) {
  const webhook_data = await request.json();
  console.log("webhook event received!", webhook_data);
  const activity_id = webhook_data["object_id"]
  const activity = await getActivity(Number(activity_id));
  const streams = await getActivityStreams(Number(activity_id));
  const photos = await getActivityPhotos(Number(activity_id));

  console.log(streams)
  console.log(photos)
  console.log(activity)

  return new Response("EVENT_RECEIVED", {
    status: 200,
  });
}












export async function GET(request: Request) {
  console.log(request.url);
  const { searchParams } = new URL(request.url);
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = "STRAVA";
  // Parses the query params
  let mode = searchParams.get("hub.mode");
  let token = searchParams.get("hub.verify_token");
  let challenge = searchParams.get("hub.challenge");
  // Checks if a token and mode is in the query string of the request
  console.log(mode);
  console.log(token);
  console.log(challenge);

  if (mode && token) {
    // Verifies that the mode and token sent are valid
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      console.log({ "hub.challenge": challenge });
      return Response.json({ "hub.challenge": challenge });
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      return new Response("FORBIDDEN", {
        status: 403,
      });
    }
  }
}
