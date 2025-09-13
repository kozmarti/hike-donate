"use client";

import { useState } from "react";

interface Props {
  email: string;
}

export default function CompleteProfile({ email }: Props) {
  const [name, setName] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });

    // Just reload dashboard page to show new state
    window.location.reload();
  };

  return (
    <div className="map-wrapper flex flex-col items-center justify-center p-4 mt-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <h1 className="text">Welcome! What should we call you?</h1>
        <input
          className="w-full border rounded-lg p-2 mb-4"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          type="submit"
          className="custom-button"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
