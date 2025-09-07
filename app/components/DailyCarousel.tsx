"use client";
import { PerformanceItemComponent } from "@/app/components/PerformanceItemComponent";
import { Activity } from "@/app/entities/Activity";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LatLngExpression } from "leaflet";
import ElevationChart from "./ElevationChart";
import dynamic from 'next/dynamic';

const MiniMapComponent = dynamic(() => import("../components/MiniMapComponent"), {
  ssr: false,
});

interface Props {
  activities: Activity[];
  loading?: boolean;
}

const DailyStatsCarousel = ({ activities, loading }: Props) => {
  const settings = {
    customPaging: function(i: number) {
      return (
        <span className="dot-number">{i + 1}</span>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    lazyLoad: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true, // fixes vertical stretching
    arrows: false,
    responsive: [
      {
        breakpoint: 640, // mobile breakpoint
        settings: {
          arrows: false, // hide arrows on small screens
          dots: true,
        },
      },
    ],
  };
  const hikeDateConvert = (hikeDate: string) => new Date(hikeDate).toISOString().split('T')[0];

  return (
    <div className="w-full mb-20">
      <Slider {...settings}>
        {activities.map((activity, index) => (
          <div
            key={index}
            className="description-wrapper map-wrapper"
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
                quantity={(activity.moving_time / 60 /60)}
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
            
            <MiniMapComponent id={index.toString()} coordinates={activity.coordinates as LatLngExpression[]} />
          <ElevationChart altitude={activity.altitudes ?? []} distance={activity.distances ?? []} loading={false} />
          </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default DailyStatsCarousel;