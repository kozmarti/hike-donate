import { getActivityStreams } from "@/lib/strava";
import { NextApiRequest, NextApiResponse } from "next";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  const activity = await getActivityStreams(Number(id));
  console.log(activity)
  res.json(activity);
}
  