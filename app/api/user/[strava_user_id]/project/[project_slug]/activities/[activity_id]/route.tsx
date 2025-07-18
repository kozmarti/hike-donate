import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      activity_id: number;
    };
  }
) {
  const { activity_id } = params;
  // endpoint: api/user/{strava_user_id}/project/{project_slug}/activities{activity_id}

  var ObjectId = require("mongodb").ObjectId;
  const activity_object_id = new ObjectId(activity_id);

  try {
    const client = await clientPromise;
    const db = client.db("hike");
    const activity = await db
      .collection("activities")
      .findOne({
        _id: activity_object_id,
        strava_user_id: parseInt((process.env.STRAVA_USER_ID ??= "")),
        strava_project_name: process.env.STRAVA_PROJECT_NAME,
      })
    return NextResponse.json(activity);
  } catch (e) {
    console.error(e);
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      activity_id: string;
    };
  }
) {
  const { activity_id } = params;
  var ObjectId = require("mongodb").ObjectId;
  const activity_object_id = new ObjectId(activity_id);

  try {
    const client = await clientPromise;
    const db = client.db("hike");

    const result = await db.collection("activities").deleteOne({
      _id: activity_object_id,
      strava_user_id: parseInt(process.env.STRAVA_USER_ID ?? ""),
      strava_project_name: process.env.STRAVA_PROJECT_NAME,
    });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return new NextResponse("Activity not found", { status: 404 });
    }
  } catch (e) {
    console.error("DELETE error:", e);
    return new NextResponse("Error deleting activity", { status: 500 });
  }
}
