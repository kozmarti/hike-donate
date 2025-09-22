import { decrypt } from "@/app/utils/encrypt-data";
import { getUserEmailFromCookie } from "@/app/utils/getUserEmail";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    // 1. Get user from cookies
    const cookieHeader = req.headers.get("cookie") || "";
    const email = getUserEmailFromCookie(cookieHeader);

    if (!email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // 2. Connect to DB and fetch user
    const client = await clientPromise;
    const db = client.db("hike");
    const user = await db.collection("users").findOne({ email });

    if (!user?.stravaClientId || !user?.stravaClientSecret) {
      return new Response(
        JSON.stringify({ error: "Strava credentials not set" }),
        { status: 400 }
      );
    }

    // 3. Check existing subscription
    const formData = new URLSearchParams();
    formData.append("client_id", user.stravaClientId);
    formData.append("client_secret", decrypt(user.stravaClientSecret));

    const subsRes = await fetch(
      "https://www.strava.com/api/v3/push_subscriptions?" + formData.toString(),
      { method: "GET" }
    );

    if (!subsRes.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch strava webhook subscriptions" }),
        { status: 500 }
      );
    }

    const subs = await subsRes.json();

    // 4. Delete subscription if it exists
    if (Array.isArray(subs) && subs.length > 0) {
      const subscriptionId = subs[0].id;
      const deleteUrl = `https://www.strava.com/api/v3/push_subscriptions/${subscriptionId}?${formData.toString()}`;

      const deleteRes = await fetch(deleteUrl, { method: "DELETE" });

      if (!deleteRes.ok) {
        return new Response(
          JSON.stringify({ error: "Failed to delete strava webhook subscription" }),
          { status: 500 }
        );
      }
    }

    // 5. Remove Strava credentials from user
    await db.collection("users").updateOne(
      { email },
      {
        $unset: {
          stravaClientId: "",
          stravaClientSecret: "",
          refreshToken: "",
          stravaUserId: "",
        },
      }

    );

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/step/revert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: "connectStrava" }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to revert step");
    }

    return new Response(
      JSON.stringify({
        message: "Strava webhook subscription and credentials deleted successfully",
      }),
      { status: 200 }
    );

  } catch (err: any) {
    console.error("Delete credentials error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
