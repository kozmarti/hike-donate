"use client";
import { useEffect, useState } from "react";
import { Activity } from "../entities/Activity";
import { useActivities } from "../hooks/useActivities";
import { map } from "leaflet";

export default function Page() {
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activities = await useActivities();
        setActivities(activities);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const colors = ['red', 'blue', 'green', 'orange', 'purple'];
  let lastColor = 'purple';
  let previousActivity: Activity | null = null;
  return <>
    <div className="flex flex-col justify-center m-20">
      {activities?.map((activity, index) => {
        let firstColorToUse = lastColor;

        let lastColorToUse = colors[index % colors.length];
        lastColor = lastColorToUse
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>

            <h2 key={index} className="font-bold mb-4 text-xl">Activity {index + 1}</h2>
            <hr />
            <p> <strong>Date: </strong> {new Date(activity.start_time).toLocaleDateString()}</p>
            <p style={{ color: "black" }}><strong>CHECK Altitudes [starting - ending + gain] : </strong>
              -{activity.altitudes[0] - activity.altitudes[activity.altitudes.length - 1] + activity.total_elevation_gain}m = {activity.total_elevation_loss} ?
              {activity.altitudes[0] - activity.altitudes[activity.altitudes.length - 1] + activity.total_elevation_gain === - activity.total_elevation_loss ? " ✅" : " ❌"}
            </p>
            {index > 0 && (
              <p style={{ color: "black" }}>
                <strong>CHECK Aggregated distances [previous last = first] : </strong>
                {activity.distances_aggregated[0]} - {activities[index - 1].distances_aggregated[ activities[index - 1].altitudes.length - 1]} = 0 ?
                {activity.distances_aggregated[0] - activities[index - 1].distances_aggregated[ activities[index - 1].altitudes.length - 1] === 0 ? " ✅" : " ❌"}
              </p>
            )}
            <p style={{ color: "black" }}><strong>CHECK number of points : </strong>
            {activity.coordinates.length} cooridnates = {activity.distances_aggregated.length} distances = {activity.altitudes.length} altitudes ?
            {activity.coordinates.length === activity.distances_aggregated.length && activity.distances_aggregated.length === activity.altitudes.length ? " ✅" : " ❌"}
            </p>

            <p ><strong>Photos: </strong>
              <div className="flex flex-row">
                {activity.strava_photo_urls.map((url => (
                  <img key={url} src={url} alt="Activity photo" style={{ width: "100px", height: "100px", margin: "10px" }} />
                )))
                }</div></p>
            <p><strong>Distance:</strong>  {activity.total_distance}m</p>
            <p><strong>Min altitude: </strong> {activity.min_altitude}m</p>
            <p><strong>Max altitude: </strong> {activity.max_altitude}m</p>
            <p><strong>Total Elevation Gain: </strong>  {activity.total_elevation_gain}m</p>
            <p><strong>Total Elevation Losss: </strong> {activity.total_elevation_loss}m</p>

            <p> <span style={{ color: "green" }}>[{activity.coordinates.length}] </span><strong>Coordinates: </strong>  [{activity.coordinates.map(coord => `(${coord[0]}, ${coord[1]})`).join(", ")}]</p>
            <p><span style={{ color: "green" }}>[{activity.distances_aggregated.length}]</span> <strong>Distances Aggregated:</strong> [
              {activity.distances_aggregated.map((dist, index, arr) => {
                const firstDistanceElement = 0;
                const lastDistanceElement = arr.length - 1;

                const applyColor =
                  index === firstDistanceElement ? { color: firstColorToUse, fontWeight: 'bold' } : index === lastDistanceElement ? { color: lastColorToUse, fontWeight: 'bold' } : {};

                return (
                  <span key={index} style={applyColor}>
                    {dist}
                    {index !== arr.length - 1 && ', '}
                  </span>
                );
              })


              }
              ]
            </p>
            <p><span style={{ color: "green" }}>[{activity.altitudes.length}]</span><strong> Altitudes: </strong>  [{activity.altitudes.map(alt => alt).join(", ")}]</p>
            <hr />
          </div>
        )
      }
      )
      }
    </div>
  </>
    ;
}