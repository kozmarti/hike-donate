// app/api/profile/route.ts
import { decrypt, encrypt } from "@/app/utils/encrypt-data";
import { getUserEmailFromCookie } from "@/app/utils/getUserEmail";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email, name, stravaClientId, stravaClientSecret, projectName, goalMeasure, fundraiserUrl, fundraiserDescription } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hike");
    
    // Check if projectName is already taken by another user
    if (projectName) {
      const existing = await db
        .collection("users")
        .findOne({ projectName, email: { $ne: email } });

      if (existing) {
        return new Response(
          JSON.stringify({ error: "❌ Project name already exists. Please choose another." }),
          { status: 400 }
        );
      }
    }
    const user = await db
        .collection("users")
        .findOne({ email: email });

    if (user && user.isActive) {
      return new Response(JSON.stringify({ error: "Project is public, cannot update data" }), { status: 400 });

    }
    
    const updateFields: any = {};
    if (name) updateFields.name = name;
    if (stravaClientId) updateFields.stravaClientId = stravaClientId;
    if (projectName) updateFields.projectName = projectName;
    if (goalMeasure) updateFields.goalMeasure = goalMeasure;
    if (fundraiserUrl) updateFields.fundraiserUrl = fundraiserUrl;
    if (fundraiserDescription) updateFields.fundraiserDescription = fundraiserDescription;
    if (stravaClientSecret) updateFields.stravaClientSecret = encrypt(stravaClientSecret);
    if (Object.keys(updateFields).length === 0) {
      return new Response(JSON.stringify({ error: "Nothing to update" }), { status: 400 });
    }

    await db.collection("users").updateOne(
      { email },
      { $set: updateFields }
    );

    return new Response(JSON.stringify({message: email}), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const stravaUserIdParam = url.searchParams.get("stravaUserId");

    const client = await clientPromise;
    const db = client.db("hike");

    let user;

    if (stravaUserIdParam) {
      // Use stravaUserId if provided
      const stravaUserId = parseInt(stravaUserIdParam, 10);
      user = await db.collection("users").findOne({ stravaUserId });
    } else {
      // Otherwise, use cookie/email
      const cookieHeader = req.headers.get("cookie") || "";
      const email = getUserEmailFromCookie(cookieHeader);

      if (!email) {
        return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
      }

      user = await db.collection("users").findOne({ email });
    }

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Exclude sensitive info
    const { password, refreshToken, ...rest } = user;

    const safeUser = {
      ...rest,
      stravaClientSecret: user.stravaClientSecret
        ? decrypt(user.stravaClientSecret).slice(0, 2) + "***********"
        : null,
    };

    return new Response(JSON.stringify(safeUser), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
