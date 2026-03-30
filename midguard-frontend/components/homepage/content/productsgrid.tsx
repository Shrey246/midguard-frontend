"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ProductCard } from "./productcard";
import { Pagination } from "./pagination";

const ITEMS_PER_PAGE = 4;
const TOTAL_PAGES = 5;

export function ProductsGrid() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await api.getRooms();
        setRooms(data);
      } catch (err) {
        console.error("❌ Failed to fetch rooms:", err);
      }
    };

    fetchRooms();
  }, []);

  // Pagination logic
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = rooms.slice(start, start + ITEMS_PER_PAGE);

  // Fill empty slots
  const filledProducts = [...paginated];
  while (filledProducts.length < ITEMS_PER_PAGE) {
    filledProducts.push(null);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Best Selling Products of the Week
      </h2>

      <div className="grid grid-cols-4 gap-6">
        {filledProducts.map((p, index) => (
          <ProductCard key={index} product={p} />
        ))}
      </div>

      <Pagination page={page} setPage={setPage} totalPages={TOTAL_PAGES} />
    </div>
  );
}
