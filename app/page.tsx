"use client";

import Image from "next/image";
import { Fredoka } from 'next/font/google';
import { useEffect, useState } from "react";
import ElevationChart from "@/app/components/ElevationChart";
import { MapComponent } from "@/app/components/MapComponent";
import { PerformanceItemComponent } from "@/app/components/PerformanceItemComponent";
import { PhotoAlbumComponent } from "@/app/components/PhotoAlbumComponent";
import { convertHikePhotos, PhotoEntry } from "./utils/calculation_functions_client";
import { useStats } from "@/app/hooks/useStats";
import Skeleton from '@mui/material/Skeleton';


type Stats = {
  totalDistance: number;
  totalElevationGain: number;
  totalElevationLoss: number;
  minAltitude: number;
  maxAltitude: number;
  timeElapsed: number;
  photosUrl: PhotoEntry [];
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
      try {
        const data = await useStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


  return (

    <main
      className={`flex min-h-screen flex-col items-center justify-between p-6 global-background ${inter.className}`}
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

      {loading && (
        <>
          <div className="container wrapper">

            <PerformanceItemComponent title="totalDistance" />
            <PerformanceItemComponent title="timeElapsed" />

            <PerformanceItemComponent title="totalElevationGain" />
            <PerformanceItemComponent title="totalElevationLoss" />
            <PerformanceItemComponent title="maxAltitude" />

            <PerformanceItemComponent title="minAltitude" />
          </div>
          <div className="map-wrapper" style={{ marginBottom: "20px" }}>
          <div className="border-wrapper">
          <Skeleton
              animation="wave"
              height="100%"
              width="100%"
              style={{ marginBottom: 6 }}
            />
            </div>
            </div>
          <div className="map-wrapper">
            <div className="full-height-map">
            <Skeleton
              animation="wave"
              height="100%"
              width="100%"
              style={{ marginBottom: 6 }}
            />
            </div>
          </div>


        </>
      )}
      {!loading && !stats && (
        <p>Failed to load stats</p>
      )}


      {!loading && stats && (
        <>
          <div className="container wrapper">

            <PerformanceItemComponent title="totalDistance" quantity={stats.totalDistance / 1000} />
            <PerformanceItemComponent title="timeElapsed" quantity={stats.timeElapsed + 1} />
            <PerformanceItemComponent title="totalElevationGain" quantity={stats.totalElevationGain} />
            <PerformanceItemComponent title="totalElevationLoss" quantity={stats.totalElevationLoss} />
            <PerformanceItemComponent title="maxAltitude" quantity={stats.maxAltitude} />
            <PerformanceItemComponent title="minAltitude" quantity={stats.minAltitude} />
          </div>
          <ElevationChart
            altitude={stats?.altitudes ?? []}
            distance={stats?.distance_aggregated ?? []}
            loading={loading}
          />      
          <MapComponent coordinates={stats.coordinates as [number, number][]} currentLocation={stats.coordinates.slice(-1)[0] as [number, number]} centerCoordinates={stats.coordinates.slice(-1)[0] as [number, number]} />
          <PhotoAlbumComponent photos={convertHikePhotos(stats.photosUrl)}/>      

        </>)}

    </main>


  );
}

