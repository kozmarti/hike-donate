import clientPromise from "@/lib/mongodb";
import { decrypt } from "@/app/utils/encrypt-data";
import { getUserEmailFromCookie } from "@/app/utils/getUserEmail";

export async function DELETE(req: Request) {
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

        // get subscription ID :
        const res = await fetch(`https://www.strava.com/api/v3/push_subscriptions?client_id=${user.stravaClientId}&client_secret=${decrypt(user.stravaClientSecret)}`, {
            method: "GET",
        });
        const data = await res.json();

        const stravaUrl = `https://www.strava.com/api/v3/push_subscriptions/${data[0].id}?client_id=${user.stravaClientId}&client_secret=${decrypt(user.stravaClientSecret)}`;
        const response = await fetch(stravaUrl, {
            method: "DELETE",
        });

        if (!response.ok) {
            const err = await response.json();
            return new Response(JSON.stringify({ error: err }), { status: response.status });
        }

        return new Response(JSON.stringify({ message: "Subscription deleted successfully" }), { status: 200 });
    } catch (err: any) {
        console.error("Error deleting Strava subscription:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
