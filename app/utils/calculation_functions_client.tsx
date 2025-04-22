import { Activity } from "../api/user/[strava_user_id]/project/[project_slug]/activities/route";
import { DataOutputFromForm } from "../components/ActivityFormComponent";

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


export type PhotoEntry = {
  hikeDate: string;
  photos: string[];
};

type PhotoOutput = {
  src: string;
  date: string;
};

export const convertHikePhotos = (data: PhotoEntry[]): PhotoOutput[] => {
  console.log("Data received in convertHikePhotos:", data);
  const result: PhotoOutput[] = [];

  data.forEach(entry => {
    const date = new Date(entry.hikeDate).toISOString().split('T')[0]; // Get "YYYY-MM-DD"
    entry.photos.forEach(photoUrl => {
      result.push({
        src: photoUrl,
        date: date
      });
    });
  });

  return result;
}

export const transformData = (dataIn: DataOutputFromForm, altitudes: number[], last_distance: number): Activity => {
    const delta_altitudes = deltaData(altitudes);
    const total_elevation_gain = totalElevationGain(delta_altitudes);
    const total_elevation_loss = totalElevationLoss(delta_altitudes);
    const delta_distances = getDeltaDistances(dataIn.coordinates);
    const distances = aggregateData(delta_distances)
    const delta_distances_aggregated = dataAggregateWithConstant(distances, last_distance);

    return {
        strava_user_id: 147153150,
        strava_activity_id: Number(Date.now()),
        start_time: dataIn.start_time,
        strava_project_name: "test",
        moving_time: dataIn.moving_time,
        total_distance: Math.max(...distances),
        min_altitude: Math.min(...altitudes),
        max_altitude: Math.max(...altitudes),
        polyline: "",
        strava_photo_urls: dataIn.photos,
        coordinates: dataIn.coordinates,
        altitudes: altitudes,
        distances: distances,
        delta_altitudes: delta_altitudes,
        delta_distances: delta_distances,
        total_elevation_loss: total_elevation_loss,
        total_elevation_gain: total_elevation_gain,
        distances_aggregated: delta_distances_aggregated,
    };
}

export const getCalculatedAltitudes = async (coords: number[][]): Promise<number[]> => {
    const altitudePromises = coords.map(async ([lat, lng]) => {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`);
            const data = await response.json();
            return data.elevation;
        } catch (error) {
            console.error("Error fetching altitude:", error);
            return null;
        }
    });

    const altitudes = await Promise.all(altitudePromises);
    return altitudes;
};

export function timeStringToSeconds(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 3600 + minutes * 60;
}