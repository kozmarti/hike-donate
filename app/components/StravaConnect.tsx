"use client";

import { useEffect, useState } from "react";
import { StepKey, stepsConfig } from "../entities/StepConfig";
import CopyTextButton from "./CopyTextButton";
import { User } from "../entities/User";

interface Props {
  user: User;
  step: StepKey;
  completeStep: (step: StepKey) => Promise<void>;

}

const StravaConnect = ({ user, step, completeStep }: Props) => {
  const [stravaClientId, setClientId] = useState("");
  const [stravaClientSecret, setClientSecret] = useState("");
  const [saved, setSaved] = useState(false);
  const [credentialsSetup, setCredentialsSetup] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const stepConfig = stepsConfig.find((s) => s.key === step);


  useEffect(() => {
    if (user?.stravaClientId) {
      setClientId(user.stravaClientId);
    }
    if (user?.stravaUserId) {
      setCredentialsSetup(true)

    }
  }, [user]);

  const handleSave = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    console.log("save credentials")

    if (!stravaClientId || !stravaClientSecret) {
      setErrorMessage("Both Client ID and Client Secret are required.");
      return;
    }

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          stravaClientId,
          stravaClientSecret,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.log(data)
        throw new Error(data.error || "Failed to save credentials");
      }
    } catch (err: any) {
      setErrorMessage(`❌ ${err.message}`);
    }
  };

  const handleAuthorize = () => {
    setErrorMessage("");
    setSuccessMessage("");
    window.location.href = `/api/strava/auth?email=${encodeURIComponent(user.email)}`;
  };

  const handleCompleteStep = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await completeStep(step);
      setSuccessMessage("✅ Step completed! Refreshing...");
    } catch (err: any) {
      setErrorMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
            {/* Top white overlay before first HR */}
            <div style={{ zIndex: -1, borderTopRightRadius: "20px", borderTopLeftRadius: "20px" }} className="absolute top-0 p-4 left-0 w-full h-16 bg-white opacity-60 pointer-events-none">
                </div>
      <h2 className="text font-bold">
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
        . Make sure to set "{process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, '')}"
        {process.env.NEXT_PUBLIC_API_URL && (<CopyTextButton textToCopy={process.env.NEXT_PUBLIC_API_URL.replace(/^https?:\/\//, '')} />)} as <strong>Authorization Callback Domain</strong>.
      </p>

      <input
        type="text"
        placeholder="Strava Client ID"
        value={stravaClientId}
        onChange={(e) => setClientId(e.target.value)}
        className="border p-2 rounded w-full input-custom"
        disabled={saved}
      />

      <input
        type="password"
        placeholder="Strava Client Secret"
        value={stravaClientSecret}
        onChange={(e) => setClientSecret(e.target.value)}
        className="border p-2 rounded w-full input-custom"
        disabled={saved}
      />

      <button onClick={() => {
        handleSave();
        handleAuthorize();
      }}
        className="custom-button" disabled={!stravaClientId || !stravaClientSecret || credentialsSetup}>
        {!stravaClientId || !stravaClientSecret || credentialsSetup ? "Strava Connected ✅" : "Connect Strava"}
      </button>

      {successMessage && <p className="custom-success-text mt-1">{successMessage}</p>}
      {errorMessage && <p className="custom-error-text mt-1">{errorMessage}</p>}

      {credentialsSetup && (
        <p className="text-sm text-gray-500 mt-1">
          You can revoke this at any time.
        </p>
      )}
      {credentialsSetup && (
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
