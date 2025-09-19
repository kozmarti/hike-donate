// components/ProgressBar.tsx
"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
  duration?: number; // seconds (default: 60)
  isEnded?: boolean; // parent tells bar to finish immediately
}

export default function ProgressBar({ duration = 60, isEnded = false }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isEnded) {
      setProgress(100);
      return;
    }

    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(percent);

      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [duration, isEnded]);

  return (
    <div className="mb-4 mt-4 w-full max-w-md">
      <div className="h-3 progress-bar-uncompleted rounded-xl overflow-hidden">
        <div
          className="h-3 progress-bar-completed rounded-xl transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
