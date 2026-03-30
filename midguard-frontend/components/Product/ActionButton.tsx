"use client";

import { useState } from "react";

type Props = {
  type: "auction" | "buy";
  onClick: () => Promise<void> | void;
  disabled?: boolean;
};

export default function ActionButton({
  type,
  onClick,
  disabled = false,
}: Props) {
  const [loading, setLoading] = useState(false);

  const isAuction = type === "auction";

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (loading || disabled) return;

    try {
      setLoading(true);
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        w-full mt-3 py-2 rounded-lg font-semibold text-sm
        transition-all duration-200

        ${
          isAuction
            ? `
              bg-purple-500/90 hover:bg-purple-500
              text-white shadow-md shadow-purple-500/20
            `
            : `
              bg-cyan-500/90 hover:bg-cyan-500
              text-white shadow-md shadow-cyan-500/20
            `
        }

        ${
          disabled || loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-[1.02] active:scale-[0.98]"
        }
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          Processing...
        </span>
      ) : isAuction ? (
        "Place Bid"
      ) : (
        "Buy Now"
      )}
    </button>
  );
}
