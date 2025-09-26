"use client";

import Link from "next/link";
import React from "react";
import { TbArrowBack } from "react-icons/tb";

export default function ProjectPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
  {children}

  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 9999,
      backgroundColor: "rgba(128, 128, 128, 0.3)",
      overflow: "hidden",
    }}
  >
    <Link href="/dashboard/step">
          <button className="custom-button" style={{
        position: "absolute",
        top: 0,
        left: 0,
        margin: "10px",
        pointerEvents: "auto",
      }}><TbArrowBack />
</button></Link>
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gridAutoRows: "150px",
        opacity: 0.8,
        transform: "rotate(-30deg)",
        zIndex: 1,

      }}
    >
      

      
      {Array.from({ length: 100 }).map((_, i) => (
        <span
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "grey",
            fontSize: "1rem",
            fontWeight: "bold",
            userSelect: "none",
          }}
        >
          Preview Mode
        </span>
      ))}
    </div>
  </div>
</div>
  );
}
