"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagnifyingGlass, ShoppingCart } from "@phosphor-icons/react/dist/ssr";
import { HeartIcon, ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { Profile } from "./profile";
import CartCounter from "./cart-counter";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 mx-auto border-b">
      <div className="flex h-16 items-center  max-w-[1700px] mx-auto justify-center w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h2 className="text-[2rem] font-bold flex items-center select-none">
                Sw<span>i</span>ft
                <ShoppingCart className="size-7 ml-1" />
              </h2>
            </Link>
          </div>
          <div className="max-w-[375px] relative w-full flex items-center">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              type="search"
              className="rounded-lg pl-9 h-11 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Search for products..."
            />
          </div>
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
              {/* <Button
                className="flex items-center gap-1.5"
                variant="ghost"
                size="sm"
                title="Wishlist"
              >
                <HeartIcon className="size-5" />
                <span className="sr-only">Wishlist</span>
              </Button> */}

              <Profile />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
