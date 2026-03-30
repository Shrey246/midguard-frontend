export function CategoryChips() {
  const chips = ["All", "Electronics", "RAM"];

  return (
    <div className="flex gap-3 mb-4 flex-wrap">
      {chips.map((chip, index) => (
        <button
          key={chip}
          className="
            px-4 py-1.5 rounded-full text-sm
            border
            border-[color:var(--foreground)/0.15]
            bg-[color:var(--foreground)/0.05]
            text-[var(--foreground)]
            
            hover:border-cyan-400 hover:text-cyan-400
            active:scale-95

            transition-all duration-200
          "
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
