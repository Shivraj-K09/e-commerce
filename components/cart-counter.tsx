"use client";

import { useCart } from "@/context/cart-context";

export default function CartCounter() {
  const { cartCount } = useCart();

  return (
    <span className="absolute -top-1 -right-0 bg-primary bg-red-500 text-description-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {cartCount}
    </span>
  );
}
