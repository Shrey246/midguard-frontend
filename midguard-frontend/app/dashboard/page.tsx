"use client";

import { Hero } from "@/components/homepage/content/hero";
import { StatsGrid } from "@/components/homepage/content/statsgrid";
import { CategoryChips } from "@/components/homepage/content/categorychips";
import { QuickActions } from "@/components/homepage/content/quickactions";
import { ProductsGrid } from "@/components/homepage/content/productsgrid";
import { Footer } from "@/components/homepage/content/footer";
import FloatingActions from "@/components/homepage/content/floatingbuttons";

export default function DashboardPage() {
  return (
    <div className="flex">

      {/* MAIN AREA */}
      <div
        className="
          flex-1 relative min-h-screen overflow-hidden
          bg-[var(--background)] text-[var(--foreground)]
        "
      >
        {/* 🌈 THEME-AWARE BACKGROUND */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-b
            from-[color:var(--foreground)/0.03]
            to-transparent
          "
        />

        {/* ✨ SOFT GLOW */}
        <div
          className="
            absolute top-0 left-1/2 -translate-x-1/2
            w-[600px] h-[300px]
            bg-cyan-500/20 blur-3xl
            pointer-events-none
          "
        />

        {/* CONTENT WRAPPER */}
        <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto">

          {/* HERO + STATS */}
          <div
            className="
              flex flex-col lg:flex-row
              gap-6 mb-6
              items-stretch lg:items-start
            "
          >
            <div className="flex-1">
              <Hero />
            </div>

            <div className="w-full lg:w-auto">
              <StatsGrid />
            </div>
          </div>

          {/* CONTENT FLOW */}
          <div className="space-y-6">
            <CategoryChips />
            <QuickActions />
            <ProductsGrid />
          </div>

          {/* FOOTER */}
          <Footer />

          {/* FLOATING BUTTONS */}
          <FloatingActions />
        </div>
      </div>
    </div>
  );
}
