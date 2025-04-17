import React from "react";
import { IconType } from "react-icons";
import CountUp from "react-countup";
import { GiPathDistance } from "react-icons/gi";
import { IoMdTrendingUp, IoMdTrendingDown } from "react-icons/io";
import { FaArrowDown, FaArrowUp, FaRegCalendarAlt } from "react-icons/fa";
import Image from 'next/image'

interface PerformanceItemData {
  title: string;
  icon: string;
  measure?: string;
}

export interface PerformanceItemProps {
  title: string;
  quantity?: number;
}

export const PerformanceItemComponent = ({ title, quantity }: PerformanceItemProps) => {
  const dataMap: { [key: string]: PerformanceItemData } = {
    totalDistance: {
      title: "Distance",
      icon: "/distance.svg",
      measure: "km",
    },
    totalElevationGain: {
        title: "Elevation Gain",
        icon: "/elevationGain.svg",
        measure: "m"
    },
    totalElevationLoss: {
        title: "Elevation Loss",
        icon: "/elevationLoss.svg",
        measure: "m"
    },
    minAltitude: {
        title: "Lowest Altitude",
        icon: "/minAltitude.svg",
        measure: "m",
    },
    maxAltitude: {
        title: "Highest Altitude",
        icon: "/maxAltitude.svg",
        measure: "m",
    },
    timeElapsed: {
        title: "Time Elapsed",
        icon: "/timeElapsed.svg",
        measure: "days"
    }

    
  };
  const DataIcon = dataMap[title].icon
  
  return (
<div className="performance-container">
     
<Image
      src={dataMap[title].icon}
      width={50}
      height={50}
      alt="Picture of the author"
    />{dataMap[title].title} : 
    {quantity && (
    <CountUp end={quantity} suffix={dataMap[title].measure} />
    )}
    {!quantity && (
    <Image
    src={"/loading.gif"}
    width={50}
    height={50}
    alt="Loading data..."
  />
    )}
    </div>
  );
};
