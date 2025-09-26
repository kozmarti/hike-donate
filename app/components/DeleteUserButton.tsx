"use client";

import { useState } from "react";

export default function DeleteUserButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "DELETE"
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      setMessage("✅ " + data.message);

      // Optional: redirect to homepage after deletion
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="custom-button min-w-60 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-xl mt-4"
      >
        {loading ? "Deleting..." : "Delete Account"}
      </button>

      {message && (
        <p className={`mt-2 ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      {/* Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-red-600">
        ⚠️ Confirm Account Deletion
      </h2>
      <p className="mb-6">
        Are you sure you want to delete your account? <br />
        This action cannot be undone.
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
