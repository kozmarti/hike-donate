"use client";

import { useState } from "react";
import StravaConnect from "./StravaConnect";
import { stepsConfig, StepKey } from "../entities/StepConfig";
import SetGoals from "./SetGoals";
import CreateFundraiser from "./CreateFundraiser";
import HikeTrackShare from "./HikeTrackShare";
import AllStepsComplete from "./AllStepsComplete";
import LogoutButton from "./LogoutButton";
import StepProgressBar from "./StepProgressBar";


export interface User {
  email: string;
  name: string;
  steps?: Record<StepKey, boolean>;
}

interface Props {
  user: User;
}


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
    <div>
      <div className="header-wrapper pt-1 pb-1 pl-2 pr-2">
      <div className="flex justify-between items-center"><h1>Start Hiking with Purpose,  {state.name}!</h1> <LogoutButton/> </div>
      <StepProgressBar progress={progress} />
      </div>
      <div className="step-wrapper flex flex-col items-center justify-center p-2 mt-8">
      <StepComponent /></div>
    </div>
    
  );
}
