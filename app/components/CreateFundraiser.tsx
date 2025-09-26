"use client";

import { useEffect, useState } from "react";
import { stepsConfig, StepKey } from "../entities/StepConfig";
import { HiInformationCircle } from "react-icons/hi";
import { isValidLeetchiUrl } from "../utils/validation_helper";
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import CheckURLButton from "./CheckURLButton";
import useUser from "../hooks/useUser";
import SetGoals from "./SetGoals";
import { User } from "../entities/User";

const RichTextWithEmoji = dynamic(() => import("./RichTextWithEmoji"), {
  ssr: false, // 🚀 disables server-side rendering for this component
});

interface Props {
  user: User;
  step: StepKey;
  completeStep: (step: StepKey) => Promise<void>;
}

const CreateFundraiser = ({ user, step, completeStep }: Props) => {
  const [fundraiserUrl, setFundraiserUrl] = useState("");
  const [fundraiserDescription, setFundraiserDescription] = useState("");
  const [saved, setSaved] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [validURL, setValideURL] = useState(false);
  const stepConfig = stepsConfig.find((s) => s.key === step);

  useEffect(() => {
    if (user?.fundraiserUrl) {
      setFundraiserUrl(user.fundraiserUrl);
    }
    if (user?.fundraiserDescription) {
      setFundraiserDescription(user.fundraiserDescription)
    }
  }, [user]);

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
          email: user.email,
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
    } catch (err: any) {
      setErrorMessage(`❌ ${err.message}`);
    }
  };


  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
            {/* Top white overlay before first HR */}
            <div style={{ zIndex: -1, borderTopRightRadius: "20px", borderTopLeftRadius: "20px" }} className="absolute top-0 p-4 left-0 w-full h-16 bg-white opacity-60 pointer-events-none">
                </div>
      <h2 className="text flex items-center font-bold">
        {stepConfig?.icon} {stepConfig?.label}
      </h2>
      <hr style={{ borderColor: "#74816c" }} />

      <p>
      ➡️ To start fundraising, create your campaign on{" "}
        <a
          href="https://www.leetchi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Leetchi
        </a>{" "}
        and paste your project link below.
      </p>
      <hr style={{ borderColor: "#74816c" }} />

      <label htmlFor="fundraiser-url" className="text flex items-center">
      ➡️ Fundraiser URL
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
        placeholder={"Paste your Leetchi fundraiser link"}
        value={fundraiserUrl}
        onChange={(e) => setFundraiserUrl(e.target.value)}
        className="border p-2 rounded w-full"
        disabled={saved || saving || validURL }
      />
      <CheckURLButton url={fundraiserUrl} valid={validURL} setValid={setValideURL}/>
      <hr style={{ borderColor: "#74816c" }} />

      <label htmlFor="fundraiser-description">➡️ Fundraiser Description</label>
      <RichTextWithEmoji
        value={fundraiserDescription}
        onChange={setFundraiserDescription}
        disabled={saved || saving || !validURL}
      />      
      <button
        onClick={handleSaveFundraiser}
        className="custom-button"
        disabled={saving || saved || !validURL || fundraiserDescription.replace(/<[^>]*>/g, "").trim() === ""}
      >
        {saved ? "Fundraiser Saved ✅" : "Save Fundraiser"}
      </button>

      {saved && (
        <button onClick={handleCompleteStep} className="custom-button">
          Complete Setup & Next Step
        </button>
      )}

      {successMessage && <p className="custom-success-text">{successMessage}</p>}
      {errorMessage && <p className="custom-error-text">{errorMessage}</p>}
    </div>
  );
};

export default CreateFundraiser;




