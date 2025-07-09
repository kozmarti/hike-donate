import {
  getActivity,
  getActivityPhotos,
  getActivityStreams,
} from "@/lib/strava";
import clientPromise from "@/lib/mongodb";
import { get_last_distance } from "@/app/utils/calculation_functions_server";
import { extract_data} from "@/app/utils/transform_data";
import { Activity } from "@/app/entities/Activity";

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
  const webhook_data: Webhook = await request.json();
  console.log("webhook event received!", webhook_data);

  // in scope if :
  // ubscription id, aspect type, strava user, object type and project name matches

  if (
    webhook_data.aspect_type == "update" &&
    webhook_data.subscription_id ==
      parseInt((process.env.SUBSCRIPTION_ID ??= "")) &&
    webhook_data.owner_id == parseInt((process.env.STRAVA_USER_ID ??= "")) &&
    // @ts-ignore
    webhook_data.updates["title"] == process.env.STRAVA_PROJECT_NAME
  ) {
    console.log("Activity event in scope")
    const activity_id: number = webhook_data.object_id;
    const activity_strava = await getActivity(Number(activity_id));
    const streams_strava = await getActivityStreams(Number(activity_id));
    const photos_strava = await getActivityPhotos(Number(activity_id));
    const last_distance = await get_last_distance(activity_strava.start_date_local);
    console.log("Last activity distance to pass forward", last_distance);

    const activity_extracted: Activity = extract_data(
      activity_strava,
      photos_strava,
      streams_strava,
      last_distance
    );
    console.log("Activity data extracted", activity_extracted)

    try {
      const client = await clientPromise;
      const db = client.db("hike");
      const activity = await db
        .collection("activities")
        .updateOne(
          { strava_activity_id: activity_id },
          { $set: activity_extracted },
          { upsert: true }
        );
      console.log("Activity upserted", activity);
    } catch (e) {
      console.error(e);
    }
  }

  return new Response("EVENT_RECEIVED", {
    status: 200,
  });
}


export async function GET(request: Request) {
  // this is the endpoint for verifying the webhook subscription
  // it is called by Strava when you create a new webhook subscription
  // and it should respond with the challenge token sent by Strava

  console.log(request.url);
  const { searchParams } = new URL(request.url);
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  let mode = searchParams.get("hub.mode");
  let token = searchParams.get("hub.verify_token");
  let challenge = searchParams.get("hub.challenge");

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      console.log({ "hub.challenge": challenge });
      return Response.json({ "hub.challenge": challenge });
    } else {
      return new Response("FORBIDDEN", {
        status: 403,
      });
    }
  }
}
