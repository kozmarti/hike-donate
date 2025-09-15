"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { stepsConfig, StepKey } from "../entities/StepConfig";

import { useRouter } from "next/navigation";


export interface User {
  email: string;
  name: string;
  steps?: Record<StepKey, boolean>;
}

interface Props {
  user: User;
}

export default function Dashboard({ user }: Props) {
  const router = useRouter();

  const defaultSteps: Record<StepKey, boolean> = stepsConfig.reduce((acc, step) => {
    acc[step.key] = user.steps?.[step.key] || false;
    return acc;
  }, {} as Record<StepKey, boolean>);

  const [state, setState] = useState<User>({
    ...user,
    steps: defaultSteps,
  });

  const progress =
    (Object.values(state.steps ?? {}).filter(Boolean).length /
      stepsConfig.length) *
    100;
  
  useEffect(() => {
    if (progress === 100) {
      router.push("/dashboard/step");
    }
  }, [progress]);


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
        <p className="text-sm mt-1">{progress*4/100} / 4 complete</p>
        </div>
      <div className="space-y-4 flex flex-col items-center justify-center">

        {stepsConfig.map((step) => (
    <div className="step min-w-80"
            key={step.key}
          >
            <span className="icon">{step.icon}</span>
            <span className="text">{step.label}</span>
            {state.steps?.[step.key as keyof typeof defaultSteps] ? <span>✅</span> : <span>⏳</span>}
          </div>
        ))}
        
        <Link href="/dashboard/step">
        <button className="custom-button m-5"> 
        {progress === 0
      ? "🚀 Start Setup"
      : "⏩ Continue Setup"}
     </button>
        </Link>
      </div>
    </div>
  );
}
