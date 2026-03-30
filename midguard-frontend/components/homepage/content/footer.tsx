export function Footer() {
  return (
    <footer
      className="
        mt-12 pt-8 pb-6
        border-t border-[color:var(--foreground)/0.15]
        text-[var(--foreground)]
        transition-colors duration-300
      "
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6">

        {/* TOP ROW */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* BRAND */}
          <div>
            <h2 className="font-semibold text-lg tracking-wide">
              MidGuard
            </h2>
            <p className="text-sm text-[color:var(--foreground)/0.6]">
              Secure trades. Zero trust required.
            </p>
          </div>

          {/* LINKS */}
          <div className="flex gap-6 text-sm">
            {["Privacy", "Terms", "Support"].map((item) => (
              <button
                key={item}
                className="
                  text-[color:var(--foreground)/0.6]
                  hover:text-cyan-400
                  transition
                "
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-[color:var(--foreground)/0.1]" />

        {/* BOTTOM ROW */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">

          <p className="text-[color:var(--foreground)/0.6]">
            © {new Date().getFullYear()} MidGuard. All rights reserved.
          </p>

          {/* STATUS */}
          <div className="flex items-center gap-2 text-[color:var(--foreground)/0.6]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Operational
          </div>
        </div>
      </div>
    </footer>
  );
}
