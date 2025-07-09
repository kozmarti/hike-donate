export interface Activity {
    strava_user_id: number;
    start_time: Date;
    strava_project_name: string;
    moving_time: number; // seconds
    coordinates: number[][];
    strava_activity_id: number;
    strava_photo_urls: string[];
    altitudes: number[]; //metre
    delta_altitudes: number[]; //metre
    distances: number[]; //metre
    delta_distances: number[]; //metre
    total_distance: number; //metre
    min_altitude: number; //metre
    max_altitude: number; //metre
    total_elevation_gain: number;
    total_elevation_loss: number; //metre
    polyline: string; //metre
    distances_aggregated: number[]; //metre
  }