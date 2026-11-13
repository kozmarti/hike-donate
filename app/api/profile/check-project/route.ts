// Reads the login cookie, so it must never be pre-rendered at build time
export const dynamic = "force-dynamic";

import clientPromise from "@/lib/mongodb";
import { requireUser } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const session = requireUser(req);
    if (session instanceof Response) return session;

    const { searchParams } = new URL(req.url);
    const projectName = searchParams.get("projectName");

    if (!projectName) {
      return new Response(
        JSON.stringify({ error: "projectName is required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hike");

    const otherUser = await db.collection("users").findOne({
      projectName,
      email: { $ne: session.email }, // exclude current user
    });

    return new Response(
      JSON.stringify({ exists: !!otherUser }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error checking project name:", error);
    return new Response(
      JSON.stringify({ error: "Failed to check project name" }),
      { status: 500 }
    );
  }
}
