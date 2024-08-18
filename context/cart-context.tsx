"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface CartContextType {
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
  updateCartCount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartCount, setCartCount] = useState(0);
  const supabase = createClient();

  const updateCartCount = () => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("user_products")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "in_cart")
          .then(({ count }) => {
            setCartCount(count || 0);
          });
      }
    });
  };

  useEffect(() => {
    updateCartCount();

    const channel = supabase
      .channel("cart_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_products" },
        updateCartCount
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
