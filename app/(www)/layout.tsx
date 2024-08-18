import { Navbar } from "@/components/navbar";

import { TailwindIndicator } from "@/components/tailwind-indicator";
import { CartProvider } from "@/context/cart-context";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CartProvider>
        <div className="flex flex-col h-full">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-16">
                <Loader2Icon className="animate-spin h-8 w-8" />
              </div>
            }
          >
            <Navbar />
          </Suspense>
          <main className="flex-grow">{children}</main>
        </div>
        <TailwindIndicator />
      </CartProvider>
    </>
  );
}
