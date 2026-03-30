"use client";

import { useState } from "react";
import Sidebar from "@/components/homepage/Navbars/sidebar/side";
import Topbar from "@/components/homepage/Navbars/topbar/top";

export default function DashboardLayout({ children }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="
        flex min-h-screen
        bg-[var(--background)] text-[var(--foreground)]
        transition-colors duration-300
      "
    >
      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 relative z-10">
        
        {/* TOPBAR */}
        <Topbar setOpen={setOpen} />

        {/* CONTENT */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* OVERLAY (Mobile Sidebar) */}
      {open && (
        <div
          className="
            fixed inset-0
            bg-black/40 dark:bg-black/60
            backdrop-blur-sm
            z-40
            transition-opacity duration-300
          "
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
