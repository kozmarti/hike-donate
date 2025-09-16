"use client";

import Skeleton from "@mui/material/Skeleton";


const SkeletonAllStepComplete = () => {
  return (
    <div className="max-w-md mx-auto p-4 flex flex-col gap-4">
    <h2 className="text">Project Setup Summary</h2>

    {/* Strava Account */}
    <div>
      <h3 className="font-semibold flex justify-between items-center w-full">
        <span>🔗 Strava Account</span>
        <Skeleton width={60} height={60} component={"span"} />
      </h3>
      <p>
        <Skeleton width={150} height={20} style={{ display: "inline-block" }} component={"span"}/>
      </p>
      <p>
        <span>Strava User ID: </span>
        <Skeleton width={100} height={20} style={{ display: "inline-block" }} component={"span"}/>
      </p>
      <p>
        <span>Client ID: </span>
        <Skeleton width={120} height={20} style={{ display: "inline-block" }} component={"span"}/>
      </p>
      <p>
        <span>Client Secret: </span>
        <Skeleton width={120} height={20} style={{ display: "inline-block" }} component={"span"}/>
      </p>

      <Skeleton width={200} height={36} style={{ marginTop: 8 }} component={"span"}/>

      <p className="text-gray-600 mt-1 text-sm">
        <Skeleton width={160} height={16} style={{ display: "inline-block" }} component={"span"}/>
      </p>
    </div>

    <hr style={{ borderColor: "#74816c" }} />

    {/* Project Goals */}
    <div>
      <h3 className="font-semibold flex justify-between items-center w-full">
        <span>🎯 Project Goals</span>
        <Skeleton width={60} height={60} component={"span"} />
      </h3>
      <p>
        <span>Project Name: </span>
        <Skeleton width={120} height={20} style={{ display: "inline-block" }} component={"span"}/>
      </p>
      <p>
        <span>Goal Measure: </span>
        <Skeleton width={140} height={20} style={{ display: "inline-block" }} component={"span"}/>
      </p>
    </div>

    <hr style={{ borderColor: "#74816c" }} />

    {/* Fundraiser */}
    <div>
      <h3 className="font-semibold flex justify-between items-center w-full">
        <span>💰 Fundraiser</span>
        <Skeleton width={60} height={60}  component={"span"}/>
      </h3>
      <p>
        <span>Leetchi Page: </span>
        <Skeleton width={140} height={20} style={{ display: "inline-block" }} component={"span"}/>
      </p>
      <p>
        <span>Description: </span>
        <Skeleton width={90} height={20} style={{ display: "inline-block" }}component={"span"} />
      </p>
    </div>

    <hr style={{ borderColor: "#74816c" }} />

    {/* Hike & Track & Share */}
    <div>
      <h3 className="font-semibold flex justify-between items-center w-full">
        <span>🥾 Hike & Track & Share</span>
        <Skeleton width={60} height={60}  component={"span"}/>
      </h3>
      <p>Track your hike and share your progress to boost donations!</p>
      <div className="flex flex-row space-x-4 items-center mt-2">
        <Skeleton width={160} height={20} component={"span"}/>
      </div>

      <Skeleton width={200} height={36} style={{ marginTop: 8 }} component={"span"}/>
      <Skeleton width={250} height={36} style={{ marginTop: 8 }} component={"span"}/>
    </div>
  </div>
  )
}

export default SkeletonAllStepComplete