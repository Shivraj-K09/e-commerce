"use client";

import { Suspense, useState } from "react";
import { ProductGrid } from "./_components/product-grid";
import { Sidebar } from "./_components/sidebar";
import { Loader2Icon } from "lucide-react";

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
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-full">
              <Loader2Icon className="animate-spin h-8 w-8" />
            </div>
          }
        >
          <ProductGrid priceRange={priceRange} />
        </Suspense>
      </div>
    </div>
  );
}
