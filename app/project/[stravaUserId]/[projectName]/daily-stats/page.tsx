"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Skeleton from '@mui/material/Skeleton';
import { PerformanceItemComponent } from "@/app/components/PerformanceItemComponent";
import { useActivities } from "@/app/hooks/useActivities";
import useActivitiesByProject from "@/app/hooks/useActivitiesByProject";


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

interface ProjectPageProps {
  params: {
    stravaUserId: string;
    projectName: string;
  };
}


export default function Page({ params }: ProjectPageProps) {
  const { stravaUserId, projectName } = params;
  const { data, loading, error } = useActivitiesByProject( stravaUserId, projectName)

  return (
    <>
      <DailyStatsCarousel activities={data ? data : []} loading={loading} />
    </>
  )
}
