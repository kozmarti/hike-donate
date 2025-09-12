// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import LogoutButton from "../components/LogoutButton";

export default function DashboardPage() {
  const token = cookies().get("token")?.value;

  if (!token) redirect("/welcome"); // Not logged in

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
  } catch {
    redirect("/welcome"); // Invalid token
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">
          Welcome, {payload.email}!
        </h1>
        <p className="mb-6 text-gray-600">
          This is your protected dashboard.
        </p>
        <LogoutButton />
      </div>
    </div>
  );
}
