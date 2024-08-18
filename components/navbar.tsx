"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MagnifyingGlass,
  ShoppingCart,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { Profile } from "./profile";
import CartCounter from "./cart-counter";
import { useRouter, useSearchParams } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        router.push("/");
      }
    },
    [searchQuery, router]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    router.push("/");
  }, [router]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 mx-auto border-b">
      <div className="flex h-16 items-center max-w-[1700px] mx-auto justify-center w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h2 className="text-[2rem] font-bold flex items-center select-none">
                Sw<span>i</span>ft
                <ShoppingCart className="size-7 ml-1" />
              </h2>
            </Link>
          </div>
          <form
            onSubmit={handleSearch}
            className="max-w-[375px] relative w-full flex items-center"
          >
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              className="rounded-lg pl-9 pr-9 h-11 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </form>
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Button
                className="flex items-center gap-1.5 relative"
                variant="ghost"
                size="sm"
                title="Cart"
                asChild
              >
                <Link href="/cart">
                  <ShoppingBagIcon className="size-5" />
                  <CartCounter />
                  <span className="sr-only">Cart</span>
                </Link>
              </Button>
              <Profile />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
