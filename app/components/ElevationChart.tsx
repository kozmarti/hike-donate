import * as React from 'react';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';


interface ElevationData {
  altitude: number[];
  distance: number[];
}

export default function ElevationChart({altitude, distance}: ElevationData) {
  return (
    <LineChart
      width={500}
      height={300}
      grid={{ vertical: true, horizontal: true  }}
      margin={{ top: 60, bottom: 60, left: 80, right: 60 }}
      series={[{ data: altitude, area: true, showMark: false, color: '#FD5770' }]}
      xAxis={[{ data: distance, label: 'Distance (m)'}]}
      yAxis={[{
        label: 'Altitude (m)',
      }]}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        '& .MuiAreaElement-root': {
          fill: '#FD5770',
          opacity: 0.5,
        },
        [`& .${axisClasses.left} .${axisClasses.label}`]: {
          transform: 'translateX(-20px)',
        },
      }}
    />
  );
}