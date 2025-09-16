import HikeDashboard from "@/app/components/HikeDashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { StepKey } from "@/app/entities/StepConfig";
import { areAllStepsComplete } from "@/app/utils/user_helper";
import ProjectPreviewLayout from "@/app/components/ProjectPreviewLayout";

interface User {
    email: string;
    stravaUserId: string;
    stravaClientId: string;
    stravaClientSecret: string;
    projectName: string;
    goalMeasure: "km" | "m" | "hours";
    fundraiserUrl: string;
    fundraiserDescription: string;
    isActive?: boolean | null;
    steps: Step
    name: string
}

interface Step  {
    connectStrava?: boolean;
    createFundraiser?: boolean;
    setGoals?: boolean;
    hikeTrackShare?: boolean;
  };

export default async function HomePage() {
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


  if (!areAllStepsComplete(user.steps)) {
    redirect("/dashboard/step"); 
  }
  

  return (

  <HikeDashboard stravaUserId={user.stravaUserId} projectName={user.projectName}
  goalMeasure={user.goalMeasure} fundraiserDescription={user.fundraiserDescription} 
  fundraiserUrl={user.fundraiserUrl} name={user.name}/>

);
}