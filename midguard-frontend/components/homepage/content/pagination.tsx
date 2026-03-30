export function Pagination({ page, setPage, totalPages }: any) {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      
      <button
        className="px-3 py-1 border"
        onClick={() => setPage((p: number) => Math.max(1, p - 1))}
      >
        &lt;
      </button>

      <div className="text-sm flex gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-2 ${
              page === i + 1 ? "font-bold underline" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        className="px-3 py-1 border"
        onClick={() =>
          setPage((p: number) => Math.min(totalPages, p + 1))
        }
      >
        &gt;
      </button>
    </div>
  );
}
