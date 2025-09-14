"use client";

import { useState } from "react";
import StravaConnect from "./StravaConnect";
import { stepsConfig, StepKey } from "../entities/StepConfig";
import SetGoals from "./SetGoals";
import CreateFundraiser from "./CreateFundraiser";
import HikeTrackShare from "./HikeTrackShare";
import AllStepsComplete from "./AllStepsComplete";


export interface User {
  email: string;
  name: string;
  steps?: Record<StepKey, boolean>;
}

interface Props {
  user: User;
}

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
  const defaultSteps: Record<StepKey, boolean> = stepsConfig.reduce((acc, step) => {
    acc[step.key] = user.steps?.[step.key] || false;
    return acc;
  }, {} as Record<StepKey, boolean>);

  const [state, setState] = useState<User>({
    ...user,
    steps: defaultSteps,
  });


  const completeStep = async (step: StepKey) => {
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
      StepComponent = () => <StravaConnect email={state.email} step="connectStrava" completeStep={completeStep}/>;
      break;
    case "createFundraiser":
      StepComponent = () => <CreateFundraiser email={state.email} step="createFundraiser" completeStep={completeStep} />;
      break;
    case "setGoals":
      StepComponent = () => <SetGoals email={state.email} step="setGoals" completeStep={completeStep} />;
      break;
    case "hikeTrackShare":
      StepComponent = () => <HikeTrackShare email={state.email} step="hikeTrackShare" completeStep={completeStep} />;
      break;
    default:
      StepComponent = () => <AllStepsComplete/>;
  }

  const progress =
    (Object.values(state.steps ?? {}).filter(Boolean).length / stepsConfig.length) *
    100;

  return (
    <div className="p-4">
      <h1 className="mb-4">Hello {state.name} – Start Hiking with Purpose!</h1>
      <ProgressBar progress={progress} />
      <div className="map-wrapper flex flex-col items-center justify-center p-4 mt-8">
      <StepComponent /></div>
    </div>
  );
}
