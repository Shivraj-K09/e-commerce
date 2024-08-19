"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

export function Sidebar({
  onPriceRangeChange,
  onReset,
}: {
  onPriceRangeChange: (
    minPrice: number | null,
    maxPrice: number | null
  ) => void;
  onReset: () => void;
}) {
  const [minPrice, setMinPrice] = useState<string>();
  const [maxPrice, setMaxPrice] = useState<string>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    onPriceRangeChange(min, max);
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    onReset();
  };

  return (
    <aside className="border-r h-full max-w-[260px] w-full fixed top-16 left-0 lg:block hidden p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Min Price</label>
          <Input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Min Price"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Max Price</label>
          <Input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Max Price"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="w-full py-2 px-4 rounded">
            Apply
          </Button>
          <Button
            variant="secondary"
            className="w-full py-2 px-4 rounded"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </form>
    </aside>
  );
}
