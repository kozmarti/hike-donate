import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectName = searchParams.get("projectName");
    const email = searchParams.get("email");

    if (!projectName || !email) {
      return new Response(
        JSON.stringify({ error: "projectName and email are required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hike");

    const otherUser = await db.collection("users").findOne({
      projectName,
      email: { $ne: email }, // exclude current user
    });

    return new Response(
      JSON.stringify({ exists: !!otherUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
