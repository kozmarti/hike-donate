// app/api/profile/route.ts
import { encrypt } from "@/app/utils/encrypt-data";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email, name, stravaClientId, stravaClientSecret, projectName, goalMeasure, fundraiserUrl, fundraiserDescription } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hike");

    const updateFields: any = {};
    if (name) updateFields.name = name;
    if (stravaClientId) updateFields.stravaClientId = stravaClientId;
    if (projectName) updateFields.projectName = projectName;
    if (goalMeasure) updateFields.goalMeasure = goalMeasure;
    if (fundraiserUrl) updateFields.fundraiserUrl = fundraiserUrl;
    if (fundraiserDescription) updateFields.fundraiserDescription = fundraiserDescription;
    if (stravaClientSecret) updateFields.stravaClientSecret = encrypt(stravaClientSecret); // 🔐 encrypt before saving

    if (Object.keys(updateFields).length === 0) {
      return new Response(JSON.stringify({ error: "Nothing to update" }), { status: 400 });
    }

    await db.collection("users").updateOne(
      { email },
      { $set: updateFields }
    );

    return new Response(JSON.stringify({message: email}), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
