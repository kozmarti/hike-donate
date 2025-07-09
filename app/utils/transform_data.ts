import { Activity } from "../entities/Activity";
import { dataAggregateWithConstant, deltaData, totalElevationGain, totalElevationLoss } from "./calculation_functions_client";

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
  
export const cleanStreamData = (streamsStrava: StreamStrava[]) => {
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
    if (coordinate != previousCoordinate) {
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


export const extract_data = (
    activity_strava: any,
    photos_strava: any,
    streams_strava: any, // StreamStrava[],
    last_distance: number
  ) => {
    console.log("Extracting data");
  
    const streams_extracted: Stream = cleanStreamData(streams_strava);
  
    const photo_urls: any = photos_strava.map(
      // @ts-ignore
      (photo: Photo) => photo.urls["5000"]
    );
  
    const delta_distances_aggregated = dataAggregateWithConstant(
      streams_extracted["distance"],
      last_distance
    );
    console.log("HEREEE last distance", last_distance);
    const delta_distances =  deltaData(streams_extracted["distance"]) 
    const delta_altitudes = deltaData(streams_extracted["altitude"])
  
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
  
      coordinates: streams_extracted["latlng"],
      altitudes: streams_extracted["altitude"],
      distances: streams_extracted["distance"],
  
      delta_altitudes: delta_altitudes,
      delta_distances: delta_distances,
      total_elevation_loss: total_elevation_loss,
      total_elevation_gain: total_elevation_gain,
      distances_aggregated: delta_distances_aggregated,
    };
    return activity;
  };

