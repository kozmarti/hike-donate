"use client";

import { Fredoka } from "next/font/google";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import { BsArrowUpSquareFill } from "react-icons/bs";
import { IoStatsChartOutline } from "react-icons/io5";
import Link from "next/link";

import { PerformanceItemComponent } from "@/app/components/PerformanceItemComponent";
import { StatsResponse } from "@/app/hooks/useStats";
import { useCollectedAmount } from "@/app/hooks/useCollectedAmount";
import { convertHikePhotos } from "@/app/utils/calculation_functions_client";
import Footer from "@/app/components/Footer";
import { useStatistics } from "../hooks/useStatistics";
import ProjectDescription from "./ProjectDescription";
import { getGoalMeasure } from "../entities/GoalMeasureConfig";
import { User } from "../entities/User";
import useUser from "../hooks/useUser";

interface Props {
    stravaUserId: string;
    projectName: string;
    dailyStatsUrl: string;
}
const fredoka = Fredoka({ subsets: ["latin"] });

const RaisedAmountGauge = dynamic(
  () => import("@/app/components/RaisedAmountGauge"),
  {
    ssr: false,
    loading: () => (
      <>
        <Skeleton animation="wave" variant="circular" height="180px" width="180px" />
        <Skeleton animation="wave" height={10} width="80%" />
        <Skeleton animation="wave" height={10} width="70%" />
        <Skeleton animation="wave" height={10} width="60%" />
      </>
    ),
  }
);

const MapComponent = dynamic(
  () => import("@/app/components/MapComponent").then((mod) => mod.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="map-wrapper" style={{ margin: 10 }}>
        <div className="full-height-map">
          <Skeleton animation="wave" height="100%" width="100%" style={{ marginBottom: 6 }} />
        </div>
      </div>
    ),
  }
);

const ElevationChart = dynamic(() => import("@/app/components/ElevationChart"), {
  ssr: false,
  loading: () => (
    <div className="map-wrapper" style={{ margin: 10 }}>
      <div className="full-height-map">
        <Skeleton animation="wave" height="100%" width="100%" style={{ marginBottom: 6 }} />
      </div>
    </div>
  ),
});

const PhotoAlbumComponent = dynamic(
  () => import("@/app/components/PhotoAlbumComponent").then((mod) => mod.PhotoAlbumComponent),
  { ssr: false }
);

export default function HikeDashboard( {stravaUserId, projectName, dailyStatsUrl}: Props ) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [collectedAmount, setCollectedAmount] = useState<number>(0);
  const [amountLastUpdated, setAmountLastUpdated] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const {data: user, loading: userLoading, error: userError} = useUser(stravaUserId)


  // Scroll listener for "back to top"
  useEffect(() => {
    const target = document.getElementById("showScrollUpButton");

    const handleScroll = () => {
      if (!target) return;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY;
      setShowButton(window.scrollY > targetPosition);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Data fetching
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [data, collectedAmountData] = await Promise.all(
            [useStatistics(stravaUserId, projectName), useCollectedAmount()]);
        setCollectedAmount(collectedAmountData[0]?.amount ?? 0);

        const date = new Date(collectedAmountData[0]?.date);
        setAmountLastUpdated(
          date.toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }) ?? ""
        );
        console.log("Fetched stats:", data);
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
    <div
      className={`flex min-h-screen flex-col items-center justify-between p-6 global-background ${fredoka.className}`}
    >
      <h1 className="p-5">{user ? user.name + "'s Fundraiser Hike" : <Skeleton variant="rectangular" animation="wave" height={20} width={150} style={{display: "inline-block" }} />
    }</h1>
      {/* Performance metrics */}
      <div className="container wrapper" id="statistics">
        <PerformanceItemComponent title="totalDistance" loading={loading} quantity={stats ? stats.totalDistance / 1000 : undefined} />
        <PerformanceItemComponent title="timeElapsed" loading={loading} quantity={stats ? stats.timeElapsed + 1 : undefined} />
        <PerformanceItemComponent title="totalElevationGain" loading={loading} quantity={stats?.totalElevationGain} />
        <PerformanceItemComponent title="totalElevationLoss" loading={loading} quantity={stats?.totalElevationLoss} />
        <PerformanceItemComponent title="maxAltitude" loading={loading} quantity={stats?.maxAltitude} />
        <PerformanceItemComponent title="minAltitude" loading={loading} quantity={stats?.minAltitude} />
      </div>

      {/* Gauge */}
      <div
        id="showScrollUpButton"
        className="gauge-container relative"
        style={{ width: "300px", height: "285px", display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {!loading && stats && user && (
          <RaisedAmountGauge amountLastUpdated={amountLastUpdated} collectedAmount={collectedAmount} performanceValue={stats[getGoalMeasure(user.goalMeasure).statElement]} goalMeasure={user.goalMeasure}/>
        )}
        {loading && (!stats || !user) && (
          <>
            <Skeleton animation="wave" variant="circular" height="180px" width="180px" />
            <Skeleton animation="wave" height={10} width="80%" />
            <Skeleton animation="wave" height={10} width="70%" />
            <Skeleton animation="wave" height={10} width="60%" />
          </>
        )}
        {!loading && !stats && (
          <RaisedAmountGauge amountLastUpdated={amountLastUpdated} collectedAmount={collectedAmount} performanceValue={0} goalMeasure={user ? user.goalMeasure : "km"}/>
        )}
      </div>

      {/* Map + Chart */}
      <MapComponent
        coordinates={stats?.coordinates as [number, number][]}
        currentLocation={!loading && !stats ? [43.3732318, -1.7740848] : (stats?.coordinates.slice(-1)[0] as [number, number])}
        centerCoordinates={!loading && !stats ? [43.3732318, -1.7740848] : (stats?.coordinates.slice(-1)[0] as [number, number])}
      />

      <ElevationChart altitude={stats?.altitudes ?? []} distance={stats?.distance_aggregated ?? []} loading={loading} />

      {/* Daily stats link */}
      <Link href={dailyStatsUrl}>
        <button className="custom-button" style={{ fontFamily: fredoka.style.fontFamily }}>
          <IoStatsChartOutline style={{ display: "inline" }} /> View Daily Stats
        </button>
      </Link>
      {!loading && user && (
        <ProjectDescription fundraiserUrl={user.fundraiserUrl} fundraiserDescription={user.fundraiserDescription} goalMeasure={user.goalMeasure}/>
      )}
      {/* Photos */}
      {!loading && stats && user && <PhotoAlbumComponent photos={convertHikePhotos(stats.photosUrl)} />}

      {/* Scroll-up button */}
      {showButton && (
        <a href="#statistics" className="scroll-down-button">
          <BsArrowUpSquareFill color="#fd5770" size={30} style={{ display: "inline" }} />
        </a>
      )}

      <Footer />
    </div>
  );
}
