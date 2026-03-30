"use client";

import { useEffect, useState } from "react";
import ProductImage from "./ProductImage";
import ActionButton from "./ActionButton";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const BASE_URL = "https://midguard-backend-production.up.railway.app/";

export default function ProductCard({ room }: any) {
  const router = useRouter();

  const [image, setImage] = useState<string | undefined>();

  const [markup] = useState(() => {
    return Math.floor(Math.random() * 30) + 10;
  });

  const price = Math.floor(room.product.price);
  const mrp = Math.floor(price * (1 + markup / 100));
  const discountPercent = Math.floor(((mrp - price) / mrp) * 100);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await api.getRoomAssets(room.id);

        if (res?.success && Array.isArray(res.assets) && res.assets.length > 0) {
          const first = res.assets[0];

          const raw =
            first?.url ||
            first?.file_url ||
            first?.path ||
            first?.asset_url;

          if (raw) {
            const img = raw.startsWith("http")
              ? raw
              : `${BASE_URL}${raw}`;

            setImage(img);
          }
        }
      } catch (err) {
        console.error("Image fetch failed:", err);
      }
    };

    fetchImage();
  }, [room.id]);

  return (
    <div
      onClick={() => router.push(`/dashboard/rooms/${room.id}`)}
      className="
        group relative rounded-2xl p-3
        bg-gradient-to-br from-white/5 to-white/0
        border border-white/10
        hover:border-cyan-400
        hover:shadow-lg hover:shadow-cyan-500/10
        transition-all duration-300 cursor-pointer
      "
    >
      {/* DISCOUNT BADGE */}
      <div className="
        absolute top-2 left-2 z-10
        px-2 py-1 text-[10px] font-semibold
        bg-green-500/20 text-green-400
        border border-green-500/30
        rounded-md
      ">
        {discountPercent}% OFF
      </div>

      {/* IMAGE */}
      <ProductImage src={image} />

      {/* CONTENT */}
      <div className="mt-3 px-1">
        
        {/* NAME */}
        <h2 className="
          text-sm font-medium text-white
          line-clamp-2 min-h-[40px]
        ">
          {room.product.name}
        </h2>

        {/* PRICE BLOCK */}
        <div className="flex items-center gap-2 mt-2">
          
          {/* PRICE */}
          <span className="text-lg font-bold text-cyan-400">
            ₹{price}
          </span>

          {/* MRP */}
          <span className="text-xs text-gray-400 line-through">
            ₹{mrp}
          </span>
        </div>

        {/* TYPE TAG */}
        <div className="mt-2">
          <span className="
            text-[10px] px-2 py-1 rounded-md
            bg-white/10 text-gray-300
          ">
            {room.type.toUpperCase()}
          </span>
        </div>

        {/* ACTION */}
        <ActionButton
          type={room.type}
          onClick={() => router.push(`/dashboard/rooms/${room.id}`)}
        />
      </div>
    </div>
  );
}
