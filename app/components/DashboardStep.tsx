"use client";

import StravaConnect from "./StravaConnect";
import { StepKey } from "../entities/StepConfig";
import SetGoals from "./SetGoals";
import CreateFundraiser from "./CreateFundraiser";
import HikeTrackShare from "./HikeTrackShare";
import AllStepsComplete from "./AllStepsComplete";
import LogoutButton from "./LogoutButton";
import StepProgressBar from "./StepProgressBar";
import { useStepsStore } from "@/lib/store/stepStore";
import { useEffect } from "react";
import useUser from "../hooks/useUser";
import SkeletonAllStepComplete from "./SkeletonAllStepComplete";
import SkeletonStepComponent from "./SkeletonStepComponent";



export default function DashboardStep() {
  const { steps, setSteps, firstIncompleteStep, progress, setStepComplete, resetSteps } =
    useStepsStore();
  const {data: userData, loading, error } = useUser();
  

    useEffect(() => {
      if (userData?.steps) {
        setSteps(userData.steps);
      } else {
        resetSteps();
      }
    }, [userData, setSteps, resetSteps]); 


  const completeStep = async (step: StepKey) => {
    const res = await fetch("/api/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userData?.email, step }),
    });
    const updated = await res.json();
    setStepComplete(step);
  };

  let StepComponent: React.FC = () => null;

  if (userData) {
    switch (firstIncompleteStep) {
      case "connectStrava":
        StepComponent = () => <StravaConnect user={userData} step="connectStrava" completeStep={completeStep}/>;
        break;
      case "createFundraiser":
        StepComponent = () => <CreateFundraiser user={userData} step="createFundraiser" completeStep={completeStep} />;
        break;
      case "setGoals":
        StepComponent = () => <SetGoals user={userData} step="setGoals" completeStep={completeStep} />;
        break;
      case "hikeTrackShare":
        StepComponent = () => <HikeTrackShare step="hikeTrackShare" completeStep={completeStep} />;
        break;
      default:
        StepComponent = () => <AllStepsComplete/>;
    }
  }

  let SkeletonComponent: React.FC = () => null;

    switch (firstIncompleteStep) {
      case "connectStrava":
        SkeletonComponent = () => <SkeletonStepComponent/>;
        break;
      case "createFundraiser":
        SkeletonComponent = () => <SkeletonStepComponent />;
        break;
      case "setGoals":
        SkeletonComponent = () => <SkeletonStepComponent />;
        break;
      case "hikeTrackShare":
        SkeletonComponent = () => <HikeTrackShare step="hikeTrackShare" completeStep={completeStep} />;
        break;
      default:
        SkeletonComponent = () => <SkeletonAllStepComplete/>;
    }

  return (
    <div>
      <div className="header-wrapper pt-1 pb-1 pl-2 pr-2">
      <div className="flex justify-between items-center"><h1>Start Hiking with Purpose,  {userData?.name}!</h1> <LogoutButton/> </div>
      <StepProgressBar loading={loading} progress={progress} />
      </div>
      <div className="step-wrapper flex flex-col items-center justify-center p-2 m-1 mt-8">
        {!loading && userData && (<StepComponent />)}
        {loading &&  (<SkeletonComponent />)}
      </div>
    </div>
    
  );
}
