import { getActivities } from "@/lib/strava";

import { NextApiRequest, NextApiResponse } from 'next';
import { act } from "react";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const activities = await getActivities();
  res.json(activities)
}


