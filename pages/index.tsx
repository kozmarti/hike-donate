import Image from "next/image";
import { Fredoka } from 'next/font/google';
import { useEffect, useState } from "react";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import ElevationChart from "@/app/components/ElevationChart";
import { MapComponent } from "@/app/components/MapComponent";
import { PerformanceItemComponent } from "@/app/components/PerformanceItemComponent";

type Stats = {
  totalDistance: number;
  totalElevationGain: number;
  totalElevationLoss: number;
  minAltitude: number;
  maxAltitude: number;
  timeElapsed: number;
  photosUrl: { hikeDate: string; photos: string[] }[];
  coordinates: number[][];
  altitudes: number[];
  distance_by_day: number[][];
  coordinate_by_day: number[][];
  startHikeDate: Date;
  lastHikeDate: Date;
  distances: number[];
  altitude_by_day: number[][];
  distance_aggregated: number[];
  delta_distances: number[];
  delta_altitudes: number[];
};

const inter = Fredoka({ subsets: ["latin"] });


export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const userId = process.env.STRAVA_USER_ID;

      try {
        const res = await fetch(`${apiUrl}/api/user/${userId}/project/test/stats`);
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <Image
          src="/logo.png"
          alt="Hike&Donate Logo"
          width={200}
          height={48}
          priority
        />
        {/* Show loading spinner or skeleton screen while data is loading */}
        <p>Loading...</p>
      </div>
    );
  }
  if (!stats) {
    return <p>Failed to load stats</p>;
  }


  const coords = stats.coordinates;
  const lastCords = stats.coordinates.slice(-1)[0];


  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 global-background ${inter.className}`}
    >

      <Image
        src="/logo.png"
        alt="Hike&Donate Logo"
        width={200}
        height={48}
        priority
      />
      {/*
      <p>Would you sponsor one kilometer of my fundraising hike? 
      </p>
      <p>I am embarking on an exciting journey. The goal is simple: for every kilometer I trek, I aim to raise an equal number of euros for [Association] to [support …]. 
Whether I walk 10 kilometers or 100, every euro raised will go toward transforming lives and providing much-needed support.
</p>
<p>How far do you think I will make it ?</p>
*/}
      <div className="container wrapper">

        <PerformanceItemComponent title="totalDistance" quantity={stats.totalDistance / 1000} />
        <PerformanceItemComponent title="timeElapsed" quantity={stats.timeElapsed + 1} />

        <PerformanceItemComponent title="totalElevationGain" quantity={stats.totalElevationGain} />
        <PerformanceItemComponent title="totalElevationLoss" quantity={stats.totalElevationLoss} />
        <PerformanceItemComponent title="maxAltitude" quantity={stats.maxAltitude} />

        <PerformanceItemComponent title="minAltitude" quantity={stats.minAltitude} />

      </div>
      <ElevationChart altitude={stats.altitudes} distance={stats.distance_aggregated} />

      <MapComponent coordinates={coords as [number, number][]} currentLocation={lastCords as [number, number]} centerCoordinates={lastCords as [number, number]} />

    </main>
  );
}
