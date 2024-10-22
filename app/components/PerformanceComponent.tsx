import React from "react";
import { IconType } from "react-icons";
import CountUp from "react-countup";
import { GiPathDistance } from "react-icons/gi";
import { IoMdTrendingUp, IoMdTrendingDown } from "react-icons/io";
import { FaArrowDown, FaArrowUp, FaRegCalendarAlt } from "react-icons/fa";

interface PerformanceData {
  title: string;
  icon: IconType;
  measure: string;
}

interface Props {
  title: string;
  quantity: number;
}

export const PerformanceComponent = ({ title, quantity }: Props) => {
  const dataMap: { [key: string]: PerformanceData } = {
    totalDistance: {
      title: "Distance",
      icon: GiPathDistance,
      measure: "km",
    },
    totalElevationGain: {
        title: "Total Elevation Gain",
        icon: IoMdTrendingUp,
        measure: "m"
    },
    totalElevationLoss: {
        title: "Total Elevation Loss",
        icon: IoMdTrendingDown,
        measure: "m"
    },
    minAltitude: {
        title: "Lowest Altitude",
        icon: FaArrowDown,
        measure: "m",
    },
    maxAltitude: {
        title: "Highest Altitude",
        icon: FaArrowUp,
        measure: "m",
    },
    timeElapsed: {
        title: "Time Elapsed",
        icon: FaRegCalendarAlt,
        measure: "days"
    }

    
  };
  const DataIcon = dataMap[title].icon
  
  return (
    <div>
      <DataIcon/> {dataMap[title].title}: <CountUp end={quantity} suffix={dataMap[title].measure} />
    </div>
  );
};
