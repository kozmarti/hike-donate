import { Activity } from "@/app/entities/Activity";
import clientPromise from "@/lib/mongodb";
import { requireProjectOwner } from "@/lib/project-access";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest,
  { params }: { params: { strava_user_id: number; project_slug: string } }
) {
  // endpoint: api/user/{strava_user_id}/project/{project_slug}/activities
  

  const { strava_user_id, project_slug } = params;
  const startDate = req.nextUrl.searchParams.get("start_date_local");

  try {
    const client = await clientPromise;
    const db = client.db("hike");

     // Case 1: return last activity if start_date_local is provided
     // This is used to get the last distance for the activity
     // response example: {"last_distance":8362.5}
     
     if (startDate) {
      const previousHike = await db
        .collection("activities")
        .find(
          { start_time: { $lt: startDate } },
          { projection: { distances_aggregated: 1 } }
        )
        .sort({ start_time: -1 })
        .limit(1)
        .toArray();

      const last_distance = previousHike[0]?.distances_aggregated?.at(-1) ?? 0;
      return NextResponse.json({ last_distance });
    }

    // Case 2: return all activities otherwise

    const activities = await db
      .collection("activities")
      .find({
        strava_user_id: parseInt((process.env.STRAVA_USER_ID ??= "")),
        strava_project_name: process.env.STRAVA_PROJECT_NAME,
      })
      .toArray();
    return NextResponse.json(activities);
  } catch (e) {
    console.error(e);
  }
}

export async function POST(
  request: Request,
  { params }: { params: { strava_user_id: string; project_slug: string } }
) {
  const owner = await requireProjectOwner(request, String(params.strava_user_id), params.project_slug);
  if (owner instanceof Response) return owner;

  const body = await request.json();
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid activity data" }, { status: 400 });
  }
  const { _id, ...rest } = body;
  // Ownership always comes from the session, never from the body
  const activityData: Activity = {
    ...rest,
    strava_user_id: owner.stravaUserId,
    strava_project_name: owner.projectName,
  };

  try {
    const client = await clientPromise;
    const activities = client.db("hike").collection("activities");
    if (typeof activityData.strava_activity_id === "number") {
      await activities.updateOne(
        {
          strava_activity_id: activityData.strava_activity_id,
          strava_user_id: owner.stravaUserId,
          strava_project_name: owner.projectName,
        },
        { $set: activityData },
        { upsert: true }
      );
    } else {
      await activities.insertOne(activityData);
    }
  } catch (e) {
    console.error("Error saving activity:", e);
    return Response.json({ error: "Failed to save activity" }, { status: 500 });
  }

  return Response.json(
    { message: "Activity data posted", activityData },
    { status: 200 }
  );
}
