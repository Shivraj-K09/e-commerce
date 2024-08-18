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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { MinusIcon, PlusIcon, ShoppingBagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchUserAndCartItems();
  }, []);

  async function fetchUserAndCartItems() {
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

    const { data, error } = await supabase
      .from("user_products")
      .update({ quantity: newQuantity })
      .eq("id", itemId)
      .select();

    if (error) {
      console.error("Error updating quantity:", error);
    } else {
      fetchUserAndCartItems();
    }
  }

  async function removeFromCart(itemId: string) {
    const { error } = await supabase
      .from("user_products")
      .delete()
      .eq("id", itemId);

    if (error) {
      console.error("Error removing item from cart:", error);
    } else {
      fetchUserAndCartItems();
    }
  }

  async function checkout() {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_products")
      .update({
        status: "purchased",
        purchase_date: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("status", "in_cart")
      .select();

    if (error) {
      console.error("Error during checkout:", error);
    } else {
      fetchUserAndCartItems();
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  return (
    <div className="pt-5 w-full max-w-[1700px] mx-auto flex flex-col h-full">
      {!user ? (
        <>
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex items-center flex-col gap-3">
              <ShoppingBagIcon className="size-10" />
              <h3>Please Login to view your cart.</h3>
              <Button className="w-full" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-2xl flex items-center font-semibold">
            <ShoppingBagIcon className="mr-1.5 size-5" />
            Shopping Bag
          </h3>
          {cartItems.length === 0 ? (
            <p className="text-muted-foreground text-[0.92rem] pt-0.5">
              Your cart is empty. Add some items to your cart to get started.
            </p>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 pt-5">
              <div className="lg:w-2/3 rounded-xl border overflow-y-scroll h-[775px] no-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Price</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-center">Total Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="relative w-40 h-25 mr-4">
                              <Image
                                src={item.products.main_image_url}
                                alt={item.products.name}
                                width={160}
                                height={160}
                                objectFit="cover"
                                className="rounded-xl"
                              />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold">
                                {item.products.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                By {item.products.retailer_name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          ₹{formatPrice(item.products.price)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
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
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              aria-label="Increase Quantity"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          ₹{formatPrice(item.products.price * item.quantity)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="lg:w-[450px] space-y-4">
                <div className="border rounded-xl p-6">
                  <div className="space-y-4 ">
                    <h3 className="font-semibold">Calculated Shipping</h3>
                    <Select>
                      <SelectTrigger
                        className="rounded-lg mt-2"
                        aria-label="Country"
                      >
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        <SelectItem value="us">United State</SelectItem>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-3">
                      <Select>
                        <SelectTrigger className="rounded-lg" aria-label="City">
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="us">United State</SelectItem>
                          <SelectItem value="india">India</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input placeholder="ZIP Code" />
                    </div>
                    <Button className="w-full rounded-lg">Update</Button>
                  </div>

                  <Separator className="mt-10 mb-5" />

                  <div className="space-y-4">
                    <div className="space-y-0.5">
                      <h3 className="font-semibold">Coupon Code</h3>
                      <p className="text-muted-foreground text-justify text-sm">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quam officiis expedita amet quaerat omnis dolores
                        asperiores sit reprehenderit aspernatur, veniam ipsum
                        dolorem dolor hic fuga accusamus ut ad veritatis dolore!
                      </p>
                    </div>
                    <Input className="rounded-lg" placeholder="Coupon Code" />
                    <Button className="w-full rounded-lg">Apply</Button>
                  </div>
                </div>

                <div className="bg-[#ffd28d] text-black rounded-lg p-6">
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
                  <Button className="w-full mt-4 bg-orange-400 hover:bg-orange-500 ">
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
