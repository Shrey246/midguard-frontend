"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import OrderCard from "@/components/myorder/ordercard";
import { adaptOrder } from "@/lib/adapters/orderadapter";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadOrders = async () => {
    try {
      const res = await api.getMyOrders();

      if (!res.success) {
        throw new Error(res.message || "Failed to load orders");
      }

      const adapted = (res.orders || []).map(adaptOrder);
      setOrders(adapted);
    } catch (err) {
      console.error("❌ Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="
        p-6 min-h-screen flex items-center justify-center
        bg-[color:var(--background)]
        text-[color:var(--foreground)/0.6]
      ">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[color:var(--foreground)/0.3] border-t-[color:var(--foreground)] rounded-full animate-spin" />
          <p className="text-sm">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // ================= EMPTY =================
  if (orders.length === 0) {
    return (
      <div className="
        p-6 min-h-screen flex flex-col items-center justify-center text-center
        bg-[color:var(--background)]
        text-[color:var(--foreground)]
      ">

        {/* ICON */}
        <div className="text-5xl mb-4 animate-bounce">
          🧾
        </div>

        {/* TITLE */}
        <h2 className="text-lg sm:text-xl font-semibold">
          No Orders Yet
        </h2>

        {/* SUBTEXT */}
        <p className="
          text-sm mt-2 max-w-sm
          text-[color:var(--foreground)/0.6]
        ">
          Once you buy or win an auction, your orders will appear here.
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push("/dashboard/rooms")}
          className="
            mt-6 px-5 py-2 rounded-lg
            bg-cyan-500/90 hover:bg-cyan-500
            text-white font-medium
            transition-all duration-200
            hover:scale-[1.03] active:scale-[0.97]
          "
        >
          Explore Marketplace
        </button>
      </div>
    );
  }

  // ================= MAIN =================
  return (
    <div className="
      p-4 sm:p-6 min-h-screen
      bg-[color:var(--background)]
      transition-all duration-300
    ">
      <div className="
        grid gap-4
        sm:grid-cols-2
        lg:grid-cols-3
      ">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
