"use client";

import React, { useState } from "react";

export function Sidebar({
  onPriceRangeChange,
}: {
  onPriceRangeChange: (minPrice: number, maxPrice: number) => void;
}) {
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (minPrice !== undefined && maxPrice !== undefined) {
      onPriceRangeChange(minPrice, maxPrice);
    }
  };

  return (
    <aside className="border-r h-full max-w-[260px] w-full fixed top-16 left-0 lg:block hidden p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Min Price</label>
          <input
            type="number"
            value={minPrice ?? ""}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            placeholder="Min Price"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Max Price</label>
          <input
            type="number"
            value={maxPrice ?? ""}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            placeholder="Max Price"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded"
        >
          Apply
        </button>
      </form>
    </aside>
  );
}
