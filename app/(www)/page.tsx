"use client";

import { useState } from "react";
import { ProductGrid } from "./_components/product-grid";
import { Sidebar } from "./_components/sidebar";

export default function Home() {
  const [priceRange, setPriceRange] = useState<{
    minPrice: number;
    maxPrice: number;
  } | null>(null);

  const handlePriceRangeChange = (minPrice: number, maxPrice: number) => {
    setPriceRange({ minPrice, maxPrice });
  };

  return (
    <div className="flex h-full">
      <Sidebar onPriceRangeChange={handlePriceRangeChange} />
      <div className="flex-grow overflow-auto lg:ml-[260px]">
        <ProductGrid priceRange={priceRange} />
      </div>
    </div>
  );
}
