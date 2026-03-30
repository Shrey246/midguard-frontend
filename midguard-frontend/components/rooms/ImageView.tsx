"use client";

import { useState } from "react";

type Props = {
  images: string[];
};

export default function ImageView({ images }: Props) {
  const [selected, setSelected] = useState(0);

  const hasImages = images && images.length > 0;

  return (
    <div className="
      bg-[color:var(--foreground)/0.05]
      border border-[color:var(--foreground)/0.12]
      backdrop-blur-xl
      p-3 sm:p-4
      rounded-2xl
      shadow-sm
      transition-all duration-300
    ">

      {/* MAIN IMAGE */}
      <div className="
        w-full
        h-[220px] sm:h-[280px] md:h-[320px]
        rounded-xl overflow-hidden
        bg-[color:var(--foreground)/0.08]
        flex items-center justify-center
      ">
        {hasImages ? (
          <img
            src={images[selected]}
            alt="product"
            className="
              w-full h-full object-cover
              transition-transform duration-300
              hover:scale-[1.02]
            "
          />
        ) : (
          <span className="
            text-[color:var(--foreground)/0.5]
            text-sm
          ">
            No Image Available
          </span>
        )}
      </div>

      {/* THUMBNAILS */}
      {hasImages && images.length > 1 && (
        <div className="
          flex gap-2 sm:gap-3 mt-4
          overflow-x-auto
          pb-1
        ">

          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => setSelected(index)}
              className={`
                relative
                w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                flex-shrink-0
                rounded-lg overflow-hidden cursor-pointer
                border-2 transition-all duration-200
                ${
                  selected === index
                    ? "border-orange-500 scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                }
              `}
            >
              <img
                src={img}
                className="w-full h-full object-cover"
              />

              {/* subtle overlay for non-selected */}
              {selected !== index && (
                <div className="absolute inset-0 bg-black/10" />
              )}
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
