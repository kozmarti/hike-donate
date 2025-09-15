import { getUserEmailFromCookie } from "@/app/utils/getUserEmail";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {

    const cookieHeader = req.headers.get("cookie") || "";
    const email = getUserEmailFromCookie(cookieHeader);
        
    if (!email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const { isActive } = await req.json();

    if (typeof isActive !== "boolean") {
      return new Response(JSON.stringify({ error: "isActive must be boolean" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hike");

    await db.collection("users").updateOne(
      { email },
      { $set: { isActive } }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
