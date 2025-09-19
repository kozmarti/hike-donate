"use client";

import { useState } from "react";

export default function DeleteStravaButton() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/strava/delete-credentials", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("✅ " + data.message);
      } else {
        setErrorMessage("❌ " + (data.error || "Something went wrong"));
      }
    } catch (err: any) {
      setErrorMessage("❌ " + err.message);
    } finally {
      setLoading(false);
      setShowModal(false); // close modal after action
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="custom-button"
      >
        {loading ? "Deleting..." : "Delete Strava Connection"}
      </button>

      {successMessage && (
        <p className="custom-success-text mt-1">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="custom-error-text mt-1">{errorMessage}</p>
      )}

      {/* Modal */}
      {showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-50 overflow-y-auto">
    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg mt-10 sm:mt-0 sm:transform sm:-translate-y-1/2">
      <h2 className="text-lg font-bold mb-4 text-red-600">
        ⚠️ Confirm Deletion
      </h2>
      <p className="mb-6">
        Are you sure you want to delete all Strava credentials? <br />
        You will no longer be able to see your project after this action.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
