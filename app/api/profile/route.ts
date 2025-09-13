// app/api/profile/route.ts
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email, name, stravaClientId, stravaClientSecret } = await req.json();
    console.log("Received profile update:", { email, name, stravaClientId, stravaClientSecret });
    console.log(req.json());
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hike");

    // Build the update object dynamically
    const updateFields: any = {};
    if (name) updateFields.name = name;
    if (stravaClientId) updateFields.stravaClientId = stravaClientId;
    if (stravaClientSecret) updateFields.stravaClientSecret = stravaClientSecret;

    if (Object.keys(updateFields).length === 0) {
      return new Response(JSON.stringify({ error: "Nothing to update" }), { status: 400 });
    }
    console.log("Updating user:", email, updateFields);
    console.log("Updating user fields:", updateFields);


    await db.collection("users").updateOne(
      { email },
      { $set: updateFields }
    );

    const user = await db.collection("users").findOne({ email });

    return new Response(JSON.stringify({email: email}), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
