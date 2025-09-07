"use client";
import { PerformanceItemComponent } from "@/app/components/PerformanceItemComponent";
import { Activity } from "@/app/entities/Activity";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LatLngExpression } from "leaflet";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";


const MiniMapComponent = dynamic(() => import("../components/MiniMapComponent"), {
  ssr: false,
});

const ElevationChart = dynamic(() => import('@/app/components/ElevationChart'), {
  ssr: false,
});

interface Props {
  activities: Activity[];
  loading: boolean;
}
const hikeDateConvert = (hikeDate: string) => new Date(hikeDate).toISOString().split('T')[0];


const DailyStatsCarousel = ({ activities, loading }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const settings = {
    customPaging: function (i: number) {
      return (
        <span className="dot-number">{i + 1}</span>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true, // fixes vertical stretching
    arrows: false,
    beforeChange: (_: number, next: number) => setActiveSlide(next),

  };

  return (
    <div className="w-full mb-20">
      <Slider {...settings}>
        {activities.map((activity, index) => (
          <div
            key={index}
            className="map-wrapper"
          >
            <div className="description-container flex flex-col items-center">

              <h2 className="mb-4 font-bold">Day #{index + 1}, {hikeDateConvert(activity.start_time.toString())}</h2>

              <div className="container wrapper">
                <PerformanceItemComponent
                  title="totalDistance"
                  loading={loading}
                  quantity={(activity.total_distance / 1000)}
                />
                <PerformanceItemComponent
                  title="movingTime"
                  loading={loading}
                  quantity={(activity.moving_time / 60 / 60)}
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
                    key={`map-${index}`}
                    id={`map-${index}`}
                    coordinates={activity.coordinates as LatLngExpression[]}
                  />
                  <ElevationChart
                    key={`chart-${index}`}
                    altitude={activity.altitudes ?? []}
                    distance={activity.distances ?? []}
                    loading={loading}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default DailyStatsCarousel;