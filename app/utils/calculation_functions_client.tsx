export const getLastDistance = async (
  startDateLocal: string,
  stravaUserId: number,
  stravaProjectName: string
) => {
  const res = await fetch(
    `/api/user/${stravaUserId}/project/${stravaProjectName}/activities?start_date_local=${encodeURIComponent(startDateLocal)}`
  );

  const data = await res.json();
  return data.last_distance;
};

export const deltaData = (
  streams: number[],
) => {      
  const delta_data = streams.map(
    (d, index) =>
      Math.round((d - streams[index - 1]) * 10) / 10
  );
  delta_data.shift();
  return delta_data;
}

export const totalElevationGain = (
  delta_altitudes: number[],
) => {    
  const total_elevation_gain =
    Math.round(
      delta_altitudes.reduce(
        (partialSum, a) => partialSum + (a > 0 ? a : 0),
        0
      ) * 10
    ) / 10;
  return total_elevation_gain;
}

export const totalElevationLoss = (
  delta_altitudes: number[],
) => {
  const total_elevation_loss =
    Math.round(
      delta_altitudes.reduce(
        (partialSum, a) => partialSum + (a < 0 ? a : 0),
        0
      ) * 10
    ) / 10;
  return total_elevation_loss;
}

export const aggregateData = (streams: number[]) => {
  let accumulated = 0; 
  const data_aggregated = streams.map((d) => {
    accumulated += d;  
    return Math.round(accumulated * 10) / 10; 
  });
  return data_aggregated;
};

export const dataAggregateWithConstant = (data: number[], constant: number) => {
    const data_aggregated_with_constant = data.map(
        (d, index) =>
          Math.round((d + constant) * 10) / 10
      );
  return data_aggregated_with_constant;
}

export const distanceBetweenTwoPoints = (
  coord1: number[],
  coord2: number[],
) => {  
    const lat1 = coord1[0];
    const lon1 = coord1[1];
    const lat2 = coord2[0];
    const lon2 = coord2[1];
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ in radians
  const φ2 = (lat2 * Math.PI) / 180; // φ in radians
  const Δφ = ((lat2 - lat1) * Math.PI) / 180; // difference in latitude in radians
  const Δλ = ((lon2 - lon1) * Math.PI) / 180; // difference in longitude in radians

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) *
      Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
}


export const getDeltaDistances = (coordinates: number[][]): number[] => {
    const deltas: number[] = [0]; // First delta is always zero
  
    for (let i = 1; i < coordinates.length; i++) {
      const dist = distanceBetweenTwoPoints(coordinates[i - 1], coordinates[i]);
      deltas.push(dist);
    }
  
    return deltas;
  };