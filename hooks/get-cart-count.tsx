"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useCartCount() {
  const [cartCount, setCartCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError);
        return;
      }

      const { data, error } = await supabase
        .from("user_cart_counts")
        .select("cart_count")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching cart count:", error);
      } else {
        setCartCount(data?.cart_count || 0);
      }

      const subscription = supabase
        .channel("public:user_cart_counts")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "user_cart_counts",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setCartCount(payload.new.cart_count);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }

    fetchData();
  }, [supabase]);

  return cartCount;
}
