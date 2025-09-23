"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Skeleton from '@mui/material/Skeleton';
import { PerformanceItemComponent } from "@/app/components/PerformanceItemComponent";
import { useActivities } from "@/app/hooks/useActivities";
import { redirect } from "next/navigation";
import useActivitiesByProject, { activityClient } from "@/app/hooks/useActivitiesByProject";
import { Activity } from "@/app/entities/Activity";
import useUser from "@/app/hooks/useUser";


const DailyStatsCarousel = dynamic(() => import("@/app/components/DailyCarousel"), {
  ssr: false,
  loading: () => <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
<div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "500px",
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
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const { data: user, loading: loadingUser, error: userErrorUser } = useUser()
  

  useEffect(() => {
      let isMounted = true;
      if (!loadingUser && !user) {
        redirect("/welcome"); 
      }
      if (user) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
  
        try {
          const result = await activityClient(user.stravaUserId, user.projectName);
          if (isMounted) {
            setActivities(result);
          }
        } catch (err: any) {
          if (isMounted) {
            setError(err.message || "Failed to fetch activities");
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      };
  
      fetchData();
  
      return () => {
        isMounted = false;
      };
    }
    }, [user]);

  return (
    <>
      <DailyStatsCarousel activities={activities} loading={loading} />
    </>
  )
}
