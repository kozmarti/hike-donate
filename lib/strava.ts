// this should be refacto to get logged in user data
const clientId = process.env.STRAVA_CLIENT_ID;
const clientSecret = process.env.STRAVA_CLIENT_SECRET;
const refreshToken = process.env.STRAVA_REFRESH_TOKEN;

const userId = process.env.STRAVA_USER_ID;;
const TOKEN_ENDPOINT = "https://www.strava.com/oauth/token";
const ATHLETES_ENDPOINT = `https://www.strava.com/api/v3/athletes/${userId}`;
const ACTIVITY_ENDPOINT = "https://www.strava.com/api/v3/";


const getAccessToken = async (  client_id: string,
  client_secret: string,
  refresh_token: string) => {
  const body = JSON.stringify({
    client_id: client_id,
    client_secret: client_secret,
    refresh_token: refresh_token,
    grant_type: "refresh_token",
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body,
  });

  return response.json();
};

export const getActivities = async (  client_id: string,
  client_secret: string,
  refresh_token: string,
) => {
  const { access_token: accessToken } = await getAccessToken(client_id, client_secret, refresh_token);
  const response = await fetch(
    `${ATHLETES_ENDPOINT}/activities?access_token=${accessToken}`
  );
  const json = await response.json();

  const publicActivities = json.filter(
    (activity: any) => activity.visibility === "everyone"
  );

  return publicActivities;
};


export const getActivity = async (id: number,
  client_id: string,
    client_secret: string,
    refresh_token: string,
) => {
  const { access_token: accessToken } = await getAccessToken(client_id, client_secret, refresh_token);
  const response = await fetch(
    `${ACTIVITY_ENDPOINT}/activities/${id}?access_token=${accessToken}`
  );
  const json = await response.json();
  return json;
};

export const getActivityPhotos = async (id: number, client_id: string,
  client_secret: string,
  refresh_token: string,
) => {
  const { access_token: accessToken } = await getAccessToken(client_id, client_secret, refresh_token);
  const response = await fetch(
    `${ACTIVITY_ENDPOINT}/activities/${id}/photos?size=5000`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const json = await response.json();
  return json;
};


export const getActivityStreams = async (id: number, client_id: string,
  client_secret: string,
  refresh_token: string,
) => {
  // /activities/{id}/streams
  // This endpoint returns the activity streams for a given activity ID
  // Sample Response
  // [ {
  //  "type" : "distance",
  //  "data" : [ 2.9, 5.8, 8.5, 11.7, 15, 19, 23.2, 28, 32.8, 38.1, 43.8, 49.5 ],
  //  "series_type" : "distance",
  //  "original_size" : 12,
  //  "resolution" : "high"
  //} ]
  const { access_token: accessToken } = await getAccessToken(client_id, client_secret, refresh_token);
    const response = await fetch(
      `${ACTIVITY_ENDPOINT}/activities/${id}/streams?keys=distance,altitude,latlng,time&access_token=${accessToken}`
    );
    const json = await response.json();
    return json;
  };

