"use client";

import { useState } from "react";
import { stepsConfig, StepKey } from "../entities/StepConfig";
import { HiInformationCircle } from "react-icons/hi";
import { isValidLeetchiUrl } from "../utils/validation_helper";
import 'react-quill/dist/quill.snow.css';
import RichTextWithEmoji from "./RichTextWithEmoji";

interface Props {
  email: string;
  step: StepKey;
  completeStep: (step: StepKey) => Promise<void>;
}

const CreateFundraiser = ({ email, step, completeStep }: Props) => {
  const [fundraiserUrl, setFundraiserUrl] = useState("");
  const [fundraiserDescription, setFundraiserDescription] = useState("");
  const [saved, setSaved] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [valueText, setValueText] = useState('');


  const stepConfig = stepsConfig.find((s) => s.key === step);

  const handleSaveFundraiser = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!fundraiserUrl) {
      setErrorMessage("Fundraiser URL is required.");
      return;
    }
    if (!isValidLeetchiUrl(fundraiserUrl)) {
      setErrorMessage("Please enter a valid Leetchi URL.");
      return;
    }
    if (!fundraiserDescription) {
      setErrorMessage("Fundraiser description is required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fundraiserUrl,
          fundraiserDescription,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save fundraiser");
      }

      setSaved(true);
      setSuccessMessage("✅ Fundraiser saved successfully!");
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


  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <h2 className="text flex items-center">
        {stepConfig?.icon} {stepConfig?.label}
      </h2>

      <p>
        To start fundraising, create your campaign on{" "}
        <a
          href="https://www.leetchi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Leetchi
        </a>{" "}
        and paste your project link below. Collected amounts will update
        automatically in this app a few times per day.
      </p>

      <label htmlFor="fundraiser-url" className="text flex items-center">
        Fundraiser URL
        <span className="relative group ml-2">
          <HiInformationCircle className="w-5 h-5 text-[#74816c]" />
          <div className="absolute top-6 right-0 hidden group-hover:block bg-white text-[10px] text-[#74816c] p-1 rounded shadow-md z-10 w-52 italic">
            Example: https://www.leetchi.com/fr/c/hike-donate-1755564
          </div>
        </span>
      </label>
      <input
        id="fundraiser-url"
        type="url"
        placeholder="Paste your Leetchi fundraiser link"
        value={fundraiserUrl}
        onChange={(e) => setFundraiserUrl(e.target.value)}
        className="border p-2 rounded w-full"
        disabled={saved || saving}
      />

      <label htmlFor="fundraiser-description">Fundraiser Description</label>
      <RichTextWithEmoji
        value={fundraiserDescription}
        onChange={setFundraiserDescription}
        disabled={saved || saving}
      />      <button
        onClick={handleSaveFundraiser}
        className="custom-button"
        disabled={saving || saved}
      >
        {saved ? "Fundraiser Saved ✅" : "Save Fundraiser"}
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

export default CreateFundraiser;




