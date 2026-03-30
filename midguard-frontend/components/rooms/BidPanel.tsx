"use client";

import { useState, useMemo, useEffect } from "react";

type Bid = {
  user: string;
  amount: number;
};

type Props = {
  bids: Bid[];
  currentUser: string;
  isEnded?: boolean;
  endTime: string;
  onPlaceBid: (amount: number) => void;
};

export default function BidPanel({
  bids,
  currentUser,
  endTime,
  onPlaceBid,
  isEnded = false,
}: Props) {
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  const highestBid = useMemo(() => {
    if (!bids.length) return 0;
    return Math.max(...bids.map((b) => b.amount));
  }, [bids]);

  const minBid = Math.ceil(highestBid * 1.25);

  const topBidders = useMemo(() => {
    return [...bids]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }, [bids]);

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const diff = new Date(endTime).getTime() - Date.now();

      if (diff <= 0) {
        setTimeLeft("Ended");
        clearInterval(interval);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const isValid =
    input &&
    Number(input) >= minBid &&
    timeLeft !== "Ended" &&
    !isEnded;

  const handleClick = () => {
    if (!isValid) return;
    onPlaceBid(Number(input));
    setInput("");
  };

  return (
    <div className="
      bg-[color:var(--foreground)/0.05]
      border border-[color:var(--foreground)/0.12]
      backdrop-blur-xl
      p-4 sm:p-5 md:p-6
      rounded-2xl
      shadow-sm
      space-y-5 sm:space-y-6
      transition-all duration-300
    ">

      {/* TOP BIDDERS */}
      <div>
        <h3 className="font-semibold mb-3 text-sm sm:text-base">
          Top Bidders
        </h3>

        <div className="space-y-2">
          {topBidders.map((b, i) => (
            <div
              key={i}
              className={`
                flex justify-between items-center
                p-2.5 rounded-lg text-sm sm:text-base
                transition
                ${
                  b.user === currentUser
                    ? "bg-orange-500/15 border border-orange-500/40"
                    : "bg-[color:var(--foreground)/0.06]"
                }
              `}
            >
              <span className="truncate">
                #{i + 1} {b.user}
              </span>
              <span className="font-medium">₹{b.amount}</span>
            </div>
          ))}

          {!topBidders.length && (
            <p className="text-[color:var(--foreground)/0.5] text-sm">
              No bids yet
            </p>
          )}
        </div>
      </div>

      {/* TIMER */}
      <div className="text-center">
        <p className="text-[color:var(--foreground)/0.6] text-xs sm:text-sm">
          Time Remaining
        </p>

        <div
          className={`
            text-xl sm:text-2xl font-bold
            ${timeLeft === "Ended"
              ? "text-red-500"
              : "text-green-500"}
          `}
        >
          {timeLeft || "--"}
        </div>
      </div>

      {/* BID INPUT */}
      <div className="space-y-3">
        <input
          type="number"
          placeholder={`Min ₹${minBid}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isEnded}
          className="
            w-full p-2.5 sm:p-3 rounded-xl
            bg-[color:var(--foreground)/0.08]
            border border-[color:var(--foreground)/0.15]
            text-[color:var(--foreground)]
            placeholder:text-[color:var(--foreground)/0.5]
            outline-none
            focus:ring-2 focus:ring-orange-500
            disabled:opacity-50
            transition
          "
        />

        <p className="text-xs text-[color:var(--foreground)/0.5]">
          Minimum bid: ₹{minBid}
        </p>

        <button
          onClick={handleClick}
          disabled={!isValid}
          className={`
            w-full py-2.5 sm:py-3 rounded-xl font-semibold transition
            ${
              isValid
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-[color:var(--foreground)/0.2] text-[color:var(--foreground)/0.5] cursor-not-allowed"
            }
          `}
        >
          {isEnded || timeLeft === "Ended"
            ? "Auction Ended"
            : "Place Bid"}
        </button>
      </div>
    </div>
  );
}
