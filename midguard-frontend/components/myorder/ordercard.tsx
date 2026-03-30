"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Props = {
  order: any;
};

export default function OrderCard({ order }: Props) {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await api.getRoomAssets(order.roomId);
        if (res?.data?.length > 0) {
          setImage(res.data[0].url); // 👈 first image only
        }
      } catch (err) {
        console.error("Image fetch failed", err);
      }
    };

    fetchImage();
  }, [order.roomId]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "delivered":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "disputed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "cancelled":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "in_progress":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-white/10 text-gray-300 border-white/10";
    }
  };

  const handleClick = () => {
    router.push(`/dashboard/escrow/${order.sessionId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="
        group w-full p-4 rounded-2xl
        bg-gradient-to-br from-white/5 to-white/0
        border border-white/10
        hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10
        transition-all duration-300 cursor-pointer
      "
    >
      <div className="flex gap-4">
        
        {/* IMAGE */}
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt="product"
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1">
          
          {/* TOP */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {order.role === "buyer" ? "Buying" : "Selling"}
            </p>

            <span
              className={`text-[10px] px-2 py-1 rounded-full border ${getStatusStyle(
                order.status
              )}`}
            >
              {order.status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          {/* TITLE */}
          <h2 className="text-lg font-semibold text-white mt-1 line-clamp-1">
            {order.productName}
          </h2>

          {/* META */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">
              {order.roomType.toUpperCase()}
            </p>

            <p className="text-lg font-bold text-cyan-400">
              ₹{order.price}
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 mt-3">
            
            {/* VIEW BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="
                text-xs px-3 py-1.5 rounded-lg
                bg-cyan-500/20 text-cyan-300
                hover:bg-cyan-500/30 transition
              "
            >
              View Details
            </button>

            {/* TRACK BUTTON */}
            {order.trackingLink && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(order.trackingLink, "_blank");
                }}
                className="
                  text-xs px-3 py-1.5 rounded-lg
                  bg-blue-500/20 text-blue-300
                  hover:bg-blue-500/30 transition
                "
              >
                Track
              </button>
            )}
          </div>

          {/* DATE */}
          <p className="text-[10px] text-gray-500 mt-2">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
