"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MarkIncompleteButton from "./MarkIncompleteButton";

interface UserSummary {
    email: string;
    stravaUserId?: number;
    stravaClientId?: string;
    stravaClientSecret?: string;
    projectName?: string;
    goalMeasure?: "km" | "m" | "hours";
    fundraiserUrl?: string;
    fundraiserDescription?: string;
}

export default function AllStepsComplete() {
    const [user, setUser] = useState<UserSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkingSub, setCheckingSub] = useState(false);
    const [subscriptionData, setSubscriptionData] = useState<any>(null);
    const [error, setError] = useState("");

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

    if (loading) return <p>Loading summary...</p>;
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

    return (
        <div className="max-w-md mx-auto p-4 flex flex-col gap-4">
            <h2 className="text">Project Setup Summary</h2>

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
                    {user.goalMeasure === "km"
                        ? "EUR = distance (km)"
                        : user.goalMeasure === "m"
                            ? "EUR = total elevation (m)"
                            : user.goalMeasure === "hours"
                                ? "EUR = hiking time (hours)"
                                : "Not set"}
                </p>

            </div>
            <hr style={{ borderColor: "#74816c" }} />
            <div>
                <h3 className="font-semibold flex justify-between items-center w-full">
                    <span>💰 Fundraiser</span>
                    <MarkIncompleteButton step="createFundraiser" />
                </h3>
                <p>
                    Leetchi Page:{" "}
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
                <p>Description: {user.fundraiserDescription || "Not set"}</p>

            </div>
            <hr style={{ borderColor: "#74816c" }} />

            <div>
                <h3 className="font-semibold flex justify-between items-center w-full">
                    <span>🥾  "Hike & Track & Share"</span>
                    <MarkIncompleteButton step="hikeTrackShare" />
                </h3>
                <p>
                    Track your hike and share your progress to boost donations!
                </p>
                <Link href="/dashboard/step">
                    <button className="custom-button mt-2">         Visit Project Site
                    </button>
                </Link>

            </div>
        </div>
    );
}
