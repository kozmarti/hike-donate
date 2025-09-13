"use client";

import Link from "next/link";
import { useState } from "react";

export interface User {
  email: string;
  name: string;
  steps?: {
    connectStrava?: boolean;
    createFundraiser?: boolean;
    setGoals?: boolean;
    hikeTrackShare?: boolean;
  };
}

interface Props {
  user: User;
}

const stepsConfig = [
  { key: "connectStrava", label: "Connect your Strava account", icon: "🔗" },
  { key: "createFundraiser", label: "Create Fundraiser", icon: "💰" },
  { key: "setGoals", label: "Set Goals for your project", icon: "🎯" },
  { key: "hikeTrackShare", label: "Hike & Track & Share", icon: "🥾" },
];

export default function Dashboard({ user }: Props) {
  // Ensure steps always exist with defaults
  const defaultSteps = {
    connectStrava: false,
    createFundraiser: false,
    setGoals: false,
    hikeTrackShare: false,
    ...user.steps, // overwrite with DB values if they exist
  };

  const [state, setState] = useState<User>({
    ...user,
    steps: defaultSteps,
  });

  const completeStep = async (step: string) => {
    const res = await fetch("/api/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: state.email, step }),
    });
    const updated = await res.json();
    setState({
      ...updated,
      steps: {
        ...defaultSteps,
        ...updated.steps,
      },
    });
  };

  const progress =
    (Object.values(state.steps ?? {}).filter(Boolean).length /
      stepsConfig.length) *
    100;

  return (
    <div className="steps-container">
      <h1 >
        Hello {state.name} – Start Hiking with Purpose!
      </h1>
      <div className="mb-4">
        <div className="h-3 progress-bar-uncompleted rounded-xl">
          <div
            className="h-3 progress-bar-completed rounded-xl"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm mt-1">{progress.toFixed(0)}% complete</p>
      </div>
      <div className="space-y-4 flex flex-col items-center justify-center">
        {stepsConfig.map((step) => (
    <div className={`step min-w-80 ${
              state.steps?.[step.key as keyof typeof defaultSteps]
                ? "bg-green-200 text-green-900"
                : "bg-white"
            }`}
            key={step.key}
            onClick={() => completeStep(step.key)}
          >
            <span className="icon">{step.icon}</span>
            <span className="text">{step.label}</span>
            {state.steps?.[step.key as keyof typeof defaultSteps] ? <span>✅</span> : <span>⏳</span>}
          </div>
        ))}
                  <Link href="/dashboard/step">

        <button className="custom-button m-5"> Start SetUp</button>
        </Link>
      </div>
    </div>
  );
}
