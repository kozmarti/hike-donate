import { Activity } from "../entities/Activity";
import { dataAggregateWithConstant, deltaData, simplifyLatLngPolyline, totalElevationGain, totalElevationLoss } from "./calculation_functions_client";

interface StreamStrava {
    type: string;
    data: []; //coordinates
    series_type: string;
    original_size: number;
    resolution: string;
  }

export interface Stream {
    latlng: [];
    altitude: [];
    distance: [];
  }

interface Photo {
    unique_id: string;
    athlete_id: number;
    activity_id: number;
    activity_name: string;
    urls: {};
  }
  

/** * Removes duplicate coordinates from the Strava streams data.
 * @param streamsStrava - The Strava streams data to be cleaned.
 * @returns A cleaned Stream object with unique coordinates.
 */
const _removeDuplicatesStreamData = (streamsStrava: StreamStrava[]) => {
  // Transform strava response data to a more usable format
  // @ts-ignore
  let streams_transformed: Stream = {};
  streamsStrava.map((stream: StreamStrava) => {
    // @ts-ignore
    streams_transformed[stream.type] = stream.data;
  });

  // Clean the stream data to remove duplicates

  const latlngStream: [] = streams_transformed["latlng"];
  const distanceStream: [] = streams_transformed["distance"];
  const altitudeStream: [] = streams_transformed["altitude"];

  const cleanedlatlngStream: [] = [];
  const cleaneddistanceStream: [] = [];
  const cleanedaltitudeStream: [] = [];

  let previousCoordinate: number[] = [0,0];

  latlngStream.forEach((coordinate, index) => {
    if (JSON.stringify(coordinate) !== JSON.stringify(previousCoordinate)) {
      cleanedlatlngStream.push(coordinate);
      cleaneddistanceStream.push(distanceStream[index]);
      cleanedaltitudeStream.push(altitudeStream[index]);
      previousCoordinate = coordinate;
    }
  });
  const cleanedStreams: Stream = {
    latlng: cleanedlatlngStream,
    altitude: cleanedaltitudeStream,
    distance: cleaneddistanceStream,
  };

  return cleanedStreams;
}

/**
 * Synchronizes the streams data with the simplified coordinates.
 * @param originalCoords - The original coordinates from the Strava streams.
 * @param simplifiedCoords - The simplified coordinates after applying the Ramer-Douglas-Peucker algorithm.
 * @param altitude - The altitude data corresponding to the original coordinates.
 * @param distance - The distance data corresponding to the original coordinates.
 * @returns An object containing synchronized latitude/longitude, altitude, and distance arrays.
 */
const syncStreamsToSimplifiedCoords = (
  originalCoords: [number, number][],
  simplifiedCoords: [number, number][],
  altitude: number[],
  distance: number[]
) => {
  const indexMap = new Map<string, number>();

  // Map original coordinate string → index
  originalCoords.forEach((coord, idx) => {
    indexMap.set(coord.join(','), idx);
  });

  const syncedLatLng: [number, number][] = [];
  const syncedAltitude: number[] = [];
  const syncedDistance: number[] = [];

  simplifiedCoords.forEach((coord) => {
    const key = coord.join(',');
    const idx = indexMap.get(key);
    if (idx !== undefined) {
      syncedLatLng.push(coord);
      syncedAltitude.push(altitude[idx]);
      syncedDistance.push(distance[idx]);
    }
  });

  return {
    latlng: syncedLatLng,
    altitude: syncedAltitude,
    distance: syncedDistance,
  };
}



/**
 * Extracts and transforms data from Strava activity, photos, and streams into a structured Activity object.
 * @param activity_strava - The Strava activity data.
 * @param photos_strava - The Strava photos data.
 * @param streams_strava - The Strava streams data.
 * @param last_distance - The last recorded distance to be used in the transformation.
 * @returns An Activity object containing the extracted and transformed data.
 */
export const extractData = (
    activity_strava: any,
    photos_strava: any,
    streams_strava: any, // StreamStrava[],
    last_distance: number
  ) => {
    console.log("Extracting data");
    console.log(streams_strava)
    const streamsCleaned: Stream = _removeDuplicatesStreamData(streams_strava);
    const simplifiedLatLng = simplifyLatLngPolyline(streamsCleaned.latlng);
    console.log(simplifiedLatLng)

    const syncedStreams = syncStreamsToSimplifiedCoords(
      streamsCleaned.latlng,
      // @ts-ignore
      simplifiedLatLng,
      streamsCleaned.altitude,
      streamsCleaned.distance
    );
    console.log(syncedStreams)

    console.log("PHOTOS")
  
    const photo_urls: any = photos_strava.map(
      // @ts-ignore
      (photo: Photo) => photo.urls["5000"]
    );
  
    const delta_distances_aggregated = dataAggregateWithConstant(
      syncedStreams["distance"],
      last_distance
    );
    console.log("HEREEE last distance", last_distance);
    const delta_distances =  deltaData(syncedStreams["distance"]) 
    const delta_altitudes = deltaData(syncedStreams["altitude"])
  
    const total_elevation_loss = totalElevationLoss(delta_altitudes);
    const total_elevation_gain = totalElevationGain(delta_altitudes);
  
    const activity: Activity = {
      strava_user_id: activity_strava["athlete"]["id"],
      strava_activity_id: activity_strava["id"],
      start_time: activity_strava["start_date_local"],
      strava_project_name: activity_strava["name"],
      moving_time: activity_strava["moving_time"],
      total_distance: activity_strava["distance"],
      min_altitude: activity_strava["elev_low"],
      max_altitude: activity_strava["elev_high"],
      polyline: activity_strava["map"]["polyline"],
  
      strava_photo_urls: photo_urls,
  
      coordinates: syncedStreams["latlng"],
      altitudes: syncedStreams["altitude"],
      distances: syncedStreams["distance"],
  
      delta_altitudes: delta_altitudes,
      delta_distances: delta_distances,
      total_elevation_loss: total_elevation_loss,
      total_elevation_gain: total_elevation_gain,
      distances_aggregated: delta_distances_aggregated,
    };
    return activity;
  };

