import { getActivityStreams } from "@/lib/strava";
import { NextApiRequest, NextApiResponse } from "next";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  const streams = await getActivityStreams(Number(id));
  console.log(streams)
  res.json(streams);
}
  