import React from 'react'
import GaugeComponent from 'react-gauge-component';

interface Props {
    collectedAmount: number;
    distance: number;
}

const CollectedAmountGauge = ({collectedAmount, distance}: Props) => {
    const distanceKm = (value: number) => {
        return value.toFixed(0) + ' km';
        }
    const collectedAmountEUR = (value: number) => {
            return '€' + value.toFixed(0);
            }

    const isDistanceCovered = (collectedAmount <= distance) ? false : true;
      
  return (
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
  )
}

export default CollectedAmountGauge;




