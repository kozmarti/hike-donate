import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const isRecentParam = searchParams.get("isRecent");

    if (!url) {
      return new Response(JSON.stringify({ error: "Missing URL" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hike");
    const collection = db.collection("fundraiser");

    const query: any = { url };

    if (isRecentParam === "true") {
      const cutoff = new Date(Date.now() - 5 * 60 * 1000);
      query.date = { $gte: cutoff };
    }

    const doc = await collection.findOne(query);

    if (!doc) return new Response(JSON.stringify({ amount: null }), { status: 200 });

    return new Response(JSON.stringify({ amount: doc.amount }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
