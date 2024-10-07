import {
  getActivity,
  getActivityPhotos,
  getActivityStreams,
} from "@/lib/strava";
import { Activity } from "../user/[strava_user_id]/project/[project_slug]/activities/route";
import clientPromise from "@/lib/mongodb";

interface Webhook {
  aspect_type: "update" | "create" | "delete";
  event_time: number;
  object_id: number; //activty id
  object_type: string;
  owner_id: number; //strava user id
  subscription_id: number;
  updates: {};
}

interface StreamStrava {
  type: string;
  data: []; //coordinates
  series_type: string;
  original_size: number;
  resolution: string;
}

interface Stream {
  latlng: [];
  altitude: [];
  distance: [];
}

interface Photo {
  unique_id: string;
  athlete_id: number;
  activity_id: number;
  activity_name: string;
  urls: {};
}

const extract_data = (
  activity_strava: any,
  photos_strava: any,
  streams_strava: any
) => {
  // @ts-ignore
  var streams_extracted: Stream = {};
  streams_strava.map((stream: StreamStrava) => {
    // @ts-ignore
    streams_extracted[stream.type] = stream.data;
  });
  const photo_urls: any = photos_strava.map(
    // @ts-ignore
    (photo: Photo) => photo.urls["5000"]
  );
  const delta_distances = streams_extracted["distance"].map(
    (d, index) =>
      Math.round((d - streams_extracted["distance"][index - 1]) * 10) / 10
  );
  delta_distances.shift();
  const delta_altitudes = streams_extracted["altitude"].map(
    (d, index) =>
      Math.round((d - streams_extracted["altitude"][index - 1]) * 10) / 10
  );
  delta_altitudes.shift();
  const total_elevation_loss =
    Math.round(
      delta_altitudes.reduce(
        (partialSum, a) => partialSum + (a < 0 ? a : 0),
        0
      ) * 10
    ) / 10;
  const total_elevation_gain =
    Math.round(
      delta_altitudes.reduce(
        (partialSum, a) => partialSum + (a > 0 ? a : 0),
        0
      ) * 10
    ) / 10;

  const activity: Activity = {
    strava_user_id: activity_strava["athlete"]["id"],
    strava_activity_id: activity_strava["id"],
    start_time: activity_strava["start_date_local"],
    strava_project_name: activity_strava["name"],
    moving_time: activity_strava["moving_time"],
    total_distance: activity_strava["distance"],
    min_altitude: activity_strava["elev_low"],
    max_altitude: activity_strava["elev_high"],
    polyline: activity_strava["map"]["polyline"],

    strava_photo_urls: photo_urls,

    coordinates: streams_extracted["latlng"],
    altitudes: streams_extracted["altitude"],
    distances: streams_extracted["distance"],

    delta_altitudes: delta_altitudes,
    delta_distances: delta_distances,
    total_elevation_loss: total_elevation_loss,
    total_elevation_gain: total_elevation_gain,
  };
  return activity;
};

export async function POST(request: Request) {
  const webhook_data: Webhook = await request.json();
  console.log("webhook event received!", webhook_data);

  // if subscription id, aspect type, strava user, object type and project name matches, save data
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
    const activity_extracted: Activity = extract_data(
      activity_strava,
      photos_strava,
      streams_strava
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
  console.log(request.url);
  const { searchParams } = new URL(request.url);
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = "STRAVA";
  // Parses the query params
  let mode = searchParams.get("hub.mode");
  let token = searchParams.get("hub.verify_token");
  let challenge = searchParams.get("hub.challenge");
  // Checks if a token and mode is in the query string of the request
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
