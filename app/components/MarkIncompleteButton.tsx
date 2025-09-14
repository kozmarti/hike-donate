import { useState } from "react";
import { StepKey } from "../entities/StepConfig";
import { FiEdit } from "react-icons/fi";

interface Props {
  step: StepKey;
}

export default function MarkIncompleteButton({ step }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUncomplete = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/step/revert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to revert step");
      }

      window.location.reload();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleUncomplete}
        className="custom-button"
        disabled={loading}
      >
         <FiEdit className="w-5 h-5" />
        
      </button>
      {error && <p className="text-red-600 mt-1">{error}</p>}
    </div>
  );
}
