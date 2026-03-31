"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ProductCard } from "./productcard";
import { Pagination } from "./pagination";

const ITEMS_PER_PAGE = 4;
const TOTAL_PAGES = 5;

export function ProductsGrid() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // ✅ prevent state update after unmount

    const fetchData = async () => {
      try {
        setLoading(true);

        const roomsData = await api.getRooms();

        const roomsWithAssets = await Promise.all(
          roomsData.map(async (room: any) => {
            try {
              const res = await api.getRoomAssets(room.room_uid);

              return {
                ...room,
                assets: res.assets || [],
              };
            } catch (err) {
              console.error("Asset fetch failed:", room.room_uid);
              return { ...room, assets: [] };
            }
          })
        );

        if (isMounted) {
          setRooms(roomsWithAssets);
        }
      } catch (err) {
        console.error("❌ Failed to fetch rooms:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // cleanup
    };
  }, []);

  // Pagination
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = rooms.slice(start, start + ITEMS_PER_PAGE);

  const filledProducts = [...paginated];
  while (filledProducts.length < ITEMS_PER_PAGE) {
    filledProducts.push(null);
  }

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Best Selling Products of the Week
        </h2>
      </div>

      {/* 🔄 Loading state */}
      {loading ? (
        <p className="text-sm text-[color:var(--foreground)/0.6]">
          Loading products...
        </p>
      ) : (
        <div
          className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {filledProducts.map((p, index) => (
            <ProductCard key={index} product={p} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={TOTAL_PAGES}
      />
    </section>
  );
}
