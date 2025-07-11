import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { Fredoka } from 'next/font/google';
import { useEffect, useState } from 'react';
import { AxisValueFormatterContext } from '@mui/x-charts/internals';


interface ElevationData {
  altitude: number[];
  distance: number[];
  loading: boolean;
}
const fredoka = Fredoka({
  subsets: ['latin'],
  weight: '400',
});

export default function ElevationChart({altitude, distance, loading}: ElevationData) {
  const distanceInKm = distance.map((d) => d / 1000);
  const [chartKey, setChartKey] = useState(0);
  const forceRerender = () => {
    setChartKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    let prevWidth = window.innerWidth;
  
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth !== prevWidth) {
        prevWidth = currentWidth;
        forceRerender();
      }
    };
  
    const timeout = setTimeout(() => {
      forceRerender();
    }, 1000);
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='border-wrapper'>
    <LineChart
    key={chartKey}
    loading={loading}
      grid={{ vertical: true, horizontal: true  }}
      margin={{ top: 10, bottom: 50, left: 65, right: 10 }}
      series={[{ data: altitude, area: true, showMark: false, baseline: 'min', color: '#FD5770', valueFormatter: (value, context) => `Altitude: ${value}m` }]}
      xAxis={[{ data: distanceInKm, label: 'Distance (km)', scaleType: 'linear', 
        valueFormatter: (value, context: AxisValueFormatterContext) => 
        context.location === 'tooltip'
        ? `Distance: ${value.toFixed(2)}km`
        : value.toFixed(0), 
        max: distanceInKm[distanceInKm.length - 1]}]}
      yAxis={[{
        label: 'Altitude (m)',
      }]}
      tooltip={{ trigger: 'axis' }}
      
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