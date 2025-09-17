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
import { getGoalMeasure, GoalMeasureKey } from "../entities/GoalMeasureConfig";
import useRaisedAmount from "../hooks/useRaisedAmount";


interface UserSummary {
    email: string;
    stravaUserId?: number;
    stravaClientId?: string;
    stravaClientSecret?: string;
    projectName?: string;
    goalMeasure?: GoalMeasureKey;
    fundraiserUrl?: string;
    fundraiserDescription?: string;
    isActive?: boolean | null;
}

export default function AllStepsComplete() {
    const [user, setUser] = useState<UserSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkingSub, setCheckingSub] = useState(false);
    const [subscriptionData, setSubscriptionData] = useState<any>(null);
    const [error, setError] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [amount, setAmount] = useState(0);
    const { data: raisedData, loading: amountLoading, error: amountError } = useRaisedAmount(user?.fundraiserUrl || "");


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/profile");
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            setIsVisible(user.isActive ?? false); // default to false if null
        }
    }, [user]);

    useEffect(() => {
        const handleCheckSubscription = async () => {
            if (!user?.stravaClientId) return; // wait until user is loaded
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

    if (loading) return (
        <SkeletonAllStepComplete />
    );
    if (!user) return <p>User not found</p>;



    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/strava/delete-subscription?id=${id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to delete");

            alert("Subscription deleted successfully ✅");
        } catch (err: any) {
            alert(`❌ ${err.message}`);
        }
    };

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

    const shareUrl = `${process.env.NEXT_PUBLIC_API_URL}/project/${user.stravaUserId}/${user.projectName}`
    const shareTitle = "Hike&Donate"

    return (
        <>

            <div className="max-w-md mx-auto p-4 flex flex-col gap-4">
                {/* Top white overlay before first HR */}
                <div style={{zIndex: -1}} className="absolute top-0 p-4 left-0 w-full h-16 bg-white opacity-60 pointer-events-none rounded-t-xl">
                </div>
                <h2 className="text" >Project Setup Summary</h2>
                <hr style={{ borderColor: "#74816c" }} />
    
                <div>
                    <h3 className="font-semibold flex justify-between items-center w-full">
                        <span>🔗 Strava Account</span>
                        <MarkIncompleteButton step="connectStrava" />
                    </h3>
                    
                    <p>
                        {subscriptionData?.isActive
                            ? "Subscription Active ✅"
                            : checkingSub
                                ? "Checking..."
                                : "No Active Subscription ❌"}
                    </p>

                    <p>Strava User ID: {user.stravaUserId || "Not connected"}</p>
                    <p>Client ID: {user.stravaClientId || "Not saved"}</p>
                    <p>Client Secret: {user.stravaClientSecret || "Not saved"}</p>

                    {subscriptionData?.isActive && (
                        <button className="custom-button mt-2 bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDelete(subscriptionData.raw[0].id)}>
                            Delete Subscription
                        </button>
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
                        <span>🎯 Project Goals</span>
                        <MarkIncompleteButton step="setGoals" />
                    </h3>
                    <p>Project Name: {user.projectName || "Not set"}</p>
                    <p>
                        Goal Measure:{" "}
                        {user.goalMeasure ? getGoalMeasure(user.goalMeasure).description : "Not set"}
                    </p>

                </div>
                <hr style={{ borderColor: "#74816c" }} />
                <div>
                    <h3 className="font-semibold flex justify-between items-center w-full">
                        <span>💰 Fundraiser</span>
                        <MarkIncompleteButton step="createFundraiser" />
                    </h3>
                    <div>Description: <div style={{border: "solid 1px", borderColor: "#74816c", borderRadius: "10px", padding: "10px", backgroundColor: "rgba(255, 255, 255, 0.6)" }} 
                    dangerouslySetInnerHTML={{ __html: user.fundraiserDescription ? DOMPurify.sanitize(user.fundraiserDescription) : ""  }} /></div>

                <p>Amount Raised: {amountLoading ? "Loading..." : `€${raisedData?.amount ?? 0}`}</p>
                {amountError && <p className="text-red-600">{amountError}</p>}

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
                        <span>🥾 Hike & Track & Share</span>
                        <MarkIncompleteButton step="hikeTrackShare" />
                    </h3>

                    <p>
                        Track your hike and share your progress to boost donations! </p>



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
          url={shareUrl}
          >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton
          url={shareUrl}
          title={shareTitle}
        >
          <XIcon size={32} round />
        </TwitterShareButton>
        <WhatsappShareButton
          url={shareUrl}
          title={shareTitle}
          separator=":: "
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <LinkedinShareButton
          url={shareUrl}        >
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
                <div style={{zIndex: -1}} className="absolute bottom-0 left-0 w-full h-40 bg-white opacity-60 pointer-events-none rounded-b-xl"></div>

            </div>
        </>
    );
}
