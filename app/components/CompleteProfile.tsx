"use client";

import { useState } from "react";

interface Props {
  email: string;
}

export default function CompleteProfile({ email }: Props) {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("❌ Name is required");
      return;
    }
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "❌ Something went wrong");
        return;
      }

      // Reload dashboard page to show new state
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "❌ Something went wrong");
    }
  };

  return (
    <div className="map-wrapper flex flex-col items-center justify-center p-4 mt-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <h1 className="text">
          Welcome! What should we call you?
          </h1>
          <p>💡 Choose wisely, you won't be able to change it later.</p>

        <input
          className="w-full border rounded-lg p-2 mb-4 input-custom"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null); // clear error when typing
          }}
          required
        />
        {error && <p className="custom-error-text">{error}</p>}

        <button
          type="submit"
          className="custom-button"
          disabled={!name}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
