"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useActivities } from "../hooks/useActivities";
import Link from "next/link";
import { IoHomeOutline } from "react-icons/io5";
import { Fredoka } from "next/font/google";
import Skeleton from '@mui/material/Skeleton';

const fredoka = Fredoka({ subsets: ['latin'] });

const DailyStatsCarousel = dynamic(() => import("../components/DailyCarousel"), {
  ssr: false,
  loading: () => <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <Skeleton height={20} width="40%" style={{ textAlign: "center" }} />
    <Skeleton variant="rounded" width={300} height={80} style={{ margin: 10, borderRadius: "20px" }} />
    <Skeleton variant="rounded" width={300} height={80} style={{ margin: 10, borderRadius: "20px" }} />
    <Skeleton variant="rounded" width={300} height={80} style={{ margin: 10, borderRadius: "20px" }} />
    <Skeleton variant="rounded" width={300} height={80} style={{ margin: 10, borderRadius: "20px" }} />
    <Skeleton variant="rounded" width={300} height={80} style={{ margin: 10, borderRadius: "20px" }} />
    <Skeleton variant="rounded" width={300} height={80} style={{ margin: 10, borderRadius: "20px" }} />
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
      <Link href="/" >
        <button
          className="custom-button"
          style={{
            fontFamily: fredoka.style.fontFamily,
          }}>
          <IoHomeOutline style={{ display: "inline" }} /> Home
        </button>
      </Link>
    </>
  )
}
