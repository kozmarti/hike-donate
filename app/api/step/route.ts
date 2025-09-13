import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email, step } = await req.json();
    const client = await clientPromise;
    const db = client.db("hike");

    await db.collection("users").updateOne(
      { email },
      { $set: { [`steps.${step}`]: true } }
    );

    const user = await db.collection("users").findOne({ email });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
