import HikeDashboard from "@/app/components/HikeDashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { areAllStepsComplete } from "@/app/utils/user_helper";
import { User } from "@/app/entities/User";
import ProjectPreviewLayout from "@/app/components/ProjectPreviewLayout";


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
    <ProjectPreviewLayout>
      <main
        className={`flex min-h-screen flex-col items-center p-2 global-background`}
      >
  <HikeDashboard dailyStatsUrl="/dashboard/project-preview/daily-stats" stravaUserId={user.stravaUserId} projectName={user.projectName}/>
      </main>
    </ProjectPreviewLayout>
  );
}