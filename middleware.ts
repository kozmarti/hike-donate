import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS : string[] = [
    // @ts-ignore
    process.env.NEXT_PUBLIC_API_URL];

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

   {/**  
    if (pathname.startsWith("/add-activity") || pathname.startsWith("/activities")) {
        const session = request.cookies.get("session")?.value;

        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            await decrypt(session);
        } catch (error) {
            console.error("Session decryption failed:", error);
            return NextResponse.redirect(new URL("/login", request.url)); // Redirect to login on failure
        }
    }
        */}
    
    if (pathname.startsWith("/api")) {
        const origin = request.headers.get("origin") || request.headers.get("referer");
        if (!origin || !ALLOWED_HOSTS.some((host) => origin.startsWith(host))) {
          return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
        }
      }  

    return NextResponse.next();
}


export const config = {
    matcher: ["/add-activity","/activities", "/api/user/:path*", "/api/streams/:path*"],
};