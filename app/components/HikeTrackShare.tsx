
"use client";

import { useState } from "react";
import { stepsConfig, StepKey } from "../entities/StepConfig";

interface Props {
  email: string;
  step: StepKey;
  completeStep: (step: StepKey) => Promise<void>;
}

const HikeTrackShare = ({ email, step, completeStep }: Props) => {
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const stepConfig = stepsConfig.find((s) => s.key === step);

  const handleCompleteStep = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setSaving(true);

    try {
      await completeStep(step);
      setCompleted(true);
      setSuccessMessage("✅ Step completed! Well done!");
    } catch (err: any) {
      setErrorMessage(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <h2 className="text font-bold">
      {stepConfig?.icon} {stepConfig?.label}
      </h2>
      <hr style={{ borderColor: "#74816c" }} />


      <p>
      🎉 You're all set! Start your trek, record activities in Strava, and rename them with your project name to sync your progress.  
      You can preview your project site, and when you're ready, make it public to share with friends and family.
      </p>
      <button
        onClick={handleCompleteStep}
        className="custom-button"
        disabled={saving || completed}
      >
Complete & View Summary
      </button>

      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </div>
  );
};

export default HikeTrackShare;