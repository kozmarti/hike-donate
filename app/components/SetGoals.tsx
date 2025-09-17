"use client";

import { useEffect, useState } from "react";
import { stepsConfig, StepKey } from "../entities/StepConfig";
import { HiInformationCircle } from "react-icons/hi";
import { GoalMeasureKey, getGoalMeasure, goalMeasureConfig, goalMeasureKeys } from "../entities/GoalMeasureConfig";
import useUser from "../hooks/useUser";

interface Props {
  email: string;
  step: StepKey;
  completeStep: (step: StepKey) => Promise<void>;
}

const SetGoals = ({ email, step, completeStep }: Props) => {
  const [projectName, setProjectName] = useState("");
  const [goalMeasure, setGoalMeasure] = useState<GoalMeasureKey | "">("");
  const [saved, setSaved] = useState(false);
  const [nameValid, setNameValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorNameMessage, setErrorNameMessage] = useState("");
  const [successNameMessage, setSuccessNameMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const { data: userData, loading: loadingUser, error: errorUser } = useUser();
  

  const stepConfig = stepsConfig.find((s) => s.key === step);

    useEffect(() => {
      if (userData?.projectName) {
        setProjectName(userData.projectName);
      }
      if (userData?.goalMeasure) {
        setGoalMeasure(userData.goalMeasure)
      }
    }, [userData]);

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
        throw new Error(data.error || "❌ Failed to save project goals");
      }

      setSaved(true);
      setSuccessMessage("✅ Project goals saved successfully!");
    } catch (err: any) {
      setErrorMessage(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteStep = async () => {
    try {
      await completeStep(step);
      setSuccessMessage("✅ Step completed! Refreshing...");
      window.location.reload();
    } catch (err: any) {
      setErrorMessage(`❌ ${err.message}`);
    }
  };

  const handleProjectNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const sanitizedProjectName = name.toLowerCase().replace(/\s+/g, "");

    setProjectName(name);

    if (!name) {
      setErrorMessage("");
      return;
    }

    try {
      const res = await fetch(
        `/api/profile/check-project?projectName=${encodeURIComponent(sanitizedProjectName)}&email=${encodeURIComponent(userData?.email ? userData.email : "")}`
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to check project name");
      }

      const data = await res.json();
      if (data.exists) {
        setNameValid(false)
        setErrorNameMessage("❌ Project name already taken");
        setSuccessNameMessage("")
      } else {
        setNameValid(true)
        setSuccessNameMessage("✅ Project name can be used");
        setErrorNameMessage("")

      }
    } catch (err: any) {
      setNameValid(false)
      setErrorNameMessage(`❌ ${err.message}`);
      setSuccessNameMessage("")

    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <h2 className="text flex items-center">
        {stepConfig?.icon} {stepConfig?.label}
      </h2>
      <hr style={{ borderColor: "#74816c" }} />

      <label htmlFor="project-name" className="text flex items-center">
        Project Name
        <span className="relative group ml-2">
          <HiInformationCircle className="w-5 h-5 text-[#74816c]" />
          <div className="absolute top-6 right-0 hidden group-hover:block bg-white text-[10px] text-[#74816c] p-1 rounded shadow-md z-10 w-40 italic">
            Pick a project name to tag your Strava activities. Sync happens only
            when you rename an activity in Strava — you decide the timing.
          </div>
        </span>
      </label>
      <input
        type="text"
        placeholder="Project name (lowercase, no spaces)"
        value={projectName}
        onChange={handleProjectNameChange}
        className="border p-2 rounded w-full input-custom"
        disabled={saving || saved}
      />
      {successNameMessage && <p className="text-green-600">{successNameMessage}</p>}
      {errorNameMessage && <p className="text-red-600">{errorNameMessage}</p>}
      <p>How should your fundraising goal be measured?</p>
      <div className="flex flex-col gap-2">
        {goalMeasureKeys.map((key) => {
          const { description, icon } = getGoalMeasure(key);

          return (
            <label key={key}>
              <input
                type="radio"
                value={key}
                checked={goalMeasure === key}
                onChange={() => {
                  setGoalMeasure(key as GoalMeasureKey);
                }}                
                disabled={saving || saved}
              />{" "}
              {description} {icon} 
            </label>
          );
        })}
      </div>

      <button
        onClick={handleSaveGoals}
        className="custom-button"
        disabled={saving || saved || !nameValid  || goalMeasure === ""}
      >
        {saved ? "Goals Saved ✅" : "Save Goals"}
      </button>

      {saved && (
        <button onClick={handleCompleteStep} className="custom-button">
          Complete Setup & Next Step
        </button>
      )}

      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </div>
  );
};

export default SetGoals;
