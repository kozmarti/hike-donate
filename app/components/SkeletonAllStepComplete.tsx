"use client";

import Skeleton from "@mui/material/Skeleton";


const SkeletonAllStepComplete = () => {
  return (
    <div className="max-w-md mx-auto p-4 flex flex-col gap-8">
    <div style={{ zIndex: -1, borderTopRightRadius: "20px", borderTopLeftRadius: "20px" }} className="absolute top-0 p-4 left-0 w-full h-20 bg-white opacity-60 pointer-events-none">
    </div>
    <h2 className="text">Project Setup Summary</h2>
    <hr style={{ borderColor: "#74816c" }} />

    {/* Strava Account */}
    <div>
      <h3 className="font-semibold flex justify-between items-center w-full">
        <span>🔗 Strava Account</span>
        <Skeleton width={60} height={60} component={"span"} />
      </h3>
      <p>
        <Skeleton width={150} height={20} style={{ display: "inline-block" }} component={"span"}/>
      </p>
      {/**
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
 */}
      <p className="text-gray-600 mt-1 text-sm">
        <Skeleton width={160} height={40} style={{ display: "inline-block" }} component={"span"}/>
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
        <span>✨ Project Name: </span>
        <Skeleton width={120} height={20} style={{ display: "inline-block" }} component={"span"}/>
        <br />
                        <span className="text-gray-600 text-sm">
                        ✨ This project name is the key 🔑 rename your activities in Strava to match this to enable synchronization.                     </span>
                    
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