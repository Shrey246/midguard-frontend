"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { adaptRoom } from "@/lib/adapters/roomadapater";
import ProductCard from "@/components/Product/Productcard";

export default function RoomsByTypePage() {
  const params = useParams();
  const type = params?.type as string;

  const BASE_URL = "https://midguard-backend-production.up.railway.app/";

  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!type) return;

    const fetchRooms = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}rooms?type=${type}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        const data = await res.json();

        const adapted = (data.data || []).map(adaptRoom);
        setRooms(adapted);

      } catch (err) {
        console.error("❌ Failed to fetch rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [type]);

  return (
    <div className="
      p-4 sm:p-6 min-h-screen
      bg-[color:var(--background)]
      text-[color:var(--foreground)]
      transition-all duration-300
    ">

      {/* HEADER */}
      <h1 className="
        text-xl sm:text-2xl font-bold capitalize mb-6
      ">
        {type} Rooms
      </h1>

      {/* LOADING */}
      {loading && (
        <div className="
          flex items-center justify-center py-20
          text-[color:var(--foreground)/0.6]
        ">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-[color:var(--foreground)/0.3] border-t-[color:var(--foreground)] rounded-full animate-spin" />
            <p className="text-sm">Loading rooms...</p>
          </div>
        </div>
      )}

      {/* EMPTY */}
      {!loading && rooms.length === 0 && (
        <div className="
          flex flex-col items-center justify-center text-center py-20
        ">
          <div className="text-5xl mb-4">🛒</div>

          <h2 className="text-lg font-semibold">
            No {type} rooms found
          </h2>

          <p className="
            text-sm mt-2 max-w-sm
            text-[color:var(--foreground)/0.6]
          ">
            Be the first to create a {type} room and start trading.
          </p>

          <button
            onClick={() => window.location.href = "/dashboard/createroom"}
            className="
              mt-6 px-5 py-2 rounded-lg
              bg-cyan-500/90 hover:bg-cyan-500
              text-white font-medium
              transition-all duration-200
              hover:scale-[1.03] active:scale-[0.97]
            "
          >
            Create Room
          </button>
        </div>
      )}

      {/* GRID */}
      {!loading && rooms.length > 0 && (
        <div className="
          grid gap-4 sm:gap-5
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          xl:grid-cols-5
        ">
          {rooms.map((room) => (
            <ProductCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
