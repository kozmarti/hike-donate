"use client";

import { useState, useEffect } from "react";
import { PerformanceItemComponent } from "@/app/components/PerformanceItemComponent";
import { Activity } from "@/app/entities/Activity";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const MiniMapComponent = dynamic(() => import("../components/MiniMapComponent"), {
  ssr: false,
});
const ElevationChart = dynamic(() => import("@/app/components/ElevationChart"), {
  ssr: false,
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

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="w-full mb-10">
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
      >
        {activities.map((activity, index) => (
          <SwiperSlide key={index}>
            <div className="description-container map-wrapper mb-40 flex flex-col items-center">
              <h2 className="mb-4 font-bold">
                Day #{index + 1},{" "}
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
                  <MiniMapComponent
                    id={`map-${index}`}
                    coordinates={
                      activity.coordinates as LatLngExpression[]
                    }
                  />
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
    </div>
  );
};

export default DailyStatsCarousel;