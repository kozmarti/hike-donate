"use client";

import React from "react";

export default function ProjectPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      {/* Your actual content */}
      {children}

      {/* Gray overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(128, 128, 128, 0.3)", // gray with 30% opacity
          pointerEvents: "none", // allows clicking through
          zIndex: 9999,
        }}
      />
    </div>
  );
}
