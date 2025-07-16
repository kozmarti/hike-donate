import { BsArrowDownSquareFill } from "react-icons/bs";
import React from 'react'
import { HiInformationCircle } from 'react-icons/hi';
import dynamic from "next/dynamic";
import { FaHeart } from "react-icons/fa";

const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

interface Props {
  collectedAmount: number;
  distance: number;
  amountLastUpdated: string;
}

const CollectedAmountGauge = ({ collectedAmount, distance, amountLastUpdated }: Props) => {
  console.log("Collected Amount Gauge", collectedAmount, distance, amountLastUpdated);
  console.log("max value", (collectedAmount >= distance) ? collectedAmount : distance);
  distance = Math.round(distance)
  const distanceKm = (value: number) => {
    if (value === collectedAmount) {
      return distance + ' km';
    }
    return Math.round(value).toLocaleString() + ' km';
  }
  const collectedAmountEUR = (value: number) => {
    return '€' + Math.round(value).toLocaleString();
  }
  return (
    //<div className='gauge-container relative'>
<>
<div className="absolute top-5 right-5 group cursor-pointer">
        <HiInformationCircle className="w-5 h-5 text-[#74816c]" />
        <div className="absolute top-6 right-0 hidden group-hover:block bg-white text-[10px] text-[#74816c] p-1 rounded shadow-md z-10 w-40 italic">
          Last updated from Leetchi: {amountLastUpdated}
        </div>
      </div>
      <GaugeComponent
        arc={{
          nbSubArcs: 100,
          colorArray: ['#fd5770', '#cde8ce', '#6bffae'],
          width: 0.3,
          padding: 0.003,
          emptyColor: '#74816C',
          subArcs: [{ color: 'red' }],
        }}
        labels={{
          valueLabel: {
            matchColorWithArc: true,
            formatTextValue: collectedAmountEUR,
            style: { fontSize: "35px", fill: "#6bffae", textShadow: "0 0 5px #74816C" },

          },
          tickLabels: {
            defaultTickValueConfig: {
              formatTextValue: distanceKm,
              style: { fontSize: "10px", fill: "black" }
            },
          }
        }}
        value={collectedAmount}
        maxValue={(collectedAmount >= distance) ? collectedAmount : distance}
      />
<div style={{textAlign: "center"}}>
      {distance > collectedAmount && (
        <p className="distance-info"><strong>{collectedAmount} km</strong> already covered <FaHeart style={{ display: "inline", color: "#6BFFAE" }} />
          , <strong>{distance - collectedAmount} km</strong> still waiting for sponsors.</p>
      )}
      {distance <= collectedAmount && (
        <p className="distance-info"> <strong>{distance} km</strong> hiked, <strong>€ {Math.round(collectedAmount).toLocaleString()} </strong> raised — all covered, thank you! <FaHeart style={{ display: "inline", color: "#6BFFAE" }} />
        </p>
      )}
      <p> Learn more  <a href="#fundraising-description"><BsArrowDownSquareFill color="#fd5770" size={20} style={{ display: "inline" }} /></a>
      </p>
      </div>
      </>
   // </div>
  )
}

export default CollectedAmountGauge;




