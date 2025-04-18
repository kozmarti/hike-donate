import * as React from 'react';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { Fredoka } from 'next/font/google';


interface ElevationData {
  altitude: number[];
  distance: number[];
  loading: boolean;
}
const fredoka = Fredoka({
  subsets: ['latin'],
  weight: '400', // You can change weight as needed (e.g., '400' for normal, '700' for bold)
});

export default function ElevationChart({altitude, distance, loading}: ElevationData) {
  const distanceInKm = distance.map((d) => d / 1000);
  return (
    <div className='border-wrapper'>
    <LineChart
    loading={loading}
      grid={{ vertical: true, horizontal: true  }}
      margin={{ top: 10, bottom: 50, left: 65, right: 10 }}
      series={[{ data: altitude, area: true, showMark: false, baseline: 'min', color: '#FD5770' }]}
      xAxis={[{ data: distanceInKm, label: 'Distance (km)', scaleType: 'linear', max:distanceInKm[distanceInKm.length - 1]}]}
      yAxis={[{
        label: 'Altitude (m)',
      }]}
      // tooltip={{ trigger: 'none' }}
      
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        '& .MuiAreaElement-root': {
          fill: '#FD5770',
          opacity: 0.5,
        },
        [`& .${axisClasses.bottom} .${axisClasses.label}`]: {
          fontFamily: fredoka.style.fontFamily,
          fontSize: '14px',
        },
        [`& .${axisClasses.left} .${axisClasses.label}`]: {
          transform: 'translateX(-20px)',
          fontFamily: fredoka.style.fontFamily,
          fontSize: '14px',
        },
        [`& .${axisClasses.bottom} .${axisClasses.tickLabel}`]: {
          fontFamily: fredoka.style.fontFamily,
          fontSize: '12px',
        },
        [`& .${axisClasses.left} .${axisClasses.tickLabel}`]: {
          fontFamily: fredoka.style.fontFamily,
          fontSize: '12px',
        },
      }}
    />
    </div>
  );
}