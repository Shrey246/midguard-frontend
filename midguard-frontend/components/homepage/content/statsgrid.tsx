"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function StatsGrid() {
  const [stats, setStats] = useState({
    rooms: 0,
    transactions: 0,
    users: 0,
    escrow: 0,
  });

  const fetchStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("❌ Stats fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const items = [
    { label: "Active Rooms", value: stats.rooms },
    { label: "Trusted Transactions", value: stats.transactions },
    { label: "Active Users", value: stats.users },
    { label: "Escrow's Handled", value: stats.escrow },
  ];

  return (
    <div
      className="
        grid gap-4
        grid-cols-2 sm:grid-cols-2 md:grid-cols-4
      "
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="
            p-4 rounded-xl
            border border-[color:var(--foreground)/0.12]
            bg-[color:var(--foreground)/0.04]

            hover:border-cyan-400
            transition
          "
        >
          {/* LABEL */}
          <p className="text-xs text-[color:var(--foreground)/0.6]">
            {item.label}
          </p>

          {/* VALUE */}
          <h3
            className="
              text-xl font-semibold mt-1
              text-[var(--foreground)]
            "
          >
            {item.value ?? 0}
          </h3>

          {/* LIVE INDICATOR */}
          <div className="flex items-center gap-2 mt-2 text-[color:var(--foreground)/0.5] text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
        </div>
      ))}
    </div>
  );
}
