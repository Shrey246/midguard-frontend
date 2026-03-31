"use client";

import ImageView from "@/components/rooms/ImageView";
import ProductView from "@/components/rooms/ProductView";
import BidPanel from "@/components/rooms/BidPanel";
import FloatingActionPanel from "@/components/rooms/FloatingActionPanel";

import { api } from "@/lib/api";
import { adaptRoom } from "@/lib/adapters/roomadapater";
import { adaptBid } from "@/lib/adapters/bidsadapter";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();

  const roomId = params.id as string;

  const [room, setRoom] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [addressUid, setAddressUid] = useState<string>("");
  const [loadingAction, setLoadingAction] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const isAuction = (room?.type || "").toLowerCase() === "auction";
  const isActive = room?.status === "active";
  const isLocked = room?.status === "locked";
  const isEnded =
    room?.endTime && new Date() > new Date(room.endTime);

  // =========================
  // FETCH ROOM
  // =========================
  useEffect(() => {
    if (!roomId) return;

    const fetchRoom = async () => {
      try {
        const res = await api.getRoom(roomId);
        const raw = res.data || res;
        setRoom(adaptRoom(raw));
      } catch (err) {
        console.error("❌ Failed to load room", err);
      }
    };

    fetchRoom();
  }, [roomId]);

  // =========================
  // AUTH GUARD
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  // =========================
  // POLL BIDS
  // =========================
  useEffect(() => {
    if (!room?.id || !isAuction) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.getBids(room.id);

        const raw =
          res.data?.bids ||
          res.data ||
          [];

        const adapted = (Array.isArray(raw) ? raw : [])
          .map(adaptBid)
          .filter(Boolean);

        setBids(adapted);
      } catch (err) {
        console.error("Polling failed", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [room?.id, isAuction]);

  // =========================
  // FETCH IMAGES (FIXED ✅)
  // =========================
  useEffect(() => {
    if (!room?.id) return;

    const fetchImages = async () => {
      try {
        const res = await api.getRoomAssets(room.id);

        const assets =
          res.assets ||
          res.data?.assets ||
          [];

        const urls = assets
          .filter((a: any) => a && a.is_active !== false)
          .sort((a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
          .map((a: any) => a.file_url)
          .filter(Boolean);

        setImages(urls);

      } catch (err) {
        console.error("❌ Failed to load images", err);
      }
    };

    fetchImages();
  }, [room?.id]);

  // =========================
  // FETCH ADDRESS
  // =========================
  useEffect(() => {
    const loadAddress = async () => {
      try {
        const res = await api.getAddresses();

        const list =
          res.addresses ||
          res.data?.addresses ||
          [];

        if (!Array.isArray(list) || list.length === 0) return;

        const defaultAddr =
          list.find((a: any) => a.is_default) || list[0];

        setAddressUid(defaultAddr.address_uid);
      } catch (err) {
        console.error("❌ Failed to load address", err);
      }
    };

    loadAddress();
  }, []);

  // =========================
  // FETCH WISHLIST
  // =========================
  useEffect(() => {
    if (!room?.id) return;

    const checkWishlist = async () => {
      try {
        const res = await api.isWishlisted(room.id);
        setWishlisted(res);
      } catch (err) {
        console.error("❌ Failed to check wishlist", err);
      }
    };

    checkWishlist();
  }, [room?.id]);

  // =========================
  // ACTIONS (UNCHANGED)
  // =========================
  const handleBid = async (amount: number) => {
    if (!isActive) return alert("Auction not active");
    if (isEnded) return alert("Auction already ended");

    try {
      const res = await api.placeBid(room.id, amount);
      const raw = res.data?.bid || res.data;
      const newBid = adaptBid(raw);

      if (!newBid) return;
      setBids((prev) => [newBid, ...prev]);
    } catch (err: any) {
      console.error("❌ Bid failed", err);
      alert(err?.message || "Bid failed");
    }
  };

  const handleBuy = async () => {
    try {
      if (!addressUid) {
        alert("Please add an address first");
        router.push("/dashboard/address");
        return;
      }

      setLoadingAction(true);

      const res = await api.createBuyOrder(
        room.id,
        addressUid,
        room.product.price,
        room.product.sellerId
      );

      if (res.success) {
        router.push(`dashboard/escrow/${res.data.session_id}`);
      } else {
        alert(res.error || "Order failed");
      }
    } catch (err: any) {
      console.error("❌ BUY ERROR:", err);
      alert("Something went wrong");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleLockDeal = async () => {
    try {
      if (!addressUid) {
        alert("Please add an address first");
        router.push("/dashboard/address");
        return;
      }

      setLoadingAction(true);

      const res = await api.createBuyOrder(
        room.id,
        addressUid,
        room.product.price,
        room.product.sellerId
      );

      if (res.success) {
        router.push(`dashboard/escrow/${res.data.session_id}`);
      }
    } catch (err: any) {
      console.error("❌ Lock deal failed", err);
      alert(err?.error || "Failed to lock deal");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleWishlist = async () => {
    try {
      const res = await api.toggleWishlist(room.id);
      setWishlisted(res.added);
    } catch (err) {
      console.error("❌ Wishlist toggle failed", err);
    }
  };

  const actionMap: any = {
    public: [
      {
        label: wishlisted ? "❤️ Wishlisted" : "🤍 Wishlist",
        onClick: handleWishlist,
      },
      {
        label: loadingAction ? "Processing..." : "Buy Now",
        onClick: handleBuy,
        variant: "primary",
      },
    ],
    private: [
      {
        label: loadingAction ? "Processing..." : "Lock-in Deal",
        onClick: handleLockDeal,
        variant: "primary",
      },
    ],
    digital: [
      {
        label: loadingAction ? "Processing..." : "Buy Now",
        onClick: handleBuy,
        variant: "primary",
      },
    ],
  };

  const actions = actionMap[room?.type] || [];

  if (!room) {
    return (
      <div className="
        p-6 min-h-screen flex items-center justify-center
        bg-[color:var(--background)]
        text-[color:var(--foreground)/0.6]
      ">
        Loading room...
      </div>
    );
  }

  return (
    <>
      {!isActive && isAuction && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="
            bg-[color:var(--background)]
            text-[color:var(--foreground)]
            p-4 sm:p-6 rounded-xl text-center
            max-w-sm w-full border border-[color:var(--foreground)/0.1]
          ">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Auction Not Active
            </h2>
            <p className="text-sm text-[color:var(--foreground)/0.6]">
              This auction is not active yet or has ended.
            </p>
          </div>
        </div>
      )}

      <div className="
        p-4 sm:p-6 space-y-6
        bg-[color:var(--background)]
        text-[color:var(--foreground)]
        min-h-screen
        transition-all
      ">

        <div className="
          grid grid-cols-1
          lg:grid-cols-2
          gap-4 sm:gap-6
        ">

          <div className="space-y-6">
            <ImageView images={images} />
            <ProductView product={room.product} />
          </div>

          <div className="space-y-6">
            {isAuction && (
              <>
                {isLocked && (
                  <div className="text-green-500 font-semibold text-sm sm:text-base">
                    Auction closed. Waiting for winner confirmation.
                  </div>
                )}

                {isEnded && !isLocked && (
                  <div className="text-red-500 font-semibold text-sm sm:text-base">
                    Auction ended. Processing results...
                  </div>
                )}

                {isActive && !isEnded && (
                  <BidPanel
                    bids={bids}
                    currentUser="you"
                    endTime={room.endTime || ""}
                    onPlaceBid={handleBid}
                    isEnded={isEnded}
                  />
                )}
              </>
            )}
          </div>

        </div>

        {(room.type || "").toLowerCase() !== "auction" && (
          <FloatingActionPanel roomType={room.type} actions={actions} />
        )}
      </div>
    </>
  );
}
