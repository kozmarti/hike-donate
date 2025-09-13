"use client";

import { useState } from "react";

interface Props {
  email: string;
}

const StravaConnect = ({ email }: Props) => {
  const [stravaClientId, setClientId] = useState("");
  const [stravaClientSecret, setClientSecret] = useState("");
  const [saved, setSaved] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!stravaClientId || !stravaClientSecret) {
      setErrorMessage("Both Client ID and Client Secret are required.");
      return;
    }

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          stravaClientId,
          stravaClientSecret,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save credentials");
      }

      setSaved(true);
      setSuccessMessage("✅ Strava credentials saved successfully.");
    } catch (err: any) {
      setErrorMessage(`❌ ${err.message}`);
    }
  };

  const handleAuthorize = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!saved) {
      setErrorMessage("Please save your credentials first.");
      return;
    }

    window.location.href = `/api/strava/auth?email=${encodeURIComponent(email)}`;
  };

  const handleSubscribeWebhook = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!saved) {
      setErrorMessage("Please save your credentials first.");
      return;
    }

    try {
      const res = await fetch("/api/strava/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed");

      setSubscribed(true);
      setSuccessMessage("✅ Webhook subscription created successfully.");
    } catch (err: any) {
      setErrorMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <h2 className="text">Connect your Strava account</h2>
      <p>
        Get a <strong>Client ID</strong> and <strong>Client Secret</strong> from{" "}
        <a
          href="https://www.strava.com/settings/api"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          your Strava account
        </a>
        . Make sure to set "{process.env.NEXT_PUBLIC_API_URL}" as <strong>Authorization Callback Domain</strong>.
      </p>

      <input
        type="text"
        placeholder="Strava Client ID"
        value={stravaClientId}
        onChange={(e) => setClientId(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <input
        type="text"
        placeholder="Strava Client Secret"
        value={stravaClientSecret}
        onChange={(e) => setClientSecret(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button onClick={handleSave} className="custom-button">
        Save Credentials
      </button>

      <button
        onClick={handleAuthorize}
        className="custom-button"
        style={{ backgroundColor: "#74816c" }}
      >
        Authorize Connection
      </button>

      <button
        onClick={handleSubscribeWebhook}
        className="custom-button"
        style={{ backgroundColor: "#11B7A1" }}
      >
        {subscribed ? "Webhook Subscribed ✅" : "Subscribe to Webhook"}
      </button>

      {successMessage && <p className="text-green-600 mt-1">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mt-1">{errorMessage}</p>}

      {subscribed && (
        <p className="text-sm text-gray-500 mt-1">
          You can revoke this subscription at any time.
        </p>
      )}
    </div>
  );
};

export default StravaConnect;
