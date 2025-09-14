"use client";

import { useState } from "react";
import { stepsConfig, StepKey } from "../entities/StepConfig";
import { HiInformationCircle } from "react-icons/hi";
import { isValidLeetchiUrl } from "../utils/validation_helper";

interface Props {
  email: string;
  step: StepKey;
  completeStep: (step: StepKey) => Promise<void>;
}

const CreateFundraiser = ({ email, step, completeStep }: Props) => {
  const [fundraiserUrl, setFundraiserUrl] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const stepConfig = stepsConfig.find((s) => s.key === step);
/*
  const validateFundraiserUrl = async (url: string) => {
    const res = await fetch("/api/validate-fundraiser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    return data.valid;
  };
  */

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
      
    /*
    if (!await validateFundraiserUrl(fundraiserUrl)) {
        setErrorMessage("❌ This Leetchi URL could not be reached. Please check the link.");
        return;
      }
      */
    if (!description) {
      setErrorMessage("Please provide a description for your fundraiser.");
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
          fundraiserDescription: description,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save fundraiser info");
      }

      setSuccessMessage("✅ Fundraiser info saved successfully!");
      await completeStep(step);
    } catch (err: any) {
      setErrorMessage(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <h2 className="text flex items-center gap-2">
        {stepConfig?.icon} {stepConfig?.label}
      </h2>

      <p className="text-sm text-gray-600">
        Create a fundraising project on{" "}
        <a
          href="https://www.leetchi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Leetchi
        </a>{" "}
        to collect donations. After creating it, provide the URL below so we can link your fundraising campaign.
      </p>

      <label className="flex items-center gap-2 font-medium">
        Fundraiser URL
        <span className="relative group">
          <HiInformationCircle className="w-5 h-5 text-[#74816c]" />
          <div className="absolute top-6 left-0 hidden group-hover:block bg-white text-[10px] text-[#74816c] p-1 rounded shadow-md z-10 w-48 italic">
          Paste your Leetchi fundraiser URL here. Donations will be automatically synced several times a day, so you always see the latest amount collected.          </div>
        </span>
      </label>
      <input
        type="url"
        placeholder="https://www.leetchi.com/fr/c/your-fundraiser"
        value={fundraiserUrl}
        onChange={(e) => setFundraiserUrl(e.target.value)}
        className="border p-2 rounded w-full"
        disabled={saving}
      />

      <label className="flex items-center gap-2 font-medium">
        Fundraiser Description
        <span className="relative group">
          <HiInformationCircle className="w-5 h-5 text-[#74816c]" />
          <div className="absolute top-6 left-0 hidden group-hover:block bg-white text-[10px] text-[#74816c] p-1 rounded shadow-md z-10 w-48 italic">
          Write a short description of your fundraiser. This helps donors understand your project and what they’re supporting.            </div>
                  </span>
      </label>
      <textarea
        placeholder="Describe your fundraising project..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded w-full resize-none"
        rows={4}
        disabled={saving}
      />

      <button
        onClick={handleSaveFundraiser}
        className="custom-button"
        disabled={saving || !fundraiserUrl || !description}
      >
        {saving ? "Saving..." : "Save Fundraiser & Continue"}
      </button>

      {successMessage && <p className="text-green-600 mt-1">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mt-1">{errorMessage}</p>}
    </div>
  );
};

export default CreateFundraiser;
