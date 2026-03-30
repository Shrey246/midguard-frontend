import Link from "next/link";

export function QuickActions() {
  const actions = [
    { label: "Auction Rooms", href: "/dashboard/listroom/auction" },
    { label: "Marketplace", href: "/dashboard/listroom/public" },
    { label: "Private Rooms", href: "dashboard/join-private" },
    { label: "Digital Products", href: "/dashboard/listroom/digital" },
  ];

  return (
    <div
      className="
        grid gap-4 mb-6
        grid-cols-1 sm:grid-cols-2
      "
    >
      {actions.map((a) => (
        <Link key={a.label} href={a.href}>
          <div
            className="
              p-5 rounded-xl
              border border-[color:var(--foreground)/0.12]
              bg-[color:var(--foreground)/0.04]
              text-[var(--foreground)]

              hover:border-cyan-400
              hover:shadow-md
              hover:scale-[1.02]

              transition cursor-pointer
            "
          >
            {/* TITLE */}
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {a.label}
              </span>

              <span className="text-cyan-400 text-sm">
                →
              </span>
            </div>

            {/* SUBTEXT */}
            <p className="text-xs mt-2 text-[color:var(--foreground)/0.6]">
              Explore {a.label.toLowerCase()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
