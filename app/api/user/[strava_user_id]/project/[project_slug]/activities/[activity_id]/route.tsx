import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      strava_user_id: number;
      project_slug: string;
      activity_id: number;
    };
  }
) {
  const { strava_user_id, project_slug, activity_id } = params;
  // endpoint: api/user/{strava_user_id}/project/{project_slug}/activities{activity_id}

  var ObjectId = require("mongodb").ObjectId;
  const activity_object_id = new ObjectId(activity_id);

  try {
    const client = await clientPromise;
    const db = client.db("hike");
    const activities = await db
      .collection("activities")
      .find({
        _id: activity_object_id,
        strava_user_id: parseInt((process.env.STRAVA_USER_ID ??= "")),
        strava_project_name: process.env.STRAVA_PROJECT_NAME,
      })
      .toArray();
    return NextResponse.json(activities);
  } catch (e) {
    console.error(e);
  }
}
