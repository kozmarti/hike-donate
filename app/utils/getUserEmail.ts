import jwt from "jsonwebtoken";

export function getUserEmailFromCookie(cookieHeader: string | null | undefined): string | null {
  if (!cookieHeader) return null;

  const token = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    return payload.email;
  } catch {
    return null;
  }
}
