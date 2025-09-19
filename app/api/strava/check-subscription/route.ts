// app/api/strava/check-subscription/route.ts
import clientPromise from "@/lib/mongodb";
import { decrypt } from "@/app/utils/encrypt-data";
import { getUserEmailFromCookie } from "@/app/utils/getUserEmail";

export async function GET(req: Request) {
    try {
        const cookieHeader = req.headers.get("cookie") || "";
        const email = getUserEmailFromCookie(cookieHeader);

        if (!email) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }


        const client = await clientPromise;
        const db = client.db("hike");
        const user = await db.collection("users").findOne({ email });

        if (!user?.stravaClientId || !user?.stravaClientSecret) {
            return new Response(JSON.stringify({ error: "Strava credentials not set" }), { status: 400 });
        }

        const formData = new URLSearchParams();
        formData.append("client_id", user.stravaClientId);
        formData.append("client_secret", decrypt(user.stravaClientSecret));

        const res = await fetch("https://www.strava.com/api/v3/push_subscriptions?" + formData.toString(), {
            method: "GET",
        });

        const data = await res.json();
        /* Response
            [{"id":304554, = SUBSCRIPTION ID
            "resource_state":2,
            "application_id":176790, =CLIENT ID
            "callback_url":"https://hike-donate.vercel.app/api/webhook",
            "created_at":"2025-09-18T19:43:01+00:00",
            "updated_at":"2025-09-18T19:43:01+00:00"}]%
        */
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
