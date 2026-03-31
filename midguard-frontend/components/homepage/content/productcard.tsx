export function ProductCard({ product }: any) {
  if (!product) {
    return (
      <div className="p-4 rounded-xl border-2 border-dashed border-[color:var(--foreground)/0.15] bg-[color:var(--foreground)/0.03] flex flex-col items-center justify-center text-center transition hover:border-cyan-400">
        <div className="h-32 w-full flex items-center justify-center text-xs mb-3 text-[color:var(--foreground)/0.5]">
          Your Product Here
        </div>
        <p className="text-xs text-[color:var(--foreground)/0.5]">
          Start selling on MidGuard
        </p>
      </div>
    );
  }

  const image =
    product?.assets?.find((a: any) => a.is_primary)?.file_url ||
    product?.assets?.[0]?.file_url;

  const price = product.price || product.base_price;
  const original = product.original_price || price * 1.1; // fake strike price
  const discount = Math.round(((original - price) / original) * 100);

  return (
    <div
      className="
        group p-3 rounded-2xl
        bg-[#0b0f14]
        border border-cyan-500/30
        shadow-lg shadow-cyan-500/10

        hover:shadow-cyan-500/30
        hover:border-cyan-400
        transition-all duration-300
      "
    >
      {/* IMAGE */}
      <div className="relative rounded-xl overflow-hidden bg-white">
        {image ? (
          <img
            src={image}
            alt="product"
            className="w-full h-40 object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="h-40 flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}

        {/* DISCOUNT BADGE */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-green-500/90 text-black text-xs font-semibold px-2 py-1 rounded-md">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="mt-3 space-y-2">
        {/* TITLE */}
        <h4 className="text-sm font-semibold text-white line-clamp-1">
          {product.title || product.name}
        </h4>

        {/* PRICE */}
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold text-base">
            ₹{price}
          </span>
          <span className="text-xs line-through text-gray-500">
            ₹{original}
          </span>
        </div>

        {/* TAG */}
        <span className="text-[10px] px-2 py-1 rounded bg-white/10 text-gray-300 inline-block">
          {product.visibility || "PUBLIC"}
        </span>

        {/* CTA */}
        <button
          className="
            mt-2 w-full py-2 rounded-lg text-sm font-semibold

            bg-cyan-500 text-black
            hover:bg-cyan-400

            transition
          "
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
