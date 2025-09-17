"use client";

import { useState } from "react";
import Steps from "../components/Steps";
import { useRouter } from "next/navigation";


export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      if (mode === "login") {
        router.push("/dashboard");
    } else {
        setMessage("✅ Registered! Check your email to verify your account.");
      }

      setEmail("");
      setPassword("");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
        <div className="steps-container">
        <h1>Welcome - Start Hiking with Purpose!</h1>
        <Steps />

    <div className="map-wrapper flex flex-col items-center justify-center p-4 mt-8">
      <h1 className="mb-4">
        {mode === "login" ? "Login" : "Register"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded input-custom"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded input-custom"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading} className="custom-button">
          {loading
            ? mode === "login"
              ? "Logging in..."
              : "Registering..."
            : mode === "login"
            ? "Login"
            : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        {mode === "login" ? (
          <>
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("register")}
              className="text-blue-600 underline"
            >
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-blue-600 underline"
            >
              Login
            </button>
          </>
        )}
      </p>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
    </div>

    </>
  );
}