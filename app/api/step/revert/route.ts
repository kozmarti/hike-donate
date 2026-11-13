// app/api/step/revert/route.ts
import clientPromise from "@/lib/mongodb";
import { requireUser } from "@/lib/session";
import { stepsConfig } from "@/app/entities/StepConfig";

const STEP_KEYS: readonly string[] = stepsConfig.map((s) => s.key);

export async function POST(req: Request) {
  try {
    const session = requireUser(req);
    if (session instanceof Response) return session;

    const { step } = await req.json();
    if (typeof step !== "string" || !STEP_KEYS.includes(step)) {
      return new Response(JSON.stringify({ error: "Invalid step" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hike");

    // Revert the step to false (and unpublish the project)
    await db.collection("users").updateOne(
      { email: session.email },
      { $set: { [`steps.${step}`]: false, isActive: false } }
    );

    const user = await db
      .collection("users")
      .findOne({ email: session.email }, { projection: { _id: 0, steps: 1 } });

    return new Response(JSON.stringify({ steps: user?.steps ?? {} }), { status: 200 });
  } catch (error: any) {
    console.error("Error reverting step:", error);
    return new Response(JSON.stringify({ error: "Failed to revert step" }), { status: 500 });
  }
}
