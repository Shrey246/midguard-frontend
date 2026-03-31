"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import MessagePanel from "@/components/rooms/MessagePanel";
import { adaptMessage } from "@/lib/adapters/messageadapter";
import ImageView from "@/components/rooms/ImageView";

// ================= DELIVERY STEPS =================
const DELIVERY_STEPS = [
  "funds_received",
  "in_transit",
  "delivered",
  "released",
];

export default function EscrowPage() {
  const params = useParams();
  const router = useRouter();
  const routeSessionId = params.sessionId as string;

  const [escrow, setEscrow] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const sessionUid = escrow?.session_id;

  // ================= 🔒 AUTH =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  // ================= FETCH ESCROW =================
  const fetchEscrow = async () => {
    try {
      if (!routeSessionId) return;

      const res = await api.getEscrow(routeSessionId);

      if (!res || !res.escrow) {
        console.error("❌ Invalid escrow response:", res);
        return;
      }

      setEscrow(res.escrow);
      setOrder(res.order);

    } catch (err) {
      console.error("❌ Escrow fetch error:", err);
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  // ================= FETCH MESSAGES =================
  const fetchMessages = async (sessionId: string) => {
    try {
      if (!sessionId) return;

      const raw = await api.getMessages(sessionId);

      const adapted = raw
        .map((m: any) => adaptMessage(m))
        .filter(Boolean);

      setMessages(adapted);

    } catch (err) {
      console.error("❌ Failed to load messages:", err);
    }
  };

  // ================= FETCH IMAGES (FIXED ✅)
  useEffect(() => {
    if (!order?.room_uid) return;

    const fetchImages = async () => {
      try {
        const res = await api.getRoomAssets(order.room_uid);

        const assets =
          res?.assets ||
          res?.data?.assets ||
          [];

        const urls = assets
          .filter((a: any) => a && a.is_active !== false)
          .sort((a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
          .map((a: any) => a.file_url)
          .filter(Boolean);

        setImages(urls);

      } catch (err) {
        console.error("❌ Failed to load images:", err);
      }
    };

    fetchImages();
  }, [order?.room_uid]);

  // ================= SEND =================
  const sendMessage = async (msg: string, file?: File) => {
    try {
      if (file) return;

      if (!sessionUid) return;

      const rawMessage = await api.sendMessage(sessionUid, msg);
      const newMsg = adaptMessage(rawMessage);

      if (!newMsg) return;

      setMessages((prev) => [...prev, newMsg]);

    } catch (err) {
      console.error("❌ Send failed:", err);
    }
  };

  // ================= ACTIONS =================
  const markShipped = async () => {
    try {
      if (!sessionUid) return;

      await api.shipOrder(sessionUid, {
        courierName: "Delhivery",
        trackingLink: "https://tracking.link",
      });

      fetchEscrow();
    } catch (err) {
      console.error("❌ Ship failed:", err);
    }
  };

  const confirmDelivery = async () => {
    try {
      if (!sessionUid) return;

      await api.confirmDelivery(sessionUid);
      fetchEscrow();
    } catch (err) {
      console.error("❌ Confirm delivery failed:", err);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    if (!routeSessionId) return;

    setMessages([]);
    setEscrow(null);
    setOrder(null);

    fetchEscrow();
  }, [routeSessionId]);

  useEffect(() => {
    if (!sessionUid) return;
    fetchMessages(sessionUid);
  }, [sessionUid]);

  // ================= DELIVERY =================
  const getStepIndex = (status: string) => {
    return DELIVERY_STEPS.indexOf(status);
  };

  const currentStep = escrow
    ? getStepIndex(escrow.escrow_status)
    : 0;

  const formatStep = (step: string) => {
    switch (step) {
      case "funds_received": return "Payment Secured";
      case "in_transit": return "Shipped";
      case "delivered": return "Delivered";
      case "released": return "Payment Released";
      default: return step;
    }
  };

  return (
    <div className="
      p-4 sm:p-6 space-y-6 min-h-screen
      bg-[color:var(--background)]
      text-[color:var(--foreground)]
      transition-all
    ">

      {/* HEADER */}
      <div className="
        text-lg sm:text-xl font-semibold
        border-b pb-3
        border-[color:var(--foreground)/0.1]
      ">
        Escrow Session
      </div>

      {/* GRID */}
      <div className="
        grid grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-4 sm:gap-6
      ">

        {/* IMAGES */}
        <ImageView images={images} />

        {/* DETAILS */}
        <div className="
          border border-[color:var(--foreground)/0.1]
          p-4 space-y-2
          max-h-[300px] overflow-y-auto
          bg-[color:var(--foreground)/0.03]
          rounded-xl
        ">

          <div><b>Amount:</b> ₹{order?.final_amount}</div>
          <div><b>Platform Fee:</b> ₹{order?.platform_fee}</div>
          <div><b>Seller Gets:</b> ₹{order?.seller_net_amount}</div>

          <div><b>Buyer:</b> {escrow?.buyer_public_id}</div>
          <div><b>Seller:</b> {escrow?.seller_public_id}</div>

          <div><b>Payment:</b> {order?.payment_status}</div>
          <div><b>Shipping:</b> {order?.shipping_status}</div>

          <div><b>Courier:</b> {order?.courier_name || "N/A"}</div>

          {order?.tracking_link ? (
            <button
              onClick={() => window.open(order.tracking_link, "_blank")}
              className="
                text-xs px-3 py-1 rounded-lg mt-1
                bg-blue-500/20 text-blue-400
                hover:bg-blue-500/30 transition
              "
            >
              Track Package
            </button>
          ) : (
            <div><b>Tracking:</b> N/A</div>
          )}

          <div><b>Escrow Status:</b> {escrow?.escrow_status}</div>
        </div>

        {/* DELIVERY */}
        <div className="
          border border-[color:var(--foreground)/0.1]
          p-4 flex flex-col justify-between
          bg-[color:var(--foreground)/0.03]
          rounded-xl
        ">
          <div>
            <div className="font-semibold mb-4">Delivery Progress</div>

            {DELIVERY_STEPS.map((step, index) => {
              const isCompleted = index <= currentStep;

              return (
                <div key={step} className="flex items-center mb-3">
                  <div
                    className={`
                      w-4 h-4 rounded-full mr-3
                      ${isCompleted
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-700"}
                    `}
                  />
                  <div className={isCompleted ? "" : "opacity-50"}>
                    {formatStep(step)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="
            mt-4 space-y-2 border-t pt-3
            border-[color:var(--foreground)/0.1]
          ">
            {order?.shipping_status === "not_shipped" && (
              <button
                onClick={markShipped}
                className="
                  w-full py-2 rounded-lg text-sm
                  bg-blue-500/90 hover:bg-blue-500
                  text-white transition
                "
              >
                Mark as Shipped
              </button>
            )}

            {escrow?.escrow_status === "in_transit" && (
              <button
                onClick={confirmDelivery}
                className="
                  w-full py-2 rounded-lg text-sm
                  bg-green-500/90 hover:bg-green-500
                  text-white transition
                "
              >
                Confirm Delivery
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CHAT */}
      {sessionUid && (
        <MessagePanel
          sessionId={sessionUid}
          messages={messages}
          currentUser="you"
          onSend={sendMessage}
        />
      )}
    </div>
  );
}
