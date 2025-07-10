import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest
) {
  /*[
  {
    "_id": "686f8d924bb799c6428d8960",
    "date": "2025-07-10T10:18:32.646Z",
    "amount": "36 325,75 €"
  }
]*/
  try {
    const client = await clientPromise;
    const db = client.db("hike");
    const collectedAmount = await db
    .collection("moneyPot")
    .find({
    }).toArray();
  
  return NextResponse.json(collectedAmount);
} catch (e) {
  console.error(e);
}
}
