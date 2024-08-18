"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/cart-context";
import { createClient } from "@/utils/supabase/client";
import {
  HeartIcon,
  Loader2Icon,
  ShoppingCart,
  VerifiedIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ProductGrid({
  priceRange,
}: {
  priceRange: { minPrice: number; maxPrice: number } | null;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const supabase = createClient();
  const { updateCartCount } = useCart();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    fetchProducts();
  }, [priceRange, searchQuery]);

  async function fetchProducts() {
    setIsLoading(true);
    let query = supabase.from("products").select("*");

    if (priceRange) {
      query = query
        .gte("price", priceRange.minPrice)
        .lte("price", priceRange.maxPrice);
    }

    if (searchQuery) {
      query = query.ilike("name", `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again.");
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  }

  async function addToCart(productId: string) {
    setLoadingStates((prev) => ({ ...prev, [productId]: true }));

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("Adding to cart for user:", user.id, "product:", productId);

      const { data, error } = await supabase
        .from("user_products")
        .upsert(
          {
            user_id: user.id,
            product_id: productId,
            quantity: 1,
            status: "in_cart",
          },
          { onConflict: "user_id,product_id", ignoreDuplicates: false }
        )
        .select();

      if (error) {
        throw error;
      }

      console.log("Add to cart response:", data);

      toast.success("Item added to cart successfully.");

      // Update the cart count after adding an item
      updateCartCount();
    } catch (error) {
      console.error("Error adding to cart:", error);

      toast.error("Please Login to add item to cart.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }));
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2Icon className="animate-spin h-8 w-8" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {products.map((product, index) => (
            <div
              className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              key={product.id || index}
            >
              <div className="flex flex-col h-full">
                <Link href={`/product/${product.id}`} className="block">
                  <div className="aspect-square h-[250px] md:h-[220px] lg:h-[185px] w-full overflow-hidden">
                    <Image
                      src={product.main_image_url}
                      alt={product.name}
                      width={500}
                      height={500}
                      loading="lazy"
                      className="object-cover w-full h-full select-none hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-3 sm:p-4 flex flex-col gap-2 flex-grow">
                  <Link href={`/product/${product.id}`} className="block group">
                    <h2 className="text-base sm:text-lg font-semibold group-hover:text-primary transition-colors">
                      {product.name}
                    </h2>
                    <div className="text-muted-foreground flex items-center text-sm">
                      <span>By {product.retailer_name}</span>
                      {product.is_verified && (
                        <sup>
                          <VerifiedIcon
                            className="fill-blue-500 text-black size-3.5"
                            aria-label="Verified Retailer"
                          />
                        </sup>
                      )}
                    </div>
                  </Link>
                  <div className="flex items-baseline gap-1 mt-auto">
                    <span className="text-lg sm:text-xl font-semibold">
                      ₹{formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">/only</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      className="w-full text-xs sm:text-sm"
                      onClick={() => addToCart(product.id)}
                      disabled={loadingStates[product.id]}
                    >
                      {loadingStates[product.id] ? (
                        <span className="flex items-center">
                          <Loader2Icon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                          Adding...
                        </span>
                      ) : (
                        <>
                          <ShoppingCart className="size-4 mr-1" /> Add to cart
                        </>
                      )}
                    </Button>
                    {/* <Button variant="secondary">
                      <HeartIcon className="size-5" />
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl font-semibold">No products found</p>
          <p className="text-muted-foreground mt-2">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "No products available at the moment"}
          </p>
        </div>
      )}
    </div>
  );
}
