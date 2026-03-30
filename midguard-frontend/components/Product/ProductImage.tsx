"use client";

import { useState } from "react";

type Props = {
  src?: string;
};

export default function ProductImage({ src }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="
        relative w-full aspect-square
        rounded-xl overflow-hidden
        bg-gradient-to-br from-white/10 to-white/5
        border border-white/10
        group
      "
    >
      {/* IMAGE */}
      {src ? (
        <>
          {/* skeleton */}
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-white/10" />
          )}

          <img
            src={src}
            alt="product"
            onLoad={() => setLoaded(true)}
            className={`
              w-full h-full object-cover
              transition duration-300
              ${loaded ? "opacity-100" : "opacity-0"}
              group-hover:scale-105
            `}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 text-xs gap-1">
          <span className="text-lg">📦</span>
          No Image
        </div>
      )}

      {/* overlay on hover */}
      {src && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
      )}
    </div>
  );
}
