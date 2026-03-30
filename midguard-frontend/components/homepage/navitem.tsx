import Link from "next/link";

function NavItem({ href, icon, label, pathname }: any) {
  const active = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`
          flex items-center gap-3 px-3 py-3 rounded-xl
          cursor-pointer transition

          ${
            active
              ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow"
              : `
                text-[color:var(--foreground)/0.7]
                hover:bg-[color:var(--foreground)/0.08]
                hover:text-[var(--foreground)]
              `
          }
        `}
      >
        {/* ICON */}
        <div
          className={`
            text-lg
            ${
              active
                ? "text-black"
                : "text-[color:var(--foreground)/0.7]"
            }
          `}
        >
          {icon}
        </div>

        {/* LABEL */}
        <span className="text-sm font-medium">
          {label}
        </span>
      </div>
    </Link>
  );
}

export default NavItem;
