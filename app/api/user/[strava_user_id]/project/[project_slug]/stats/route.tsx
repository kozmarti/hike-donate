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
    const statsArray = await db
      .collection("activities")
      .aggregate([
        {
          $match: {
            strava_user_id: parseInt((process.env.STRAVA_USER_ID ??= "")),
            strava_project_name: process.env.STRAVA_PROJECT_NAME,
          },
        },
        {
          $project: {
            strava_user_id: 1,
            start_time: 1,
            strava_project_name: 1,
            total_distance: 1,
            total_elevation_gain: 1,
            total_elevation_loss: 1,
            min_altitude: 1,
            max_altitude: 1,
            strava_photo_urls: 1,
            coordinates: 1,
            altitudes: 1,
            distances_aggregated: 1,
          },
        },
        { $sort: { start_time: 1 } },
        {
          $group: {
            _id: "stats",
            totalDistance: { $sum: "$total_distance" },
            totalElevationGain: { $sum: "$total_elevation_gain" },
            //totalElevationLoss: { $sum: "$total_elevation_loss" },
            minAltitude: { $min: "$min_altitude" },
            maxAltitude: { $max: "$max_altitude" },
            photosUrl: {
              $push: { hikeDate: "$start_time", photos: "$strava_photo_urls" },
            },
            coordinate_by_day: { $push: "$coordinates" },
            altitude_by_day: { $push: "$altitudes" },
            distance_aggregated_by_day: { $push: "$distances_aggregated" },

            startHikeDate: { $min: { $toDate: "$start_time" } },
            lastHikeDate: { $max: { $toDate: "$start_time" } },
          },
        },
        {
          $addFields: {
            timeElapsed: {
              $divide: [
                { $subtract: ["$lastHikeDate", "$startHikeDate"] },
                3600000 * 24,
              ],
            },
            coordinates: {
              $reduce: {
                input: "$coordinate_by_day",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
            altitudes: {
              $reduce: {
                input: "$altitude_by_day",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
            distance_aggregated: {
              $reduce: {
                input: "$distance_aggregated_by_day",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
            photosUrl: { $reverseArray: "$photosUrl" },
          }
        },
        {
          $addFields: {
            firstAltitude: { $arrayElemAt: ["$altitudes", 0] },
            lastAltitude: {
              $arrayElemAt: ["$altitudes", { $subtract: [{ $size: "$altitudes" }, 1] }],
            },
            
          }
        },
        {
          $addFields: {
            totalElevationLoss: {
              $subtract: [
                { $subtract: ["$lastAltitude", "$firstAltitude"] },
                "$totalElevationGain",
              ]
            }
          }},
        {
          $unset: [
            "coordinate_by_day",
            "altitude_by_day",
            "distance_aggregated_by_day",
            "startHikeDate",
            "lastHikeDate",
            "_id",
            "firstAltitude",
            "lastAltitude",
          ],
        },
      ])
      
      .toArray();
    
    if (!statsArray || statsArray.length === 0) {
      return NextResponse.json({ message: "No stats for user and project" }, { status: 500 });
    }
  
    const stats = statsArray[0];

    return NextResponse.json(stats);
  } catch (e) {
    console.error(e);
  }
}
