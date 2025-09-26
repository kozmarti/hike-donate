"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { stepsConfig, StepKey, Step } from "../entities/StepConfig";

import { useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";
import StepProgressBar from "./StepProgressBar";
import { useStepsStore } from "@/lib/store/stepStore";
import useUser from "../hooks/useUser";
import Skeleton from "@mui/material/Skeleton";
import DeleteUserButton from "./DeleteUserButton";


export default function Dashboard() {
  const { steps, setSteps, firstIncompleteStep, progress, setStepComplete, resetSteps } =
    useStepsStore();
  const { data, loading, error } = useUser();

  useEffect(() => {
    if (data?.steps) {
      setSteps(data.steps);
    }
  }, [data, setSteps]);



  return (
    <>
      <div className="header-wrapper pt-1 pb-1 pl-2 pr-2">
        <div className="flex justify-between items-center"><h1>Start Hiking with Purpose,  {!loading ? data?.name : <Skeleton variant="text" width={55} height={20} style={{ display: "inline-block" }} />}!</h1> <LogoutButton /> </div>
        <StepProgressBar loading={loading} progress={progress} />
      </div>
      <div className="steps-container">

        <div className="space-y-4 flex flex-col items-center justify-center">

          {stepsConfig.map((step) => (
            <div className={`step min-w-80 ${!loading ? (data?.steps?.[step.key as StepKey] ? "step-complete" : "step-incomplete") : ""}`}
              key={step.key}
            >
              <span className="icon">{step.icon}</span>
              <span className="text">{step.label}</span>
              {loading && <Skeleton width={20} height={30} style={{ display: "inline-block" }} />}
              {!loading && (data?.steps?.[step.key as StepKey] ? <span>✅</span> : <span>⏳</span>)}
            </div>
          ))}



          <Link href="/dashboard/step">
            <button className="custom-button m-5 min-w-60">
              {data && !loading && (
                progress === 0
                  ? "🚀 Start Setup"
                  : progress === 100 ? "🎉 View Summary" :
                    "⏩ Continue Setup"
              )}
              {loading && (
                <Skeleton width={100} height={25} style={{ display: "inline-block" }} />
              )}
            </button>
          </Link>
          <DeleteUserButton />


        </div>
        
      </div>
    </>
  );
}
