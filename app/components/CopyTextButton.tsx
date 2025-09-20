"use client";

import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";

interface CopyTextButtonProps {
  textToCopy: string;
}

export default function CopyTextButton({ textToCopy }: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
      <button
        onClick={handleCopy}
        className="hover:bg-gray-200 text-gray-600 text-sm active:scale-95 rounded transition"
      >
        {copied ? "✔️ Copied!" : <><IoCopyOutline /></>}
      </button>
  );
}
