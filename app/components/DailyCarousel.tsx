"use client";

import { useState, useEffect, useRef } from "react";
import { PerformanceItemComponent } from "@/app/components/PerformanceItemComponent";
import { Activity } from "@/app/entities/Activity";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Skeleton from '@mui/material/Skeleton';
import "swiper/css";
import "swiper/css/pagination";
import DownloadGpxButton from "./DownloadGPXButton";
import Link from "next/link";
import { IoHomeOutline } from "react-icons/io5";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({ subsets: ['latin'] });

const MiniMapComponent = dynamic(() => import("../components/MiniMapComponent"), {
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
const ElevationChart = dynamic(() => import("@/app/components/ElevationChart"), {
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

interface Props {
  activities: Activity[];
  loading: boolean;
}

const hikeDateConvert = (hikeDate: string) =>
  new Date(hikeDate).toISOString().split("T")[0];

const DailyStatsCarousel = ({ activities, loading }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<any>(null);

  const handleMapEnter = () => {
    if (swiperRef.current) swiperRef.current.allowTouchMove = false;
  };

  const handleMapLeave = () => {
    if (swiperRef.current) swiperRef.current.allowTouchMove = true;
  };

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="w-full">
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
          renderBullet: (index, className) =>
            `<button class="${className} dot-number">${index + 1}</button>`,
        }}
        spaceBetween={30}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {activities.map((activity, index) => (
          <SwiperSlide key={index}>
            <div className="description-container mt-40 flex flex-col items-center">
              <h2 className="mb-4 text-xl" >
                Day <span className="day-counter" >{index + 1}</span>{"  "}
                {hikeDateConvert(activity.start_time.toString())}
              </h2>

              <div className="container wrapper">
                <PerformanceItemComponent
                  title="totalDistance"
                  loading={loading}
                  quantity={activity.total_distance / 1000}
                />
                <PerformanceItemComponent
                  title="movingTime"
                  loading={loading}
                  quantity={activity.moving_time / 60 / 60}
                />
                <PerformanceItemComponent
                  title="totalElevationGain"
                  loading={loading}
                  quantity={activity.total_elevation_gain}
                />
                <PerformanceItemComponent
                  title="totalElevationLoss"
                  loading={loading}
                  quantity={activity.total_elevation_loss}
                />
                <PerformanceItemComponent
                  title="maxAltitude"
                  loading={loading}
                  quantity={activity.max_altitude}
                />
                <PerformanceItemComponent
                  title="minAltitude"
                  loading={loading}
                  quantity={activity.min_altitude}
                />
              </div>

              {activeSlide === index && (
                <>
                  <div
                    onMouseEnter={handleMapEnter}
                    onMouseLeave={handleMapLeave}
                    onTouchStart={handleMapEnter}
                    onTouchEnd={handleMapLeave}>
                    <MiniMapComponent
                      id={`map-${index}`}
                      coordinates={
                        activity.coordinates as LatLngExpression[]
                      }
                    />
                                      </div>

                    <DownloadGpxButton polyline={activity.coordinates} filename="hike-donate-track.gpx" />

                  <ElevationChart
                    altitude={activity.altitudes ?? []}
                    distance={activity.distances ?? []}
                    loading={loading}
                  />
                </>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex items-center justify-center m-0 p-0"> 
      <Link href="/" >
        <button
          className="custom-button"
          style={{
            fontFamily: fredoka.style.fontFamily,
          }}>
          <IoHomeOutline style={{ display: "inline" }} /> Home
        </button>
      </Link>
      </div>
    </div>
  );
};

export default DailyStatsCarousel;