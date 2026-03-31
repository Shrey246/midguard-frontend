export function ProductCard({ product }: any) {
  // EMPTY CARD (AD SLOT)
  if (!product) {
    return (
      <div
        className="
          p-4 rounded-xl
          border-2 border-dashed
          border-[color:var(--foreground)/0.15]
          bg-[color:var(--foreground)/0.03]

          flex flex-col items-center justify-center text-center
          transition hover:border-cyan-400
        "
      >
        <div
          className="
            h-32 w-full flex items-center justify-center
            text-xs mb-3
            text-[color:var(--foreground)/0.5]
          "
        >
          Your Product Here
        </div>

        <p className="text-xs text-[color:var(--foreground)/0.5]">
          Start selling on MidGuard
        </p>
      </div>
    );
  }

  // ✅ MOVE THIS OUTSIDE JSX
  const image =
    product?.assets?.find((a: any) => a.is_primary)?.file_url ||
    product?.assets?.[0]?.file_url;

  // REAL PRODUCT
  return (
    <div
      className="
        p-4 rounded-xl
        border border-[color:var(--foreground)/0.12]
        bg-[color:var(--foreground)/0.04]

        hover:border-cyan-400
        hover:shadow-md
        transition
      "
    >
      {/* IMAGE */}
      <div
        className="
          h-32 rounded-md mb-3 overflow-hidden
          bg-[color:var(--foreground)/0.08]
        "
      >
        {image ? (
          <img
            src={image}
            alt="product"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-[color:var(--foreground)/0.5]">
            No Image
          </div>
        )}
      </div>

      {/* TITLE */}
      <h4 className="text-sm font-semibold text-[var(--foreground)] line-clamp-1">
        {product.title || product.name}
      </h4>

      {/* PRICE */}
      <p className="text-sm mt-1 text-[color:var(--foreground)/0.7]">
        ₹{product.price || product.base_price}
      </p>

      {/* CTA */}
      <button
        className="
          mt-3 w-full py-1.5 rounded-lg text-sm font-medium

          border border-[color:var(--foreground)/0.15]
          bg-[color:var(--foreground)/0.05]
          text-[var(--foreground)]

          hover:bg-cyan-500 hover:text-black hover:border-cyan-500
          transition
        "
      >
        Buy Now
      </button>
    </div>
  );
}
