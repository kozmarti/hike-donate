"use client";
import Skeleton from "@mui/material/Skeleton";
import { stepsConfig } from "../entities/StepConfig";


const SkeletonStepComponent = () => {
  const stepConfig = stepsConfig.find((s) => s.key === "connectStrava");

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
                  {/* Top white overlay before first HR */}
                  <div style={{ zIndex: -1, borderTopRightRadius: "20px", borderTopLeftRadius: "20px" }} className="absolute top-0 p-4 left-0 w-full h-16 bg-white opacity-60 pointer-events-none">
                </div>
      <h2 className="text font-bold">
      <Skeleton width={25} height={25} style={{ display: "inline-block" }} /> 
      {" "}<Skeleton width={100} height={25} style={{ display: "inline-block" }} />
      </h2>
      <hr style={{ borderColor: "#74816c" }} />

      <p>
      <Skeleton width={250} height={25} style={{ display: "inline-block" }} />
      <Skeleton width={200} height={25} style={{ display: "inline-block" }} />
      <Skeleton width={250} height={25} style={{ display: "inline-block" }} />
      <Skeleton width={200} height={25} style={{ display: "inline-block" }} />

      </p>

      <Skeleton width={200} height={25} style={{ display: "inline-block" }} />
      <Skeleton width={200} height={25} style={{ display: "inline-block" }} />
      <button
        className="custom-button" >
        <Skeleton width={100} height={25} style={{ display: "inline-block" }} />
      </button>

    </div>
  );
};

export default SkeletonStepComponent;
