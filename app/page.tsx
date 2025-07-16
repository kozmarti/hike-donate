"use client";

import Image from "next/image";
import { Fredoka } from 'next/font/google';
import { useEffect, useState } from "react";
import { PerformanceItemComponent } from "@/app/components/PerformanceItemComponent";
import { convertHikePhotos, PhotoEntry } from "./utils/calculation_functions_client";
import { StatsResponse, useStats } from "@/app/hooks/useStats";
import Skeleton from '@mui/material/Skeleton';
import Footer from "./components/Footer";
import { useCollectedAmount } from "./hooks/useCollectedAmount";
import Description from "./components/Description";
import dynamic from "next/dynamic";
import { BsArrowUpSquareFill } from "react-icons/bs";

   
const CollectedAmountGauge = dynamic(() => import('@/app/components/CollectedAmountGauge'), {
  ssr: false,
  loading: () => 
      <>
      <Skeleton
        animation="wave"
        variant="circular"
        height="180px"
        width="180px"
      />
      <Skeleton animation="wave" height={10} width="80%" />
      <Skeleton animation="wave" height={10} width="70%" />
      <Skeleton animation="wave" height={10} width="60%" />
      </>
,
});


const MapComponent = dynamic(() => import('@/app/components/MapComponent').then((mod) => mod.MapComponent), {
  ssr: false,
  loading: () => <div className="map-wrapper" style={{ margin: 10 }}>
  <div className="full-height-map">
  <Skeleton
    animation="wave"
    height="100%"
    width="100%"
    style={{ marginBottom: 6 }}
  />
  </div>
</div>,
});

const ElevationChart = dynamic(() => import('@/app/components/ElevationChart'), {
  ssr: false,
  loading: () => <div className="map-wrapper" style={{ margin: 10 }}>
  <div className="full-height-map">
  <Skeleton
    animation="wave"
    height="100%"
    width="100%"
    style={{ marginBottom: 6 }}
  />
  </div>
</div>,
});

const PhotoAlbumComponent = dynamic(() => import('@/app/components/PhotoAlbumComponent').then((mod) => mod.PhotoAlbumComponent), {
  ssr: false,
});

const inter = Fredoka({ subsets: ["latin"] });


export default function Home() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [collectedAmount, setCollectedAmount] = useState<number>(0);
  const [amountLastUpdated, setAmountLastUpdated] = useState<string>('');

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [data, collectedAmountData] = await Promise.all([
          useStats(),
          useCollectedAmount(),
        ]);
        setCollectedAmount(collectedAmountData[0]?.amount ?? 0);
        const date = new Date(collectedAmountData[0]?.date);
        const formattedDate = date.toLocaleString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        setAmountLastUpdated(formattedDate ?? '');
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
        height={200}
        priority
      />
 

          <div className="container wrapper" id="statistics">  
            <PerformanceItemComponent title="totalDistance" quantity={stats ? stats.totalDistance / 1000 : undefined} />
            <PerformanceItemComponent title="timeElapsed" quantity={stats? stats.timeElapsed + 1 : undefined} />
            <PerformanceItemComponent title="totalElevationGain" quantity={stats?.totalElevationGain} />
            <PerformanceItemComponent title="totalElevationLoss" quantity={stats?.totalElevationLoss} />
            <PerformanceItemComponent title="maxAltitude" quantity={stats?.maxAltitude} />
            <PerformanceItemComponent title="minAltitude" quantity={stats?.minAltitude} />
          </div>
          
          <div className='gauge-container relative' style={{ width: "300px", height: "285px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {!loading && stats && (
          <CollectedAmountGauge amountLastUpdated={amountLastUpdated} collectedAmount={collectedAmount} distance={stats.totalDistance / 1000} />
          )}
          {loading && !stats && (
            <>
        <Skeleton
          animation="wave"
          variant="circular"
          height="180px"
          width="180px"
        />
        <Skeleton animation="wave" height={10} width="80%" />
        <Skeleton animation="wave" height={10} width="70%" />
        <Skeleton animation="wave" height={10} width="60%" />
        </>
          )}
          </div>
          

          <MapComponent coordinates={stats?.coordinates as [number, number][]} currentLocation={stats?.coordinates.slice(-1)[0] as [number, number]} centerCoordinates={stats?.coordinates.slice(-1)[0] as [number, number]} />
          <ElevationChart
            altitude={stats?.altitudes ?? []}
            distance={stats?.distance_aggregated ?? []}
            loading={loading}
          />   

      {!loading && !stats && (
        <p>Failed to load stats</p>
      )}
      
      {!loading && stats && (
        <>       
          <Description collectedAmount={collectedAmount} amountLastUpdated={amountLastUpdated} totalDistanceKm={Math.round(stats.totalDistance / 1000)}/>
          
          <PhotoAlbumComponent photos={convertHikePhotos(stats.photosUrl)}/>      
        </>)}
        <a href="#statistics" className="scroll-down-button"><BsArrowUpSquareFill color="#fd5770" size={20} style={{ display: "inline" }} /></a>

        <Footer/>
    </main>
  );
}

