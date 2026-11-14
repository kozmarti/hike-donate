import clientPromise from "@/lib/mongodb";
import { requireProjectOwner } from "@/lib/project-access";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    strava_user_id: string;
    project_slug: string;
    activity_id: string;
  };
};

// endpoint: api/user/{strava_user_id}/project/{project_slug}/activities/{activity_id}
export async function GET(req: NextRequest, { params }: Params) {
  const { strava_user_id, project_slug, activity_id } = params;
  if (!ObjectId.isValid(activity_id)) {
    return new NextResponse("Invalid activity id", { status: 400 });
  }

  try {
    const client = await clientPromise;
    const activity = await client
      .db("hike")
      .collection("activities")
      .findOne({
        _id: new ObjectId(activity_id),
        strava_user_id: parseInt(strava_user_id, 10),
        strava_project_name: project_slug,
      });
    if (!activity) return new NextResponse("Activity not found", { status: 404 });
    return NextResponse.json(activity);
  } catch (e) {
    console.error("GET activity error:", e);
    return new NextResponse("Error fetching activity", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { strava_user_id, project_slug, activity_id } = params;

  const owner = await requireProjectOwner(req, strava_user_id, project_slug);
  if (owner instanceof Response) return owner;

  if (!ObjectId.isValid(activity_id)) {
    return new NextResponse("Invalid activity id", { status: 400 });
  }

  try {
    const client = await clientPromise;
    const result = await client
      .db("hike")
      .collection("activities")
      .deleteOne({
        _id: new ObjectId(activity_id),
        strava_user_id: owner.stravaUserId,
        strava_project_name: owner.projectName,
      });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    }
    return new NextResponse("Activity not found", { status: 404 });
  } catch (e) {
    console.error("DELETE error:", e);
    return new NextResponse("Error deleting activity", { status: 500 });
  }
}
