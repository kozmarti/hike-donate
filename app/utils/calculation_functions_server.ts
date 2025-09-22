import clientPromise from "@/lib/mongodb";

export async function get_last_distance(start_date_local: string, stravaUserId: number, projectName: string): Promise<number> {
    try {
      const client = await clientPromise;
      const db = client.db("hike");
  
      const previousHike = await db.collection('activities')
        .find(
          { start_time: { $lt: start_date_local }, strava_user_id: stravaUserId, strava_project_name: projectName },
          { projection: { distances_aggregated: 1 } },
        )
        .sort({ start_time: -1 })
        .limit(1)
        .toArray();
  
      const last_distance = previousHike[0]?.distances_aggregated?.at(-1) ?? 0;
      console.log("Last activity distance found", last_distance);
      return last_distance;
    } catch (e) {
      console.error("Error fetching last distance:", e);
      return 0;
    }
  }
