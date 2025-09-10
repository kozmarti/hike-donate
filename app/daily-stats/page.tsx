"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useActivities } from "../hooks/useActivities";
import Skeleton from '@mui/material/Skeleton';
import { PerformanceItemComponent } from "../components/PerformanceItemComponent";


const DailyStatsCarousel = dynamic(() => import("../components/DailyCarousel"), {
  ssr: false,
  loading: () => <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
<div
      style={{
        display: "flex",
        flexWrap: "wrap",         // allow skeletons to go to next line
        justifyContent: "center", // horizontal center
        alignItems: "center",     // vertical center within the container
      }}
    >
      {Array.from({ length: 47 }).map((_, index) => (
        <Skeleton
          key={index}
          variant="circular"
          height={28}
          width={28}
          style={{ margin: "1px 2px" }}
        />
      ))}
    </div>
    <Skeleton variant="rectangular" height={30} width={200} style={{marginBottom: "1rem", marginTop: "0.5rem"}}/>

    <div className="container wrapper" id="statistics">
      <PerformanceItemComponent title="totalDistance" loading={true} />
      <PerformanceItemComponent title="movingTime" loading={true} />
      <PerformanceItemComponent title="totalElevationGain" loading={true} />
      <PerformanceItemComponent title="totalElevationLoss" loading={true} />
      <PerformanceItemComponent title="maxAltitude" loading={true} />
      <PerformanceItemComponent title="minAltitude" loading={true} />
    </div>    <div className="map-wrapper" style={{ margin: 10 }}>
      <div className="full-height-map">
        <Skeleton
          animation="wave"
          height="100%"
          width="100%"
          style={{ marginBottom: 6 }}
        />
      </div>
    </div>
    <div className="map-wrapper" style={{ margin: 10 }}>
      <div className="full-height-map">
        <Skeleton
          animation="wave"
          height="100%"
          width="100%"
          style={{ marginBottom: 6 }}
        />
      </div>
    </div>
  </div>

});

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [data] = await Promise.all([
          useActivities(),
        ]);
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <DailyStatsCarousel activities={activities} loading={loading} />
    </>
  )
}
