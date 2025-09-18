"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StepKey, stepsConfig } from "../entities/StepConfig";
import useUser from "../hooks/useUser";

interface Props {
  email: string;
  step: StepKey;
  completeStep: (step: StepKey) => Promise<void>;

}

const StravaConnect = ({ email, step, completeStep }: Props) => {
  const searchParams = useSearchParams();
  const [stravaClientId, setClientId] = useState("");
  const [stravaClientSecret, setClientSecret] = useState("");
  const [saved, setSaved] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [authorized, setAuthorized] = useState(false);
  const stepConfig = stepsConfig.find((s) => s.key === step);
  const {data: user, loading: userLoading, error: userError} = useUser()
  

  useEffect(() => {
    const status = searchParams?.get("status");
    if (status === "authorized") {
      setSaved(true);
      setAuthorized(true);
    } else if (status === "subscribed") {
      setSaved(true);
      setAuthorized(true);
      setSubscribed(true);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log(user)
    if (user?.stravaClientId) {
      setClientId(user.stravaClientId);
    }
  }, [user]);

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
    if (!authorized) {
      setErrorMessage("Please authorize Strava connection first.");
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

  const handleCompleteStep = async () => {
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      await completeStep(step);
      setSuccessMessage("✅ Step completed! Refreshing...");
      window.location.reload();
    } catch (err: any) {
      setErrorMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <h2 className="text">
        {stepConfig?.icon} {stepConfig?.label}
      </h2>      
      <hr style={{ borderColor: "#74816c" }} />

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
        disabled={saved}
      />

      <input
        type="password"
        placeholder="Strava Client Secret"
        value={stravaClientSecret}
        onChange={(e) => setClientSecret(e.target.value)}
        className="border p-2 rounded w-full"
        disabled={saved}
      />

      <button onClick={handleSave} className="custom-button" disabled={saved || !stravaClientId || ! stravaClientSecret}>
      {saved ? "Credentials Saved ✅" : "Save Credentials"}
      </button>

      <button
        onClick={handleAuthorize}
        className="custom-button"
        style={{ backgroundColor: "#74816c" }}
        disabled={!saved || authorized}
      >
  {authorized ? "Authorized ✅" : "Authorize Connection"}
  </button>

      <button
        onClick={handleSubscribeWebhook}
        className="custom-button"
        style={{ backgroundColor: "#11B7A1" }}
        disabled={!authorized || subscribed}
      >
        {subscribed ? "Webhook Subscribed ✅" : "Subscribe to Webhook"}
      </button>

      {successMessage && <p className="custom-success-text mt-1">{successMessage}</p>}
      {errorMessage && <p className="custom-error-text mt-1">{errorMessage}</p>}

      {subscribed && (
        <p className="text-sm text-gray-500 mt-1">
          You can revoke this subscription at any time.
        </p>
      )}
      {saved && authorized && subscribed && (
  <button
    onClick={handleCompleteStep}
    className="custom-button" >
    Complete Setup & Next Step
  </button>
)}
    </div>
  );
};

export default StravaConnect;
