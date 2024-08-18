"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CartItem = ({
  item,
  onUpdateQuantity,
}: {
  item: {
    id: number;
    name: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
  };
  onUpdateQuantity: (id: number, newQuantity: number) => void;
}) => (
  <TableRow>
    <TableCell>
      <div className="flex items-center">
        <div className="relative w-20 h-25 mr-4">
          <Image
            src="/api/placeholder/80/100"
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground">Color: {item.color}</p>
          <p className="text-sm text-muted-foreground">Size: {item.size}</p>
        </div>
      </div>
    </TableCell>
    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
    <TableCell>
      <div className="flex items-center justify-center">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        <span className="mx-2 w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
    <TableCell className="text-right font-semibold text-orange-400">
      ${(item.price * item.quantity).toFixed(2)}
    </TableCell>
  </TableRow>
);

export default function ShoppingCart() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Floral Print Wrap Dress",
      color: "Blue",
      size: "42",
      price: 20.5,
      quantity: 2,
    },
    {
      id: 2,
      name: "Floral Print Wrap Dress",
      color: "Red",
      size: "42",
      price: 30.5,
      quantity: 1,
    },
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 4.0;
  const total = subtotal - discount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Shopping Bag</h1>
      <p className="text-muted-foreground mb-6">
        {items.length} items in your bag.
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="lg:w-1/3 space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="font-bold mb-4">Calculated Shipping</h2>
            <Select>
              <option>Country</option>
            </Select>
            <div className="flex gap-4 mb-4">
              <Select>
                <option>State / City</option>
              </Select>
              <Input placeholder="ZIP Code" className="flex-1" />
            </div>
            <Button className="w-full">Update</Button>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="font-bold mb-4">Coupon Code</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <Input placeholder="Coupon Code" className="mb-4" />
            <Button className="w-full">Apply</Button>
          </div>

          <div className="bg-orange-100 rounded-lg p-6">
            <h2 className="font-bold mb-4">Cart Total</h2>
            <div className="flex justify-between mb-2">
              <span>Cart Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discount</span>
              <span className="text-green-600">-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mt-4">
              <span>Cart Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button className="w-full mt-4 bg-orange-400 hover:bg-orange-500 text-white">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
