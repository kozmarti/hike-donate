export default interface Webhook {

}


export async function POST(request: Request) {
  const data = await request.json();
  console.log("webhook event received!", data);
  if (data["aspect_type"] == "update") {
  }
  return new Response("EVENT_RECEIVED", {
    status: 200,
  });
}

export async function GET(request: Request) {
  console.log(request.url);
  const { searchParams } = new URL(request.url);
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = "STRAVA";
  // Parses the query params
  let mode = searchParams.get("hub.mode");
  let token = searchParams.get("hub.verify_token");
  let challenge = searchParams.get("hub.challenge");
  // Checks if a token and mode is in the query string of the request
  console.log(mode);
  console.log(token);
  console.log(challenge);

  if (mode && token) {
    // Verifies that the mode and token sent are valid
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      console.log({ "hub.challenge": challenge });
      return Response.json({ "hub.challenge": challenge });
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      return new Response("FORBIDDEN", {
        status: 403,
      });
    }
  }
}
