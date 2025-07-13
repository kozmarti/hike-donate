import { DataOutputFromForm } from "../components/ActivityFormComponent";
import { Activity } from "../entities/Activity";
import simplify from '@turf/simplify';
import type { LatLngExpression } from 'leaflet';
import { Feature, LineString } from 'geojson';
import { useLastActivityDistance } from "../hooks/useLastActivityDistance";

export const getLastDistance = async (
  startDateLocal: string,
) => {
  const lastActivityDistance = await useLastActivityDistance(startDateLocal);
  return lastActivityDistance.last_distance;
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


/**
 * Simplifies a GPS track to optimize leaflet map rendering. (Ramer–Douglas–Peucker algorithm)
 * @param coords - original coordinates in [lat, lon] format
 * @param maxPoints - maximum number of returned points
 * @param minPoints - minimum number of returned points
 * @returns simplified coordinates in [lat, lon] format
 */
export function simplifyLatLngPolyline(
  coords: [number, number][],
  maxPoints = 110,
  minPoints = 100
): LatLngExpression[] {
  if (!coords || coords.length <= 150) return coords;

  const geojson: Feature<LineString> = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: coords.map(([lat, lon]: [number, number]) => [lon, lat]),
    },
    properties: {
      originalPointCount: coords.length,
    },

  };

  let tolerance = 0.00001;
  let simplified = geojson;
  let simplifiedCoords = geojson.geometry.coordinates;

  while (simplifiedCoords.length > maxPoints && tolerance < 0.001) {
    const temp = simplify(geojson, { tolerance, highQuality: true });
    const tempCoords = temp.geometry.coordinates;

    if (tempCoords.length >= minPoints) {
      simplified = temp;
      simplifiedCoords = tempCoords;
    } else {
      break;
    }

    tolerance *= 1.2;
  }
  console.log(`Simplified coordinates from ${coords.length} to ${simplifiedCoords.length} with tolerance ${tolerance}`);
  console.log("Simplified coordinates:", simplifiedCoords);

  return simplifiedCoords.map(([lon, lat]) => [lat, lon]);
}