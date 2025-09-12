"use client";

import { useSearchParams } from "next/navigation";

export default function VerifiedPage() {
    const searchParams = useSearchParams();
    const status = searchParams?.get("status");

    let title = "";
    let message = "";

    switch (status) {
        case "success":
            title = "✅ Email Verified!";
            message = "Your account is now active. You can log in.";
            break;
        case "already":
            title = "ℹ️ Already Verified";
            message = "Your email was already verified. You can log in directly.";
            break;
        case "expired":
            title = "⚠️ Link Expired";
            message = "The verification link has expired. Please register again.";
            break;
        case "invalid":
            title = "❌ Invalid Link";
            message = "The verification link is invalid.";
            break;
        default:
            title = "❌ Error";
            message = "Something went wrong.";
    }

    return (
        <div className="map-wrapper flex flex-col items-center justify-center p-4">
            <h1 className="mb-4">{title}</h1>
            <p className="mb-6">{message}</p>
            <a
                href="/welcome"
                className="custom-button no-underline"
            >
                Go to Login
            </a>
        </div>
    );
}
