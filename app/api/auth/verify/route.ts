export const dynamic = "force-dynamic";

import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    console.log("Received token:", token);

    if (!token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/verified?status=invalid`);
    }

    // Verify the token safely
    let payload: { userId: string; email: string };
    console.log("Verifying token...");
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        email: string;
      };
    } catch {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/verified?status=expired`);
    }

    const client = await clientPromise;
    const db = client.db("hike");

    const user = await db.collection("users").findOne({
      _id: new ObjectId(payload.userId),
    });
    console.log("User found:", user);

    if (!user) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/verified?status=invalid`);
    }

    if (user.verified) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/verified?status=already`);
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(payload.userId) },
      { $set: { verified: true } }
    );
    console.log("User verified.");

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/verified?status=success`);
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/verified?status=error`);
  }
}
