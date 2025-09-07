import React from "react";
import CountUp from "react-countup";
import Image from 'next/image'

interface PerformanceItemData {
  title: string;
  icon: string;
  measure: string;
  placeholder: string;
}

export interface PerformanceItemProps {
  title: string;
  quantity?: number;
  loading?: boolean;
}

export const PerformanceItemComponent = ({ title, quantity, loading=false }: PerformanceItemProps) => {
  const dataMap: { [key: string]: PerformanceItemData } = {
    totalDistance: {
      title: "Distance",
      icon: "/distance.svg",
      measure: " km",
      placeholder: "0",
    },
    totalElevationGain: {
        title: "Elevation Gain",
        icon: "/elevationGain.svg",
        measure: " m",
        placeholder: "-",
    },
    totalElevationLoss: {
        title: "Elevation Loss",
        icon: "/elevationLoss.svg",
        measure: " m",
        placeholder: "-",

    },
    minAltitude: {
        title: "Lowest Altitude",
        icon: "/minAltitude.svg",
        measure: " m",
        placeholder: "-",

    },
    maxAltitude: {
        title: "Highest Altitude",
        icon: "/maxAltitude.svg",
        measure: " m",
        placeholder: "-",

    },
    timeElapsed: {
        title: "Time Elapsed",
        icon: "/timeElapsed.svg",
        measure: " days",
        placeholder: "0",

    },
    movingTime: {
      title: "Hike time",
      icon: "/clock2.svg",
      measure: " h",
      placeholder: "0",

  }

    
  };
  const DataIcon = dataMap[title].icon
  
  return (
<div className="performance-container">
     
<Image
      src={dataMap[title].icon}
      width={50}
      height={50}
      alt={"Picture of " + dataMap[title].title}
    />{dataMap[title].title} : 
    {quantity && (
    <CountUp end={quantity} suffix={dataMap[title].measure} />
    )}
    {!quantity && loading && (
    <Image
    src={"/loading.gif"}
    width={50}
    height={50}
    alt="Loading data..."
  />
    )}
        {!quantity && !loading && (
    <span> {dataMap[title].placeholder} {dataMap[title].measure}</span>
    )}
    </div>
  );
};
