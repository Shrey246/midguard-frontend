"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutGrid,
  Package,
  ListOrdered,
  Heart,
  Settings,
  Shield,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

import NavItem from "../../navitem";
import { api } from "@/lib/api";

export default function Sidebar({ open, setOpen }: any) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  // THEME INIT
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved) {
      const isDark = saved === "dark";
      setDark(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout failed");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-[260px]
        bg-[var(--background)] text-[var(--foreground)]
        border-r border-[color:var(--foreground)/0.12]
        backdrop-blur-xl

        p-4 z-50 flex flex-col
        transition-transform duration-300

        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* TOP */}
      <div>
        {/* CLOSE (mobile) */}
        <button
          onClick={() => setOpen(false)}
          className="
            mb-4 md:hidden
            text-[color:var(--foreground)/0.6]
            hover:text-[var(--foreground)]
          "
        >
          ✕
        </button>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-black">
            MG
          </div>
          <div>
            <h1 className="font-semibold text-[var(--foreground)]">
              MidGuard
            </h1>
            <p className="text-xs text-[color:var(--foreground)/0.6]">
              Marketplace
            </p>
          </div>
        </div>

        {/* NAV */}
        <nav className="space-y-2">
          <NavItem
            href="/dashboard"
            icon={<LayoutGrid size={18} />}
            label="Discover"
            pathname={pathname}
          />
          <NavItem
            href="/dashboard/myorders"
            icon={<Package size={18} />}
            label="My Orders"
            pathname={pathname}
          />
          <NavItem
            href="/dashboard/listedorders"
            icon={<ListOrdered size={18} />}
            label="Listed Orders"
            pathname={pathname}
          />
          <NavItem
            href="/dashboard/wishlist"
            icon={<Heart size={18} />}
            label="Wishlist"
            pathname={pathname}
          />
          <NavItem
            href="/dashboard/settings"
            icon={<Settings size={18} />}
            label="Settings"
            pathname={pathname}
          />
          <NavItem
            href="/dashboard/policy"
            icon={<Shield size={18} />}
            label="Privacy & Policy"
            pathname={pathname}
          />
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="mt-auto space-y-4">

        {/* THEME TOGGLE */}
        <div
          className="
            flex items-center justify-between px-3 py-3 rounded-xl
            bg-[color:var(--foreground)/0.05]
            border border-[color:var(--foreground)/0.12]
          "
        >
          <div className="flex items-center gap-2 text-sm text-[color:var(--foreground)/0.7]">
            {dark ? <Moon size={16} /> : <Sun size={16} />}
            {dark ? "Dark Mode" : "Light Mode"}
          </div>

          <button
            onClick={() => {
              const newDark = !dark;
              setDark(newDark);
          
              document.documentElement.classList.toggle("dark", newDark);
              localStorage.setItem("theme", newDark ? "dark" : "light");
            }}
            className={`
              w-10 h-5 flex items-center rounded-full p-1 transition
              ${dark 
                ? "bg-cyan-500" 
                : "bg-[color:var(--foreground)/0.2]"
              }
            `}
          >
            <div
              className={`
                w-4 h-4 rounded-full shadow-md transform transition
                ${dark ? "translate-x-5 bg-white" : "translate-x-0 bg-[var(--background)]"}
                border border-[color:var(--foreground)/0.15]
              `}
            />
          </button>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center justify-center gap-2 py-3 rounded-xl 
            bg-gradient-to-r from-red-500 to-pink-500 
            hover:from-red-600 hover:to-pink-600 
            text-white font-semibold 
            shadow-lg shadow-red-500/20 
            hover:shadow-red-500/40 
            transition-all duration-300 active:scale-95
          "
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
