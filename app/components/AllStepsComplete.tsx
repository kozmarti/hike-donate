"use client";

import { useEffect, useState } from "react";
import MarkIncompleteButton from "./MarkIncompleteButton";
import SkeletonAllStepComplete from "./SkeletonAllStepComplete";
import Link from "next/link";
import {
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon
} from "react-share";
import DOMPurify from 'dompurify';
import { getGoalMeasure } from "../entities/GoalMeasureConfig";
import useRaisedAmount from "../hooks/useRaisedAmount";
import useUser from "../hooks/useUser";
import DeleteStravaButton from "./DeleteStravaButton";
import CopyTextButton from "./CopyTextButton";


export default function AllStepsComplete() {
    const [checkingSub, setCheckingSub] = useState(false);
    const [subscriptionData, setSubscriptionData] = useState<any>(null);
    const [error, setError] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const { data: user, loading: loading, error: userError } = useUser()
    const { data: raisedData, loading: amountLoading, error: amountError } = useRaisedAmount(user?.fundraiserUrl || "");

    useEffect(() => {
        const handleCheckSubscription = async () => {
            if (!user?.stravaClientId) return;
            setCheckingSub(true);
            setError("");
            setSubscriptionData(null);

            try {
                const res = await fetch("/api/strava/check-subscription");
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Failed to check subscription");
                } else {
                    const isActive = data.some(
                        (sub: any) => sub.application_id.toString() === user.stravaClientId
                    );
                    setSubscriptionData({ raw: data, isActive });
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setCheckingSub(false);
            }
        };

        handleCheckSubscription();
    }, [user]);

    useEffect(() => {
        if (user?.isActive) {
            setIsVisible(true);
        }
    }, [user]);

    if (loading) return (
        <SkeletonAllStepComplete />
    );
    if (!user && !loading) return <p>User not found</p>;

    const toggleVisibility = async () => {
        try {
            const res = await fetch("/api/profile/set-visibility", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !isVisible }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update visibility");

            setIsVisible(!isVisible);
        } catch (err: any) {
            console.error(err);
            alert(err.message);
        }
    };

    const shareTitle = "Hike&Donate"

    return (
        <>

            <div className="max-w-md mx-auto p-4 flex flex-col gap-8">
                {/* Top white overlay before first HR */}
                <div style={{ zIndex: -1, borderTopRightRadius: "20px", borderTopLeftRadius: "20px" }} className="absolute top-0 p-4 left-0 w-full h-20 bg-white opacity-60 pointer-events-none">
                </div>
                <h2 className="text" >Project Setup Summary</h2>
                <hr style={{ borderColor: "#74816c" }} />

                <div>
                    <h3 className="font-semibold flex justify-between items-center w-full">
                        <span className="p-2">🔗 Strava Account</span>
                        {!isVisible && (!user?.stravaUserId ||  (!checkingSub && !subscriptionData?.isActive)) &&(
                            <MarkIncompleteButton step="connectStrava" />
                        )}
                    </h3>

                    <p className="p-2">
                        {subscriptionData?.isActive
                            ? "Strava Connected ✅"
                            : checkingSub
                                ? "Checking..."
                                : "Strava Not Connected ❌"}
                    </p>               
                    {subscriptionData?.isActive && !isVisible && (
                        <DeleteStravaButton />
                    )}
                    {subscriptionData?.isActive && isVisible && (
                        <div className="p-1 text-gray-600 text-sm"> Make your project private to delete your Strava connection. </div>
                    )}

                    {subscriptionData && !subscriptionData.isActive && (
                        <p className="text-gray-600 mt-1 text-sm">
                            No active subscription found for this Strava account.
                        </p>
                    )}
                    {error && <p className="text-red-600 mt-1">{error}</p>}
                </div>


                <hr style={{ borderColor: "#74816c" }} />
                <div>
                    <h3 className="font-semibold flex justify-between items-center w-full">
                        <span className="p-2">🎯 Project Goals</span>
                        {!isVisible && (

                            <MarkIncompleteButton step="setGoals" />
                        )}
                    </h3>
                    <p> ✨ Project Name: <span className="custom-error-text font-semibold">{user.projectName || "Not set"} </span>  {user.projectName && <CopyTextButton textToCopy={user.projectName} />}
                     

                        <br />
                        <span className="text-gray-600 text-sm">
                        ✨ This project name is the key 🔑 rename your activities in Strava to match this to enable synchronization.                     </span>
                    </p>
                    <p className="mt-3">
                        Goal Measure:{" "}
                        {user.goalMeasure ? getGoalMeasure(user.goalMeasure).description : "Not set"}
                    </p>

                </div>
                <hr style={{ borderColor: "#74816c" }} />
                <div>
                    <h3 className="font-semibold flex justify-between items-center w-full">
                        <span className="p-2">💰 Fundraiser</span>
                        {!isVisible && (
                            <MarkIncompleteButton step="createFundraiser" />
                        )}
                    </h3>

                    <p>Amount Raised: {amountLoading ? "Loading..." : `€${raisedData?.amount ?? 0}`}</p>
                    {amountError && <p className="text-red-600">{amountError}</p>}
                    <div>Description:

                        <div style={{ border: "solid 1px", borderColor: "#74816c", borderRadius: "10px", padding: "10px", backgroundColor: "rgba(255, 255, 255, 0.6)", margin: "20px 0px 20px 0px" }}
                            dangerouslySetInnerHTML={{ __html: user.fundraiserDescription ? DOMPurify.sanitize(user.fundraiserDescription) : "" }} /></div>


                    <p>
                        Your Fundraiser Page:{" "}
                        {user.fundraiserUrl ? (
                            <a
                                href={user.fundraiserUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                {user.fundraiserUrl}
                            </a>
                        ) : (
                            "Not set"
                        )}
                    </p>
                </div>
                <hr style={{ borderColor: "#74816c" }} />

                <div>
                    <h3 className="font-semibold flex justify-between items-center w-full">
                        <span className="p-2">🥾 Hike & Track & Share</span>
                        {!isVisible && (
                            <MarkIncompleteButton step="hikeTrackShare" />
                        )}
                    </h3>

                    <p>
                    Hit the trail, 🔄 sync your progress from Strava, and 📢 share your journey to maximize donations! </p>



                    <div className="flex items-center space-x-4 mt-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isVisible}
                                onChange={toggleVisibility}
                                className="sr-only"
                                disabled={loading}
                            />
                            {/* Toggle background */}
                            <div
                                className={`w-14 h-8 rounded-full transition-colors duration-300`}
                                style={{ backgroundColor: isVisible ? "#69FDA9" : "#ff6078" }}
                            ></div>
                            {/* Toggle knob */}
                            <span
                                className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300`}
                                style={{ transform: isVisible ? "translateX(24px)" : "translateX(0)" }}
                            ></span>
                        </label>
                        <span className="font-medium">
                            {isVisible ? "Project Public 🌍" : "Project Hidden 🙈"}
                        </span>
                    </div>
                </div>
                <hr style={{ borderColor: "#74816c" }} />

                <div>
                    {isVisible ? (
                        <div className="flex flex-col items-center">
                            <Link target="_blank" href={`/project/${user.stravaUserId}/${user.projectName}`} passHref>
                                <button type="button" className="custom-button mt-2 w-full text-center">
                                    🌍 Visit Public Project Site
                                </button>
                            </Link>
                            <p className="mt-1 text-center">
                                🎉 Your project is live!
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <FacebookShareButton
                                    url={`${process.env.NEXT_PUBLIC_API_URL}/project/${user.stravaUserId}/${user.projectName}`}
                                >
                                    <FacebookIcon size={32} round />
                                </FacebookShareButton>
                                <TwitterShareButton
                                    url={`${process.env.NEXT_PUBLIC_API_URL}/project/${user.stravaUserId}/${user.projectName}`}
                                    title={shareTitle}
                                >
                                    <XIcon size={32} round />
                                </TwitterShareButton>
                                <WhatsappShareButton
                                    url={`${process.env.NEXT_PUBLIC_API_URL}/project/${user.stravaUserId}/${user.projectName}`}
                                    title={shareTitle}
                                    separator=":: "
                                >
                                    <WhatsappIcon size={32} round />
                                </WhatsappShareButton>
                                <LinkedinShareButton
                                    url={`${process.env.NEXT_PUBLIC_API_URL}/project/${user.stravaUserId}/${user.projectName}`}        >
                                    <LinkedinIcon size={32} round />
                                </LinkedinShareButton>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Link href="/dashboard/project-preview">
                                <button type="button" className="custom-button mt-2 w-full text-center">
                                    🥾 Preview Project Site
                                </button>
                            </Link>
                            <p className="mt-1 text-center mb-4">
                                👀 Your project is currently private.
                                <br />
                                Make it public whenever ready.
                            </p>
                        </div>
                    )}
                </div>
                <div style={{ zIndex: -1, borderBottomRightRadius: "20px", borderBottomLeftRadius: "20px" }} className="absolute bottom-0 left-0 w-full h-44 bg-white opacity-60 pointer-events-none rounded-b-xl"></div>

            </div>

        </>
    );
}
