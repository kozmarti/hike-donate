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
    tota_elevation_gain: total_elevation_gain,
  };
  return activity;
};

export async function POST(request: Request) {
  const webhook_data: Webhook = await request.json();
  console.log("webhook event received!", webhook_data);

  // if subscription id, aspect type, strava user, object type and project name matches, save data

  const activity_id: number = webhook_data["object_id"];
  const activity_strava = await getActivity(Number(activity_id));
  const streams_strava = await getActivityStreams(Number(activity_id));
  const photos_strava = await getActivityPhotos(Number(activity_id));
  const activity = extract_data(activity_strava, photos_strava, streams_strava);
  console.log("data collected")
  console.log(activity)

  try {
    console.log("to POST")
    const client = await clientPromise;
    const db = client.db("hike");
    db.collection("activities").insertOne(activity);
  } catch (e) {
    console.error(e);
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

const photo = [];

const stream = [
  {
    type: "latlng",
    data: [], //coordinates
    series_type: "distance",
    original_size: 1861,
    resolution: "high",
  },
  {
    type: "distance",
    data: [], //distances
    series_type: "distance",
    original_size: 1861,
    resolution: "high",
  },
  {
    type: "altitude",
    data: [], // altitudes
    series_type: "distance",
    original_size: 1861,
    resolution: "high",
  },
];

const activity = {
  athlete: {
    id: 147153150, // strava user id
  },
  name: "test", //project name
  distance: 2438.1, // total distance
  moving_time: 1829, // moving time
  total_elevation_gain: 6.7, //elevation gain
  id: 12452922440, //activity id
  start_date_local: "2024-09-19T18:41:27Z", //start date
  map: {
    id: "a12452922440",
    polyline:
      "eetpGrrnBA?GDQ`@_@FQJy@ESNSDMPF`@?`@Lh@BTCb@IHAFH\\Af@Nd@Fr@BHANKDM@OBc@AIBB@ACOAQFQBw@WL@AE@CBDH@NL@AP@ZAVId@RTANIFM?m@UaBMc@BIb@Qx@ITIJ?NKBGDQC]@SCmAX]NAHGJQLBL?f@MJDD?HCHE`ABTMHMB?@EBA@IBG?kADUCQ@Mo@bB@DCCDGB@DW@B?AKlFBPKBWGW?]FIFk@lAKBELc@JS?_@FD^Jd@A`@DJA?@DFD?I@LHLEHSJ]A]PECKBMKG?I?KHMAEDSBIDMPC@YEm@@KBUEWLWJWBEBI?AAQBSw@?gAGg@BYAc@BIASCI@@BKAa@Fs@Ia@OGM?_@LK@GGk@OKDIF_@JUGQAC@[OYGKKDCBQBc@^o@BCCUFU?YBECOBCDWHOPEJ@@EAA@Q",
    resource_state: 3,
    summary_polyline:
      "qjtpGn}nBNf@Fr@BJALCBe@Fc@AIBB@ACOAQFQBw@WL@AE@CBDH@NL@AP@ZAVId@RTANIFM?m@UaBMc@BIb@Qx@ITIJ?NKBGDQC]@SCmAX]NAHGJQLBL?f@MJDD?HCHE`ABTMHMB?@EBA@IBG?kADUCQ@Mo@bB@DCCDGB@DW@B?AKlFBPKBWGW?]FIFk@lAKBELc@JS?_@FD^Jd@A`@DJA?@DFD?I@LHLEJG?KH]A]PECKBMKG?I?KHMAEDSBIDMPC@YEm@@KBUEWLWJWBEBI?AAQBSw@?gAGg@BYAC",
  },
  elev_high: 17.1, //max altitude
  elev_low: 11.2, //min altitude
};

const photos = [
  {
    unique_id: "314af5ab-7870-4e8a-9cf9-d4c830e3f594",
    athlete_id: 147153150,
    activity_id: 12431737609,
    activity_name: "test",
    urls: {
      "5000":
        "https://dgtzuqphqg23d.cloudfront.net/VLVrAJKqgrFhXv3ZkMBMguX41NbTIuAz3Ap_qSAz5KM-2048x2048.jpg",
    },
  },
  {
    athlete_id: 147153150,
    activity_id: 12431737609,
    activity_name: "test",
    urls: {
      "5000":
        "https://dgtzuqphqg23d.cloudfront.net/XHQe2GWQq-J6tHBUbVmn52NJxf7Moy5rnrq1IUU1xa0-2048x2048.jpg",
    },
  },
  {
    athlete_id: 147153150,
    activity_id: 12431737609,
    activity_name: "test",
    urls: {
      "5000":
        "https://dgtzuqphqg23d.cloudfront.net/lXfuBO9hehistImo4jvZx-VIuJMCYetjRk4aPeP7Txo-2048x2048.jpg",
    },
  },
];
