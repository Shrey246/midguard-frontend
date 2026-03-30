"use client";

type Action = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
};

type Props = {
  roomType: "public" | "private" | "digital";
  actions: Action[];
};

export default function FloatingActionPanel({
  roomType,
  actions,
}: Props) {
  return (
    <div className="sticky bottom-4 z-50 px-2 sm:px-4">

      <div className="
        flex flex-col sm:flex-row
        sm:items-center sm:justify-between
        gap-3 sm:gap-4
        bg-[color:var(--foreground)/0.05]
        border border-[color:var(--foreground)/0.12]
        backdrop-blur-xl
        p-3 sm:p-4
        rounded-2xl
        shadow-lg
        transition-all duration-300
      ">

        {/* LEFT: ROOM TYPE */}
        <div className="
          text-xs sm:text-sm
          text-[color:var(--foreground)/0.6]
        ">
          Room:{" "}
          <span className="
            text-[color:var(--foreground)]
            capitalize font-medium
          ">
            {roomType}
          </span>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="
          flex flex-col sm:flex-row
          gap-2 sm:gap-3
          w-full sm:w-auto
        ">

          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={`
                w-full sm:w-auto
                px-4 sm:px-5 py-2.5
                rounded-xl font-medium
                text-sm sm:text-base
                transition-all duration-200
                ${
                  action.variant === "primary"
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
                    : "bg-[color:var(--foreground)/0.08] hover:bg-[color:var(--foreground)/0.15] text-[color:var(--foreground)]"
                }
              `}
            >
              {action.label}
            </button>
          ))}

        </div>
      </div>
    </div>
  );
}
