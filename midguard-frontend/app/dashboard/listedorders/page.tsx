"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import OrderCard from "@/components/myorder/ordercard";
import { adaptOrder } from "@/lib/adapters/orderadapter";

export default function ListedOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔒 AUTH GUARD + LOAD
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    loadOrders();
  }, [router]);

  const loadOrders = async () => {
    try {
      const res = await api.getSellerOrders();

      if (!res.success) {
        throw new Error(res.message || "Failed to load orders");
      }

      const adapted = (res.orders || []).map((o: any) =>
        adaptOrder(o, "seller")
      );

      setOrders(adapted);
    } catch (err) {
      console.error("❌ Failed to load listed orders", err);

      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="
        p-4 sm:p-6 min-h-screen flex items-center justify-center
        text-sm text-[color:var(--foreground)/0.6]
        bg-[color:var(--background)]
      ">
        Loading listed orders...
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
          📦
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
          Orders from your listings will appear here once buyers place them.
          Start by creating your first listing.
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push("/dashboard/create-room")}
          className="
            mt-6 px-5 py-2 rounded-lg
            bg-cyan-500/90 hover:bg-cyan-500
            text-white font-medium
            transition-all duration-200
            hover:scale-[1.03] active:scale-[0.97]
          "
        >
          Create Listing
        </button>

        {/* SECONDARY */}
        <button
          onClick={() => router.push("/dashboard/rooms")}
          className="
            mt-3 text-sm
            text-[color:var(--foreground)/0.6]
            hover:text-[color:var(--foreground)]
            transition
          "
        >
          Browse Marketplace →
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
