import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ALLOWED_HOSTS: string[] = [process.env.NEXT_PUBLIC_API_URL ?? ""].filter(Boolean);

const JWT_KEY = new TextEncoder().encode(process.env.JWT_SECRET ?? "");

/** True only for a validly signed, unexpired login token (not e.g. an email-verification token). */
async function hasValidSession(request: NextRequest): Promise<boolean> {
    const token = request.cookies.get("token")?.value;
    if (!token) return false;
    try {
        const { payload } = await jwtVerify(token, JWT_KEY);
        return !payload.purpose && typeof payload.email === "string";
    } catch {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith("/add-activity") || pathname.startsWith("/dashboard") || pathname.startsWith("/activities")) {
        if (!(await hasValidSession(request))) {
            const res = NextResponse.redirect(new URL("/welcome", request.url));
            res.cookies.delete("token");
            return res;
        }
        return NextResponse.next();
    }

    if (pathname.startsWith("/welcome")) {
        if (await hasValidSession(request)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
    }

    // Not an auth check (Origin/Referer are trivially forged outside a browser); it only stops other
    // websites from embedding these APIs. Real auth happens in each route via requireUser().
    if (pathname.startsWith("/api")) {
        const origin = request.headers.get("origin") || request.headers.get("referer");
        if (!origin || !ALLOWED_HOSTS.some((host) => origin.startsWith(host))) {
            return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/add-activity", "/activities", "/welcome", "/dashboard/:path*", "/api/user/:path*", "/api/streams/:path*"],
};
