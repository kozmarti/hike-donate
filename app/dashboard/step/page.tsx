// app/dashboard/step/page.tsx
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb"; // your MongoDB connection
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import DashboardStep, { User } from "@/app/components/DashboardStep";

export default async function DashboardStepPage() {
    const token = cookies().get("token")?.value;

    if (!token) redirect("/welcome"); // Not logged in
  
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    } catch {
      redirect("/welcome"); // Invalid token
    }
  
    const client = await clientPromise;
    const db = (await client).db("hike");
    const user = await db
    .collection<User>("users")
    .findOne({ email: payload.email });

  if (!user) {
    redirect("/welcome"); 
  }

  const currentUser: User = {
    email: user.email,
    name: user.name,
    steps: user.steps || {
      connectStrava: false,
      createFundraiser: false,
      setGoals: false,
      hikeTrackShare: false,
    },
  };

  return <DashboardStep user={currentUser} />;
}
