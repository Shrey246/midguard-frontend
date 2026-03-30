"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, LogOut } from "lucide-react";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();

  const [dark, setDark] = useState(true);
  const [promo, setPromo] = useState(true);
  const [orders, setOrders] = useState(true);

  const handleLogout = async () => {
    try {
      await api.logout();
      localStorage.removeItem("token");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="
      min-h-screen w-full
      px-3 sm:px-4 md:px-6
      py-4 sm:py-6
      bg-[color:var(--background)]
      text-[color:var(--foreground)]
      transition-all duration-300
    ">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ================= APPEARANCE ================= */}
        <div className="
          bg-[color:var(--foreground)/0.05]
          border border-[color:var(--foreground)/0.12]
          rounded-2xl
          p-4 sm:p-5 md:p-6
        ">
          <h2 className="text-base sm:text-lg font-semibold mb-4">
            Appearance
          </h2>

          <div className="
            flex flex-col sm:flex-row
            items-start sm:items-center
            justify-between gap-4
          ">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-[color:var(--foreground)/0.6]">
                Customize your visual experience.
              </p>
            </div>

            <div className="
              flex bg-[color:var(--foreground)/0.08]
              rounded-lg p-1
              w-full sm:w-auto
            ">
              <button
                onClick={() => setDark(false)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm transition ${
                  !dark
                    ? "bg-white text-black shadow"
                    : "text-[color:var(--foreground)/0.6]"
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setDark(true)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm transition ${
                  dark
                    ? "bg-purple-500 text-white shadow"
                    : "text-[color:var(--foreground)/0.6]"
                }`}
              >
                Dark
              </button>
            </div>
          </div>
        </div>

        {/* ================= NOTIFICATIONS ================= */}
        <div className="
          bg-[color:var(--foreground)/0.05]
          border border-[color:var(--foreground)/0.12]
          rounded-2xl
          p-4 sm:p-5 md:p-6
          space-y-4
        ">
          <h2 className="text-base sm:text-lg font-semibold">
            Notifications
          </h2>

          <div className="
            flex items-center justify-between
            border-t border-[color:var(--foreground)/0.1]
            pt-4
          ">
            <div>
              <p className="font-medium">Promotional Offers</p>
              <p className="text-sm text-[color:var(--foreground)/0.6]">
                Receive updates on sales and special deals.
              </p>
            </div>

            <Toggle value={promo} setValue={setPromo} />
          </div>

          <div className="
            flex items-center justify-between
            border-t border-[color:var(--foreground)/0.1]
            pt-4
          ">
            <div>
              <p className="font-medium">Order Updates</p>
              <p className="text-sm text-[color:var(--foreground)/0.6]">
                Get notified about your order status.
              </p>
            </div>

            <Toggle value={orders} setValue={setOrders} />
          </div>
        </div>

        {/* ================= ACCOUNT & LEGAL ================= */}
        <div className="
          bg-[color:var(--foreground)/0.05]
          border border-[color:var(--foreground)/0.12]
          rounded-2xl
          p-4 sm:p-5 md:p-6
        ">
          <h2 className="text-base sm:text-lg font-semibold mb-4">
            Account & Legal
          </h2>

          <div className="divide-y divide-[color:var(--foreground)/0.1]">

            <Row
              label="Edit Profile"
              onClick={() => router.push("/dashboard/Account")}
            />

            <Row
              label="Manage Addresses"
              onClick={() => router.push("/dashboard/address")}
            />

            <Row
              label="About Us"
              highlight
              onClick={() => router.push("/dashboard/Aboutus")}
            />

            <Row
              label="Privacy Policy & Terms"
              onClick={() => router.push("/dashboard/policy")}
            />

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center justify-between
                py-4
                text-red-500
                hover:text-red-400
                transition
              "
            >
              <span>Logout</span>
              <LogOut size={18} />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Toggle({ value, setValue }: any) {
  return (
    <button
      onClick={() => setValue(!value)}
      className={`
        w-12 h-6 flex items-center rounded-full p-1 transition
        ${value ? "bg-purple-500" : "bg-[color:var(--foreground)/0.2]"}
      `}
    >
      <div
        className={`
          w-4 h-4 bg-white rounded-full shadow-md transform transition
          ${value ? "translate-x-6" : "translate-x-0"}
        `}
      />
    </button>
  );
}

function Row({ label, onClick, highlight }: any) {
  return (
    <div
      onClick={onClick}
      className="
        flex items-center justify-between
        py-4 cursor-pointer
        hover:bg-[color:var(--foreground)/0.06]
        px-2 rounded-lg transition
      "
    >
      <span
        className={`${
          highlight
            ? "text-purple-400"
            : "text-[color:var(--foreground)/0.8]"
        }`}
      >
        {label}
      </span>
      <ChevronRight size={18} className="text-[color:var(--foreground)/0.4]" />
    </div>
  );
}
