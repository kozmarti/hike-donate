import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    console.log("webhook event received!", req.query, req.body);
    res.status(200).send("EVENT_RECEIVED");
   }
  // console.log("HEREEE");
  // // Your verify token. Should be a random string.
  // const VERIFY_TOKEN = "STRAVA";
  // // Parses the query params
  // let mode = req.query["hub.mode"];
  // let token = req.query["hub.verify_token"];
  // let challenge = req.query["hub.challenge"];
  // // Checks if a token and mode is in the query string of the request
  // if (mode && token) {
  //   // Verifies that the mode and token sent are valid
  //   if (mode === "subscribe" && token === VERIFY_TOKEN) {
  //     // Responds with the challenge token from the request
  //     console.log("WEBHOOK_VERIFIED");
  //     console.log({ "hub.challenge": challenge });
  //     res.json({ "hub.challenge": challenge });
  //   } else {
  //     // Responds with '403 Forbidden' if verify tokens do not match
  //     res.status(403);
  //   }
  // }
};
