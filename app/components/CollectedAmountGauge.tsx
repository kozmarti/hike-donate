import React from 'react'
import GaugeComponent from 'react-gauge-component';
import { HiInformationCircle } from 'react-icons/hi';

interface Props {
    collectedAmount: number;
    distance: number;
    amountLastUpdated: string;
}

const CollectedAmountGauge = ({collectedAmount, distance, amountLastUpdated}: Props) => {
    const distanceKm = (value: number) => {
        return value.toFixed(0) + ' km';
        }
    const collectedAmountEUR = (value: number) => {
            return '€' + value.toFixed(0);
            }

    const isDistanceCovered = (collectedAmount <= distance) ? false : true;
      
  return (
    <div className='gauge-container relative'>
      {/* Info icon in top-right corner */}
  <div className="absolute top-5 right-5 group cursor-pointer">
    <HiInformationCircle className="w-5 h-5 text-[#74816c]" />
    <div className="absolute top-6 right-0 hidden group-hover:block bg-white text-[10px] text-[#74816c] p-1 rounded shadow-md z-10 w-40 italic">
      Last updated : {amountLastUpdated}
    </div>
  </div>
    <GaugeComponent
    arc={{
      nbSubArcs: 100,
      colorArray: ['#fd5770','#cde8ce', '#6bffae'],
      width: 0.3,
      padding: 0.003,
      emptyColor: '#74816C',
    }}
    labels={{
      valueLabel: {
        matchColorWithArc: !isDistanceCovered,
        formatTextValue: collectedAmountEUR,
        style: {fontSize: "35px", fill: "#6bffae", textShadow: "0 0 5px #74816C"},

      },
      tickLabels: {
        defaultTickValueConfig: {
          formatTextValue: distanceKm,
          style: {fontSize: "10px", fill: "#black"}
        }
    }}}
    value={collectedAmount}
    maxValue={distance}
  />
  </div>
  )
}

export default CollectedAmountGauge;




