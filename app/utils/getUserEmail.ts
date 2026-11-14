import { getSessionUser } from "@/lib/session";

/** @deprecated use `requireUser` / `getSessionUser` from `@/lib/session` */
export function getUserEmailFromCookie(cookieHeader: string | null | undefined): string | null {
  if (!cookieHeader) return null;
  return getSessionUser(new Request("http://localhost", { headers: { cookie: cookieHeader } }))?.email ?? null;
}
