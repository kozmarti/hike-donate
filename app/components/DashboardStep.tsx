"use client";

import { useState } from "react";
import StravaConnect from "./StravaConnect";

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
  { key: "connectStrava", label: "Connect Strava", icon: "🔗" },
  { key: "createFundraiser", label: "Create Fundraiser", icon: "💰" },
  { key: "setGoals", label: "Set Goals", icon: "🎯" },
  { key: "hikeTrackShare", label: "Hike & Track & Share", icon: "🥾" },
];

const CreateFundraiser = ({ onComplete }: { onComplete: () => void }) => (
  <div>
    <h2>Create your fundraiser</h2>
    <button onClick={onComplete}>Complete ✅</button>
  </div>
);

const SetGoals = ({ onComplete }: { onComplete: () => void }) => (
  <div>
    <h2>Set your goals</h2>
    <button onClick={onComplete}>Complete ✅</button>
  </div>
);

const HikeTrackShare = ({ onComplete }: { onComplete: () => void }) => (
  <div>
    <h2>Hike, track, and share!</h2>
    <button onClick={onComplete}>Complete ✅</button>
  </div>
);

const AllStepsComplete = () => <h2>🎉 All steps completed!</h2>;

// --- Progress bar helper ---
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="mb-4">
    <div className="h-3 progress-bar-uncompleted rounded-xl">
      <div
        className="h-3 progress-bar-completed rounded-xl"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-sm mt-1">{progress.toFixed(0)}% complete</p>
  </div>
);

export default function DashboardStep({ user }: Props) {
  const defaultSteps = {
    connectStrava: false,
    createFundraiser: false,
    setGoals: false,
    hikeTrackShare: false,
    ...(user.steps || {}),
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

  const firstIncompleteStep = stepsConfig.find(
    (step) => !state.steps?.[step.key as keyof typeof defaultSteps]
  );

  let StepComponent: React.FC;
  switch (firstIncompleteStep?.key) {
    case "connectStrava":
      StepComponent = () => <StravaConnect email={state.email} />;
      break;
    case "createFundraiser":
      StepComponent = () => <CreateFundraiser onComplete={() => completeStep("createFundraiser")} />;
      break;
    case "setGoals":
      StepComponent = () => <SetGoals onComplete={() => completeStep("setGoals")} />;
      break;
    case "hikeTrackShare":
      StepComponent = () => <HikeTrackShare onComplete={() => completeStep("hikeTrackShare")} />;
      break;
    default:
      StepComponent = AllStepsComplete;
  }

  const progress =
    (Object.values(state.steps ?? {}).filter(Boolean).length / stepsConfig.length) *
    100;

  return (
    <div className="p-4">
      <h1 className="mb-4">Hello {state.name} – Start Hiking with Purpose!</h1>
      <ProgressBar progress={progress} />
      <div className="map-wrapper flex flex-col items-center justify-center p-4 mt-8">
      {<StepComponent />}</div>
    </div>
  );
}
