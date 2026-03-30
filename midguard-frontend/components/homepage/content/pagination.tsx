export function Pagination({ page, setPage, totalPages }: any) {
  return (
    <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">

      {/* PREV */}
      <button
        onClick={() => setPage((p: number) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="
          px-3 py-1.5 rounded-lg
          border border-[color:var(--foreground)/0.15]
          bg-[color:var(--foreground)/0.05]
          text-[var(--foreground)]
          
          hover:border-cyan-400 hover:text-cyan-400
          disabled:opacity-40 disabled:cursor-not-allowed
          
          transition
        "
      >
        &lt;
      </button>

      {/* PAGE NUMBERS */}
      <div className="flex gap-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const isActive = page === i + 1;

          return (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`
                px-3 py-1.5 rounded-lg text-sm
                transition

                ${
                  isActive
                    ? "bg-cyan-500 text-black font-semibold shadow"
                    : `
                      border border-[color:var(--foreground)/0.15]
                      bg-[color:var(--foreground)/0.05]
                      text-[var(--foreground)]
                      hover:border-cyan-400 hover:text-cyan-400
                    `
                }
              `}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* NEXT */}
      <button
        onClick={() =>
          setPage((p: number) => Math.min(totalPages, p + 1))
        }
        disabled={page === totalPages}
        className="
          px-3 py-1.5 rounded-lg
          border border-[color:var(--foreground)/0.15]
          bg-[color:var(--foreground)/0.05]
          text-[var(--foreground)]

          hover:border-cyan-400 hover:text-cyan-400
          disabled:opacity-40 disabled:cursor-not-allowed

          transition
        "
      >
        &gt;
      </button>
    </div>
  );
}
