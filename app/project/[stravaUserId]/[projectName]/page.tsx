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
    redirect("/welcome");
  }
  const client = await clientPromise;
  const db = client.db("hike");
  const user = await db.collection("users").findOne({ stravaUserId: parseInt(stravaUserId) });

  if (!user || user.projectName != projectName || !user.isActive) {
    redirect("/welcome");
  }

  return (
    <HikeDashboard dailyStatsUrl={`/project/${stravaUserId}/${projectName}/daily-stats`} stravaUserId={stravaUserId} projectName={projectName}/>
  );
}