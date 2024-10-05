import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { strava_user_id: number; project_slug: string } }
) {
  // endpoint: api/user/{strava_user_id}/project/{project_slug}/stats

  const { strava_user_id, project_slug } = params;

  try {
    const client = await clientPromise;
    const db = client.db("hike");
    const stats = await db
      .collection("activities")
      .aggregate([
        { $sort: { start_time: -1 } },
        {
          $match: {
            strava_user_id: parseInt((process.env.STRAVA_USER_ID ??= "")),
            strava_project_name: process.env.STRAVA_PROJECT_NAME,
          },
        },
        {
          $group: {
            _id: "stats",
            totalDistance: { $sum: "$total_distance" },
            totalElevationGain: { $sum: "$total_elevation_gain" },
            totalElevationLoss: { $sum: "$total_elevation_loss" },
            minAltitude: { $min: "$min_altitude" },
            maxAltitude: { $min: "$max_altitude" },
            photosUrl: {
              $push: { hikeDate: "$start_time", photos: "$strava_photo_urls" },
            },
            startHikeDate: { $min: {$toDate: "$start_time"} },
            lastHikeDate: { $max: {$toDate: "$start_time"} },
            


          },
        },
        {
          $addFields: {
            timeElapsed: {
              $divide: [{$subtract: ["$lastHikeDate", "$startHikeDate"]}, 3600000*24],
            },
          },
        },
      ])
      .toArray();

    return NextResponse.json(stats[0]);
  } catch (e) {
    console.error(e);
  }
}
