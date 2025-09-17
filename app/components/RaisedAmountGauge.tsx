import { BsArrowDownSquareFill } from "react-icons/bs";
import React from 'react'
import { HiInformationCircle } from 'react-icons/hi';
import dynamic from "next/dynamic";
import { FaHeart } from "react-icons/fa";
import { GoalMeasureKey } from "../entities/GoalMeasureConfig";

const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

interface Props {
  collectedAmount: number;
  goalMeasure: GoalMeasureKey;
  amountLastUpdated: string;
  performanceValue: number;
}

const CollectedAmountGauge = ({ collectedAmount, goalMeasure, performanceValue, amountLastUpdated }: Props) => {
  performanceValue = Math.round(performanceValue)
  const distanceKm = (value: number) => {
    if (value === collectedAmount) {
      return performanceValue + ' ' + goalMeasure;
    }
    return Math.round(value).toLocaleString() + ' ' + goalMeasure;
  }
  const collectedAmountEUR = (value: number) => {
    return '€' + Math.round(value).toLocaleString();
  }
  return (
    <>

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
        maxValue={performanceValue == 0 ? 100 : (collectedAmount >= performanceValue) ? collectedAmount : performanceValue}
      />



      <div style={{ textAlign: "center" }}>
        {performanceValue !== 0 && (
          <>
            {performanceValue > collectedAmount && (
              <p className="distance-info"><strong>{collectedAmount} {goalMeasure}</strong> already covered <FaHeart style={{ display: "inline", color: "#6BFFAE" }} />
                , <strong>{performanceValue - collectedAmount} {goalMeasure}</strong> still waiting for sponsors.</p>
            )}
            {performanceValue <= collectedAmount && (
              <p className="distance-info"> <strong>{performanceValue} {goalMeasure}</strong> hiked, <strong>€ {Math.round(collectedAmount).toLocaleString()} </strong> raised — all covered, thank you! <FaHeart style={{ display: "inline", color: "#6BFFAE" }} />
              </p>
            )}

            <div className="absolute top-5 right-5 group cursor-pointer">

              <HiInformationCircle className="w-5 h-5 text-[#74816c]" />
              <div className="absolute top-6 right-0 hidden group-hover:block bg-white text-[10px] text-[#74816c] p-1 rounded shadow-md z-10 w-40 italic">
                Last updated from Leetchi: {amountLastUpdated}
              </div>
            </div>

          </>
        )}
        {performanceValue == 0 && (
          <p>Starting soon ...</p>

        )}
        <p> Learn more  <a href="#fundraising-description"><BsArrowDownSquareFill color="#fd5770" size={20} style={{ display: "inline" }} /></a>
        </p>
      </div>
    </>
  )
}

export default CollectedAmountGauge;




