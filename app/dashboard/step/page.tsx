import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import DashboardStep from "@/app/components/DashboardStep";

export default async function DashboardStepPage() {
    {/** */}
  const token = cookies().get("token")?.value;

    if (!token) redirect("/welcome"); // Not logged in
  
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    } catch {
      redirect("/welcome"); // Invalid token
    }

  return <DashboardStep/>;
}
