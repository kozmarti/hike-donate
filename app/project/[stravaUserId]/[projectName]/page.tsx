import HikeDashboard from "@/app/components/HikeDashboard";
import { notFound, redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";

interface ProjectPageProps {
  params: {
    stravaUserId: string;
    projectName: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { stravaUserId, projectName } = params;

  if (!stravaUserId || !projectName) {
    notFound(); // optional: show 404 if missing
  }
  const client = await clientPromise;
  const db = client.db("hike");
  const user = await db.collection("users").findOne({ stravaUserId: parseInt(stravaUserId) });
  console.log("PARAM USERID", stravaUserId)
  console.log("USER", user)
  console.log(user?.projectName)
  console.log(user?.stravaUserId)
  if (!user || user.projectName != projectName || !user.isActive) {
    redirect("/dashboard/step");
  }

  return (
    <HikeDashboard stravaUserId={stravaUserId} projectName={projectName}/>
  );
}