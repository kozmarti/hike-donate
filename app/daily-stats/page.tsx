"use client";

import { useEffect, useState } from "react";
import DailyStatsCarousel from "../components/DailyCarousel";
import { useActivities } from "../hooks/useActivities";
import "@/styles/dailystats.css";

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
<DailyStatsCarousel activities={activities} loading={loading} />
    )
  }
  