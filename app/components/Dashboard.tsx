"use client";

import Link from "next/link";
import { useState } from "react";
import { stepsConfig, StepKey } from "../entities/StepConfig";


export interface User {
  email: string;
  name: string;
  steps?: Record<StepKey, boolean>;
}

interface Props {
  user: User;
}

export default function Dashboard({ user }: Props) {
  // Ensure steps always exist with defaults
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
