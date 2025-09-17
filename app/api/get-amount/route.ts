import clientPromise from "@/lib/mongodb";


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

  if (!url) new Response(JSON.stringify({ error: 'Missing URL' }), { status: 400 });

  const client = await clientPromise;
  const db = client.db("hike");
  const collection = db.collection('fundraiser');

  const doc = await collection.findOne({ url });
  if (!doc) return new Response(JSON.stringify({}),  { status: 200 });
  return new Response(JSON.stringify({ amount: doc.amount }),  { status: 200 });
}
