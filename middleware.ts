import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/auth";

const API_SECRET_TOKEN = process.env.API_SECRET_TOKEN;

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.pathname;

    
    if (url.startsWith("/activity")) {
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

    if (url.startsWith("/api")) {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");

        if (!token || token !== API_SECRET_TOKEN) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
    }

    return NextResponse.next();
}


export const config = {
    matcher: ["/activity"],
};