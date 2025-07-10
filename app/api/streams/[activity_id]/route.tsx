import { getActivityStreams } from "@/lib/strava";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { activity_id: number } }
) {
  const { activity_id } = params;
  console.log(params);
  const streams = await getActivityStreams(Number(activity_id));
  console.log(streams);
  return NextResponse.json(streams);
}
