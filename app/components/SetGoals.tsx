"use client";

import { useState } from "react";
import { stepsConfig, StepKey } from "../entities/StepConfig";
import { HiInformationCircle } from "react-icons/hi";

interface Props {
  email: string;
  step: StepKey;
  completeStep: (step: StepKey) => Promise<void>;
}

const SetGoals = ({ email, step, completeStep }: Props) => {
  const [projectName, setProjectName] = useState("");
  const [goalMeasure, setGoalMeasure] = useState<"km" | "m" | "hours" | "">("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // get icon and label from stepsConfig
  const stepConfig = stepsConfig.find((s) => s.key === step);

  const handleSaveGoals = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!projectName) {
      setErrorMessage("Project name is required.");
      return;
    }
    if (!goalMeasure) {
      setErrorMessage("Please select how you want to measure your fundraising goal.");
      return;
    }

    const sanitizedProjectName = projectName.toLowerCase().replace(/\s+/g, "");

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          projectName: sanitizedProjectName,
          goalMeasure,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save project goals");
      }

      setSuccessMessage("✅ Project goals saved successfully!");
      await completeStep(step);
    } catch (err: any) {
      setErrorMessage(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
<h2 className="text flex items-center">
  {stepConfig?.icon} {stepConfig?.label}

</h2>
<label htmlFor="project-name" className="text flex items-center">Project Name
<span className="relative group ml-2">
  <HiInformationCircle className="w-5 h-5 text-[#74816c]" /> <div className="absolute top-6 right-0 hidden group-hover:block bg-white text-[10px] text-[#74816c] p-1 rounded shadow-md z-10 w-40 italic">     
  Pick a project name to tag your Strava activities. The app will sync data only when you rename the activity in Strava, giving you full control over timing and privacy.
  </div>
  </span>

</label>
      <input
        name="project-name"
        type="text"
        placeholder="Project Name (lowercase, no spaces)"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="border p-2 rounded w-full"
        disabled={saving}
      />

      <p>How should your fundraising goal be measured?</p>
      <div className="flex flex-col gap-2">
        <label>
          <input
            type="radio"
            value="km"
            checked={goalMeasure === "km"}
            onChange={() => setGoalMeasure("km")}
            disabled={saving}
          />{" "}
          EUR = distance (km)
        </label>
        <label>
          <input
            type="radio"
            value="m"
            checked={goalMeasure === "m"}
            onChange={() => setGoalMeasure("m")}
            disabled={saving}
          />{" "}
          EUR = elevation (m)
        </label>
        <label>
          <input
            type="radio"
            value="hours"
            checked={goalMeasure === "hours"}
            onChange={() => setGoalMeasure("hours")}
            disabled={saving}
          />{" "}
          EUR = hiking time (hours)
        </label>
      </div>

      <button
        onClick={handleSaveGoals}
        className="custom-button"
        disabled={saving || !projectName || !goalMeasure}
      >
        {saving ? "Saving..." : "Save Goals & Continue"}
      </button>

      {successMessage && <p className="text-green-600 mt-1">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mt-1">{errorMessage}</p>}
    </div>
  );
};

export default SetGoals;
