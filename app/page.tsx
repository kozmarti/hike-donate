"use client";

import Image from "next/image";
import { Fredoka } from 'next/font/google';
import { useEffect, useState } from "react";
import { PerformanceItemComponent } from "@/app/components/PerformanceItemComponent";
import { convertHikePhotos } from "./utils/calculation_functions_client";
import { StatsResponse, useStats } from "@/app/hooks/useStats";
import Skeleton from '@mui/material/Skeleton';
import Footer from "./components/Footer";
import { useCollectedAmount } from "./hooks/useCollectedAmount";
import Description from "./components/Description";
import dynamic from "next/dynamic";
import { BsArrowUpSquareFill } from "react-icons/bs";
import Link from "next/link";
import { IoStatsChartOutline } from "react-icons/io5";


const fredoka = Fredoka({ subsets: ['latin'] });

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

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const target = document.getElementById("showScrollUpButton");

    const handleScroll = () => {
      if (!target) return;

      const targetPosition = target.getBoundingClientRect().top + window.scrollY;

      if (window.scrollY > targetPosition) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


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
        <PerformanceItemComponent title="totalDistance" loading={loading} quantity={stats ? stats.totalDistance / 1000 : undefined} />
        <PerformanceItemComponent title="timeElapsed" loading={loading} quantity={stats ? stats.timeElapsed + 1 : undefined} />
        <PerformanceItemComponent title="totalElevationGain" loading={loading}  quantity={stats?.totalElevationGain} />
        <PerformanceItemComponent title="totalElevationLoss" loading={loading}  quantity={stats?.totalElevationLoss} />
        <PerformanceItemComponent title="maxAltitude" loading={loading}  quantity={stats?.maxAltitude} />
        <PerformanceItemComponent title="minAltitude" loading={loading}  quantity={stats?.minAltitude} />
      </div>

      <div id="showScrollUpButton" className='gauge-container relative' style={{ width: "300px", height: "285px", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
        {!loading && !stats && (
          <CollectedAmountGauge amountLastUpdated={amountLastUpdated} collectedAmount={collectedAmount} distance={0} />
        )}
      </div>


      <MapComponent coordinates={stats?.coordinates as [number, number][]} currentLocation={!loading && !stats ? [43.3732318, -1.7740848] : stats?.coordinates.slice(-1)[0] as [number, number]} centerCoordinates={!loading && !stats ? [43.3732318, -1.7740848] : stats?.coordinates.slice(-1)[0] as [number, number]} />
      <ElevationChart
        altitude={stats?.altitudes ?? []}
        distance={stats?.distance_aggregated ?? []}
        loading={loading}
      />
          <Link href="/daily-stats">
      <button 
      className="custom-button"
      style={{
        fontFamily: fredoka.style.fontFamily,
        marginTop: 0,

      }}>
        <IoStatsChartOutline style={{display: "inline"}} /> View Daily Stats 
      </button>
    </Link>
          <Description />

      {!loading && stats && (
          <PhotoAlbumComponent photos={convertHikePhotos(stats.photosUrl)} />
        )}
      {showButton && (
        <a href="#statistics" className="scroll-down-button"><BsArrowUpSquareFill color="#fd5770" size={30} style={{ display: "inline" }} /></a>
      )
      }
      <Footer />
    </main>
  );
}

