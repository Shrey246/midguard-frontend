export function ProductCard({ product }: any) {
  // EMPTY CARD (AD SLOT)
  if (!product) {
    return (
      <div className="p-4 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl flex flex-col items-center justify-center text-center">
        <div className="h-32 w-full flex items-center justify-center text-gray-400 text-xs mb-3">
          Your Product Here
        </div>
        <p className="text-xs text-gray-400">
          Start selling on MidGuard
        </p>
      </div>
    );
  }

  // REAL PRODUCT
  return (
    <div className="p-4 border border-gray-300 dark:border-white/10 rounded-xl bg-gray-100 dark:bg-white/5">
      <div className="h-32 bg-gray-200 dark:bg-black/40 rounded-md mb-3 flex items-center justify-center text-xs text-gray-400">
        Image
      </div>

      <h4 className="text-sm font-semibold">
        {product.title || product.name}
      </h4>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        ₹{product.price || product.base_price}
      </p>

      <button className="mt-2 px-3 py-1 text-sm border rounded-lg">
        Buy Now
      </button>
    </div>
  );
}
