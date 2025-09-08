"use client";

import { useEffect, useState } from "react";
import DailyStatsCarousel from "../components/DailyCarousel";
import { useActivities } from "../hooks/useActivities";
import "@/styles/dailystats.css";
import Link from "next/link";
import { IoHomeOutline } from "react-icons/io5";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({ subsets: ['latin'] });

export default function Page() {
      const [loading, setLoading] = useState(true);
        const [activities, setActivities] = useState<any[]>([]);
      useEffect(() => {
        const fetchStats = async () => {
          try {
            const [data] = await Promise.all([
              useActivities(),
            ]);
            setActivities(data);
          } catch (error) {
            console.error("Failed to fetch stats:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchStats();
      }, []);
   
    return (
      <>
<DailyStatsCarousel activities={activities} loading={loading} />
          <Link href="/" >
          <button 
          className="custom-button"
          style={{
            fontFamily: fredoka.style.fontFamily,
            bottom: -1000,
    
          }}>
            <IoHomeOutline style={{display: "inline"}} /> Home
          </button>
    </Link>
    </>
    )
  }
  