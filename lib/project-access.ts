import clientPromise from "@/lib/mongodb";
import { requireUser } from "@/lib/session";

export interface ProjectOwner {
  email: string;
  stravaUserId: number;
  projectName: string;
}

/**
 * Ensures the signed-in user owns the project addressed by the URL params.
 * Returns the owner, or a 401/403 Response to return from the route.
 */
export async function requireProjectOwner(
  req: Request,
  stravaUserIdParam: string,
  projectSlug: string
): Promise<ProjectOwner | Response> {
  const session = requireUser(req);
  if (session instanceof Response) return session;

  const stravaUserId = parseInt(stravaUserIdParam, 10);
  const client = await clientPromise;
  const user = await client
    .db("hike")
    .collection("users")
    .findOne({ email: session.email }, { projection: { stravaUserId: 1, projectName: 1 } });

  if (!user || Number.isNaN(stravaUserId) || user.stravaUserId !== stravaUserId || user.projectName !== projectSlug) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return { email: session.email, stravaUserId, projectName: projectSlug };
}
