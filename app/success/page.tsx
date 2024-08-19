"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { CircleCheckIcon, ShoppingBagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function SuccessPageContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const supabase = createClient();

  useEffect(() => {
    if (sessionId) {
      updateOrderStatus();
    }
  }, [sessionId]);

  async function updateOrderStatus() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("user_products")
          .update({
            status: "purchased",
            purchase_date: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .eq("status", "in_cart");

        if (error) {
          console.error("Error updating order status:", error);
          setStatus("error");
        } else {
          setStatus("success");
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setStatus("error");
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-full h-full">
        Processing your order...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div>
        There was an error processing your order. Please contact support.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full w-full flex-col">
      <CircleCheckIcon className="size-10 text-green-500" />
      <h1 className="text-xl font-bold">Thank you for your purchase!</h1>
      <p>Your order has been successfully processed.</p>

      <Button className="mt-4" asChild>
        <Link href="/">
          <ShoppingBagIcon className="mr-1.5 size-5" />
          Shop More
        </Link>
      </Button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
