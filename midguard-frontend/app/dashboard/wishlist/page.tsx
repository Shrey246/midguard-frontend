"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

type WishlistItem = {
  room_uid: string;
  product_name: string;
  base_price: string;
  listing_status: string;
  room_type: "auction" | "public" | "private" | "digital";
  added_at: string;
};

const SECTION_TYPES: { key: WishlistItem["room_type"]; label: string }[] = [
  { key: "auction", label: "Auction Rooms" },
  { key: "public", label: "Public Rooms" },
  { key: "private", label: "Private Rooms" },
  { key: "digital", label: "Digital Rooms" },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    auction: true,
    public: true,
    private: true,
    digital: true,
  });

  const router = useRouter();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await api.getWishlist();
      setWishlist(data || []);
    } catch (err) {
      console.error("❌ Failed to fetch wishlist:", err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleRemove = async (roomUid: string) => {
    try {
      await api.toggleWishlist(roomUid);
      setWishlist((prev) =>
        prev.filter((item) => item.room_uid !== roomUid)
      );
    } catch (err) {
      console.error("❌ Failed to remove wishlist item:", err);
    }
  };

  const grouped: Record<string, WishlistItem[]> = SECTION_TYPES.reduce(
    (acc, type) => {
      acc[type.key] = wishlist.filter(
        (item) => item.room_type === type.key
      );
      return acc;
    },
    {} as Record<string, WishlistItem[]>
  );

  if (loading) {
    return (
      <div className="p-6 text-[color:var(--foreground)/0.7]">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="
      min-h-screen w-full
      px-3 sm:px-4 md:px-6
      py-4 sm:py-6
      bg-[color:var(--background)]
      text-[color:var(--foreground)]
    ">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-6">
        My Wishlist
      </h1>

      {SECTION_TYPES.map((section) => {
        const items = grouped[section.key] || [];

        return (
          <div
            key={section.key}
            className="
              border border-[color:var(--foreground)/0.12]
              rounded-2xl
              bg-[color:var(--foreground)/0.04]
              overflow-hidden
            "
          >
            {/* HEADER */}
            <div
              onClick={() => toggleSection(section.key)}
              className="
                cursor-pointer flex justify-between items-center
                p-4
                bg-[color:var(--foreground)/0.06]
                hover:bg-[color:var(--foreground)/0.08]
                transition
              "
            >
              <h2 className="text-base sm:text-lg font-semibold">
                {section.label}
              </h2>
              <span className="text-[color:var(--foreground)/0.6]">
                {openSections[section.key] ? "▲" : "▼"}
              </span>
            </div>

            {/* CONTENT */}
            {openSections[section.key] && (
              <div className="
                p-4
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                gap-4
              ">
                {items.length === 0 ? (
                  <p className="text-[color:var(--foreground)/0.5]">
                    No items
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.room_uid}
                      onClick={() =>
                        router.push(`/dashboard/rooms/${item.room_uid}`)
                      }
                      className="
                        border border-[color:var(--foreground)/0.12]
                        rounded-xl
                        p-4
                        bg-[color:var(--foreground)/0.03]
                        hover:bg-[color:var(--foreground)/0.06]
                        hover:shadow-md
                        transition-all duration-200
                        cursor-pointer
                        group
                      "
                    >
                      {/* NAME (FIXED BUG HERE) */}
                      <h3 className="
                        font-semibold text-base sm:text-lg
                        text-[color:var(--foreground)]
                        group-hover:text-purple-400
                        transition
                      ">
                        {item.product_name}
                      </h3>

                      <p className="
                        text-sm
                        text-[color:var(--foreground)/0.6]
                        mt-1
                      ">
                        ₹{Number(item.base_price).toLocaleString()}
                      </p>

                      <p className="
                        text-xs mt-2
                        text-[color:var(--foreground)/0.7]
                      ">
                        Status: {item.listing_status}
                      </p>

                      <p className="
                        text-xs mt-1
                        text-[color:var(--foreground)/0.5]
                      ">
                        Added:{" "}
                        {item.added_at
                          ? new Date(item.added_at).toLocaleString()
                          : "N/A"}
                      </p>

                      {/* REMOVE BUTTON */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 🔥 prevent navigation
                          handleRemove(item.room_uid);
                        }}
                        className="
                          mt-3 text-red-500 text-sm
                          hover:underline
                        "
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
