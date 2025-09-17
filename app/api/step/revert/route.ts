// app/api/step/revert/route.ts
import { getUserEmailFromCookie } from "@/app/utils/getUserEmail";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const email = getUserEmailFromCookie(cookieHeader);
    
    if (!email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const { step } = await req.json();
    if (!step) {
      return new Response(JSON.stringify({ error: "Step are required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hike");

    // Revert the step to false
    await db.collection("users").updateOne(
      { email },
      { $set: { [`steps.${step}`]: false, isActive: false } }
    );

    const user = await db.collection("users").findOne({ email });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
