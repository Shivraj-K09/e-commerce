import { Navbar } from "@/components/navbar";

import { TailwindIndicator } from "@/components/tailwind-indicator";
import { CartProvider } from "@/context/cart-context";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CartProvider>
        <div className="flex flex-col h-full">
          <div className="flex">
            <Navbar />
          </div>
          <main className="flex-grow">{children}</main>
        </div>
        <TailwindIndicator />
      </CartProvider>
    </>
  );
}
