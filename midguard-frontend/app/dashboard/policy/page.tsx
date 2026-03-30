"use client";

import { useState } from "react";

export default function PolicyPage() {
  const [active, setActive] = useState<"privacy" | "terms">("privacy");

  return (
    <div className="
      min-h-screen w-full
      px-3 sm:px-4 md:px-6
      py-4 sm:py-6
      bg-[color:var(--background)]
      text-[color:var(--foreground)]
      transition-all duration-300
    ">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">

        {/* 🔥 TAB SWITCH */}
        <div className="
          flex flex-col sm:flex-row
          bg-[color:var(--foreground)/0.05]
          border border-[color:var(--foreground)/0.12]
          rounded-2xl p-1 gap-1
        ">
          <button
            onClick={() => setActive("privacy")}
            className={`
              w-full sm:w-1/2
              py-2.5 sm:py-3
              rounded-xl text-sm font-medium
              transition-all duration-200
              ${
                active === "privacy"
                  ? "bg-purple-500 text-white shadow"
                  : "text-[color:var(--foreground)/0.6] hover:bg-[color:var(--foreground)/0.06]"
              }
            `}
          >
            Privacy Policy
          </button>

          <button
            onClick={() => setActive("terms")}
            className={`
              w-full sm:w-1/2
              py-2.5 sm:py-3
              rounded-xl text-sm font-medium
              transition-all duration-200
              ${
                active === "terms"
                  ? "bg-purple-500 text-white shadow"
                  : "text-[color:var(--foreground)/0.6] hover:bg-[color:var(--foreground)/0.06]"
              }
            `}
          >
            Terms & Conditions
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="
          bg-[color:var(--foreground)/0.05]
          border border-[color:var(--foreground)/0.12]
          rounded-2xl
          p-4 sm:p-6 md:p-8
          space-y-6
        ">

          {/* 🔐 PRIVACY POLICY */}
          {active === "privacy" && (
            <>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
                Privacy Policy
              </h1>

              <div className="
                border-t border-[color:var(--foreground)/0.1]
                pt-4 sm:pt-6
                space-y-5 sm:space-y-6
              ">

                <Section
                  number="1."
                  title="Information We Collect"
                  content="We collect personal details such as your name, email, phone number, and transaction data to provide and improve our services."
                />

                <Section
                  number="2."
                  title="Use of Information"
                  content="Your information is used to facilitate transactions, improve platform performance, and enhance user experience."
                />

                <Section
                  number="3."
                  title="Data Protection"
                  content="We implement industry-standard security measures to protect your data from unauthorized access or misuse."
                />

              </div>
            </>
          )}

          {/* 📜 TERMS & CONDITIONS */}
          {active === "terms" && (
            <>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
                Terms & Conditions
              </h1>

              <div className="
                border-t border-[color:var(--foreground)/0.1]
                pt-4 sm:pt-6
                space-y-5 sm:space-y-6
              ">

                <Section
                  number="1."
                  title="Acceptance of Terms"
                  content="By using MidGuard, you agree to comply with all applicable terms, conditions, and policies."
                />

                <Section
                  number="2."
                  title="User Responsibilities"
                  content="Users are responsible for providing accurate information and ensuring fair and lawful use of the platform."
                />

                <Section
                  number="3."
                  title="Intellectual Property"
                  content="All platform content, branding, and technology are owned by MidGuard and protected by applicable laws."
                />

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE SECTION ================= */

function Section({ number, title, content }: any) {
  return (
    <div className="space-y-1 sm:space-y-2">
      <h2 className="text-base sm:text-lg font-medium">
        {number} {title}
      </h2>
      <p className="
        text-[color:var(--foreground)/0.7]
        text-sm sm:text-[15px]
        leading-relaxed
        max-w-3xl
      ">
        {content}
      </p>
    </div>
  );
}
