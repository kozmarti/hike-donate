import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectName = searchParams.get("projectName");

    if (!projectName) {
      return new Response(JSON.stringify({ error: "Project name is required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hike");

    const user = await db.collection("users").findOne({ projectName });

    return new Response(JSON.stringify({ exists: !!user }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
