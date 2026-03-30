"use client";

export function Hero() {
  return (
    <div
      className="
        w-full flex items-start justify-between gap-6 mb-6
        p-5 rounded-2xl
        bg-[color:var(--foreground)/0.04]
        border border-[color:var(--foreground)/0.08]
        backdrop-blur-sm
        transition-colors duration-300
      "
    >
      <div>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          Welcome to{" "}
          <span className="text-cyan-400">MidGuard</span>
        </h2>

        <p className="text-sm mt-2 text-[color:var(--foreground)/0.7]">
          Find and hustle for your next favorite thing
        </p>

        <p className="text-xs mt-1 text-[color:var(--foreground)/0.5]">
          Your physical and digital product trade center
        </p>
      </div>
    </div>
  );
}
