// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import LogoutButton from "../components/LogoutButton";
import clientPromise from "@/lib/mongodb";
import CompleteProfile from "../components/CompleteProfile";
import Dashboard, { User } from "../components/Dashboard";


export default async function DashboardPage() {
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
    // Optional: redirect or show error if user not found
    return <p>User not found</p>;
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

  if (!user.name) {
    return <CompleteProfile email={payload.email} />;
  }

  return <Dashboard user={currentUser} />;
}
