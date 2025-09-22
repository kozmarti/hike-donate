import {
  getActivity,
  getActivityPhotos,
  getActivityStreams,
} from "@/lib/strava";
import clientPromise from "@/lib/mongodb";
import { get_last_distance } from "@/app/utils/calculation_functions_server";
import { extractData } from "@/app/utils/transform_data";
import { Activity } from "@/app/entities/Activity";
import { decrypt } from "@/app/utils/encrypt-data";

interface Webhook {
  aspect_type: "update" | "create" | "delete";
  event_time: number;
  object_id: number; //activty id
  object_type: string;
  owner_id: number; //strava user id
  subscription_id: number;
  updates: { "title": string };
}

export async function POST(request: Request) {
  const webhook_data: Webhook = await request.json();
  console.log("webhook event received!", webhook_data);

  if (webhook_data.aspect_type !== "update") {
    return new Response("Event out of scope", {
      status: 200,
    });
  }
  else {
    try {
      const client = await clientPromise;
      const db = client.db("hike");
      const user = await db
        .collection("users").findOne({
          stravaUserId: webhook_data.owner_id,
          projectName: webhook_data.updates["title"],
        });
        console.log("USER", user)
      if (!user) {
        return new Response("Project name or strava user out of scope", {
          status: 200,
        });
      }

      console.log("Activity event in scope")
      const activity_id: number = webhook_data.object_id;
      const activity_strava = await getActivity(Number(activity_id), user.clientId, decrypt(user.clientSecret), user.refresh_token);
      const streams_strava = await getActivityStreams(Number(activity_id), user.clientId, decrypt(user.clientSecret), user.refresh_token);
      const photos_strava = await getActivityPhotos(Number(activity_id), user.clientId, decrypt(user.clientSecret), user.refresh_token);
      const last_distance = await get_last_distance(activity_strava.start_date_local, webhook_data.owner_id, webhook_data.updates["title"]);
      console.log("Last activity distance to pass forward", last_distance);
      {/*
  if (
    webhook_data.aspect_type == "update" &&
    webhook_data.subscription_id ==
      parseInt((process.env.SUBSCRIPTION_ID ??= "")) &&
    webhook_data.owner_id == parseInt((process.env.STRAVA_USER_ID ??= "")) &&
    // @ts-ignore
    webhook_data.updates["title"] == process.env.STRAVA_PROJECT_NAME
  ) {
  */}
      const activity_extracted: Activity = extractData(
        activity_strava,
        photos_strava,
        streams_strava,
        last_distance
      );
      console.log("Activity data extracted", activity_extracted)
      const activity = await db
        .collection("activities")
        .updateOne(
          { strava_activity_id: activity_id },
          { $set: activity_extracted },
          { upsert: true }
        );
      console.log("Activity upserted", activity);
      return new Response("Activity upserted", {
        status: 200,
      });

    } catch (e) {
      console.log(e)
      //@ts-ignore
      return new Response(e.message || "Unknown error", {
        status: 400,
      });
    }
  }
}


export async function GET(request: Request) {
  // this is the endpoint for verifying the webhook subscription
  // it is called by Strava when you create a new webhook subscription
  // and it should respond with the challenge token sent by Strava

  console.log(request.url);
  const { searchParams } = new URL(request.url);
  const VERIFY_STRAVA_TOKEN = process.env.VERIFY_STRAVA_TOKEN;

  let mode = searchParams.get("hub.mode");
  let token = searchParams.get("hub.verify_token");
  let challenge = searchParams.get("hub.challenge");

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_STRAVA_TOKEN) {
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
