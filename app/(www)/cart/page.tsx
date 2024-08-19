"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { MinusIcon, PlusIcon, ShoppingBagIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Cart() {
  const supabase = createClient();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({
    email: "",
    name: "",
    address: {
      line1: "",
      city: "",
      state: "",
      postal_code: "",
      country: "IN",
    },
  });

  useEffect(() => {
    fetchUserAndCartItems();
  }, []);

  async function fetchUserAndCartItems() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data, error } = await supabase
        .from("user_products")
        .select(
          `
          *,
          products (*)
        `
        )
        .eq("user_id", user.id)
        .eq("status", "in_cart");

      if (error) {
        console.error("Error fetching cart items:", error);
      } else {
        setCartItems(data || []);
        calculateTotal(data);
      }
    }
    setLoading(false);
  }

  function calculateTotal(items: any[]) {
    const sum = items.reduce(
      (acc, item) => acc + item.products.price * item.quantity,
      0
    );
    setTotal(sum);
  }

  async function updateQuantity(itemId: string, newQuantity: number) {
    if (newQuantity < 1) return;

    // Update local state immediately
    const updatedItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);

    // Then update the database
    const { error } = await supabase
      .from("user_products")
      .update({ quantity: newQuantity })
      .eq("id", itemId);

    if (error) {
      console.error("Error updating quantity:", error);
      // If there's an error, revert the local state
      fetchUserAndCartItems();
    }
  }

  async function removeFromCart(itemId: string) {
    // Update local state immediately
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedItems);
    calculateTotal(updatedItems);

    // Then update the database
    const { error } = await supabase
      .from("user_products")
      .delete()
      .eq("id", itemId);

    if (error) {
      console.error("Error removing item from cart:", error);
      // If there's an error, revert the local state
      fetchUserAndCartItems();
    }
  }

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            price_data: {
              currency: "inr",
              product_data: {
                name: item.products.name,
              },
              unit_amount: item.products.price * 100,
            },
            quantity: item.quantity,
          })),
          customerDetails,
        }),
      });

      const session = await response.json();

      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        console.error("Error redirecting to checkout:", error);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  return (
    <div className="pt-5 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-0 flex flex-col h-full">
      {loading ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-40 rounded-md" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <Skeleton className="h-[400px] lg:h-[705px] w-full lg:w-2/3 rounded-md" />
            <div className="space-y-4 w-full lg:w-1/3">
              <Skeleton className="h-[449px] w-full rounded-md" />
              <Skeleton className="h-[240px] w-full rounded-md" />
            </div>
          </div>
        </div>
      ) : !user ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex items-center flex-col gap-3">
            <ShoppingBagIcon className="size-10" />
            <h3>Please Login to view your cart.</h3>
            <Button className="w-full" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-xl sm:text-2xl flex items-center font-semibold">
            <ShoppingBagIcon className="mr-1.5 size-5" />
            Shopping Bag
          </h3>
          {cartItems.length === 0 ? (
            <p className="text-muted-foreground text-sm sm:text-[0.92rem] pt-0.5">
              Your cart is empty. Add some items to your cart to get started.
            </p>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 pt-5">
              <div className="w-full lg:w-2/3 rounded-xl border overflow-y-auto max-h-[500px] lg:max-h-[775px] no-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden sm:table-cell">
                        Product
                      </TableHead>
                      <TableHead className="text-center hidden sm:table-cell">
                        Price
                      </TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-center hidden sm:table-cell">
                        Total Price
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            <div className="relative w-full sm:w-40 aspect-video mb-2 sm:mb-0 sm:mr-4">
                              <Image
                                src={item.products.main_image_url}
                                alt={item.products.name}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-xl"
                              />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold">
                                {item.products.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                By {item.products.retailer_name}
                              </p>
                              <p className="text-sm font-semibold sm:hidden">
                                ₹{formatPrice(item.products.price)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center hidden sm:table-cell">
                          ₹{formatPrice(item.products.price)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.preventDefault();
                                updateQuantity(item.id, item.quantity - 1);
                              }}
                              aria-label="Decrease Quantity"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </Button>
                            <span className="mx-2 w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                updateQuantity(item.id, item.quantity + 1);
                              }}
                              aria-label="Increase Quantity"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center hidden sm:table-cell">
                          ₹{formatPrice(item.products.price * item.quantity)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="px-2 h-8"
                          >
                            <TrashIcon className="h-4 w-4 sm:hidden" />
                            <span className="hidden sm:inline">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="w-full lg:w-1/3 space-y-4">
                <div className="border rounded-xl p-4 sm:p-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Calculated Shipping</h3>
                    <Select>
                      <SelectTrigger
                        className="rounded-lg mt-2"
                        aria-label="Country"
                      >
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <Select>
                        <SelectTrigger className="rounded-lg" aria-label="City">
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="ny">New York</SelectItem>
                          <SelectItem value="mumbai">Mumbai</SelectItem>
                          <SelectItem value="london">London</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input placeholder="ZIP Code" />
                    </div>
                    <Button className="w-full rounded-lg">Update</Button>
                  </div>

                  <Separator className="my-4 sm:my-6" />

                  <div className="space-y-4">
                    <div className="space-y-0.5">
                      <h3 className="font-semibold">Coupon Code</h3>
                      <p className="text-muted-foreground text-justify text-xs sm:text-sm">
                        Enter your coupon code to get a discount on your
                        purchase.
                      </p>
                    </div>
                    <Input className="rounded-lg" placeholder="Coupon Code" />
                    <Button className="w-full rounded-lg">Apply</Button>
                  </div>
                </div>

                <div className="bg-[#ffd28d] text-black rounded-lg p-4 sm:p-6">
                  <h2 className="font-bold mb-4">Cart Total</h2>
                  <div className="flex justify-between mb-2">
                    <span>Cart Subtotal</span>
                    <span>₹{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Discount</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between font-bold mt-4">
                    <span>Cart Total</span>
                    <span>₹{formatPrice(total)}</span>
                  </div>
                  <Button
                    className="w-full mt-4 bg-orange-400 hover:bg-orange-500"
                    onClick={checkout}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
