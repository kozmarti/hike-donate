"use client";
import Link from "next/link";
import { ActivityFormComponent } from "../components/ActivityFormComponent";

export default function Page() {

    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
      <Link href="/activities">
      <button className="px-4 py-2 text-white rounded">
        Back to Activities
      </button>
    </Link>
    <ActivityFormComponent />
    </ div>

    )
    ;
  }