export function adaptRoom(room: any, assets: any[] = []) {
  return {
    id: room.room_uid,

    // 🔥 CORE
    type: room.room_type,
    status: room.listing_status,
    endTime: room.end_time || null,

    // 🔥 NEW (IMPORTANT)
    isAuction: room.room_type === "auction",
    isPrivate: room.room_type === "private",
    duration: room.auction_duration_hours || null,

    product: {
      name: room.product_name,
      sellerId: room.seller_public_id,
      price: Number(room.base_price),
      description: room.description,

      usedDuration: room.used_duration,
      warranty: room.warranty_remaining,

      originalBox: room.original_box_available,
      invoiceAvailable: room.invoice_available,
    },

    // ✅ FIXED: inject images from assets
    images: assets
      .filter((a) => a.is_active !== false)
      .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
      .map((a) => a.file_url),
  };
}
