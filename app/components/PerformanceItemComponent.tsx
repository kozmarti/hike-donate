import React from "react";
import { IconType } from "react-icons";
import CountUp from "react-countup";
import { GiPathDistance } from "react-icons/gi";
import { IoMdTrendingUp, IoMdTrendingDown } from "react-icons/io";
import { FaArrowDown, FaArrowUp, FaRegCalendarAlt } from "react-icons/fa";
import Image from 'next/image'

interface PerformanceItemData {
  title: string;
  icon: IconType;
  measure: string;
}

export interface PerformanceItemProps {
  title: string;
  quantity: number;
}

export const PerformanceItemComponent = ({ title, quantity }: PerformanceItemProps) => {
  const dataMap: { [key: string]: PerformanceItemData } = {
    totalDistance: {
      title: "Total Distance",
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
      <Image
      src="/distance.svg"
      width={50}
      height={50}
      alt="Picture of the author"
    />
          <Image
      src="/donation-heart.svg"
      width={50}
      height={50}
      alt="Picture of the author"
    />
    <Image
      src="/diagram-up.svg"
      width={50}
      height={50}
      alt="Picture of the author"
    />
      <DataIcon/> {dataMap[title].title}: <CountUp end={quantity} suffix={dataMap[title].measure} />
    </div>
  );
};
