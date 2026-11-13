import jwt from "jsonwebtoken";

export interface SessionUser {
  userId: string;
  email: string;
}

const TOKEN_COOKIE = "token";

function readTokenFromCookieHeader(cookieHeader: string | null | undefined): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === TOKEN_COOKIE) return decodeURIComponent(rest.join("="));
  }
  return null;
}

/** Returns the signed-in user from the `token` cookie, or null if missing/invalid. */
export function getSessionUser(req: Request): SessionUser | null {
  const token = readTokenFromCookieHeader(req.headers.get("cookie"));
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as Partial<SessionUser> & { purpose?: string };
    // Purpose-scoped tokens (e.g. email verification links) are not login sessions.
    if (payload.purpose) return null;
    if (typeof payload.email !== "string" || typeof payload.userId !== "string") return null;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

export function unauthorized(): Response {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * Use at the top of a route handler:
 *   const session = requireUser(req);
 *   if (session instanceof Response) return session;
 */
export function requireUser(req: Request): SessionUser | Response {
  return getSessionUser(req) ?? unauthorized();
}
