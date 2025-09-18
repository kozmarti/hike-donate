"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/welcome");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  return (
    <button className="custom-button" onClick={handleLogout}>
      Logout
    </button>
  );
}
