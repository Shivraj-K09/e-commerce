"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createClient } from "@/utils/supabase/client";
import {
  HeartIcon,
  ShoppingCartIcon,
  TruckIcon,
  VerifiedIcon,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface Product {
  id: string;
  name: string;
  retailer_name: string;
  is_verified: boolean;
  price: number;
  description: string;
  main_image_url: string;
  additional_image_urls: string[];
  return_policy: string;
  available_sizes: string[];
}

export function ProductInfo() {
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProduct() {
      if (id) {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching product:", error);
        } else {
          const productData = data as unknown as Product;
          setProduct(productData);
          setMainImage(productData.main_image_url);
          setSelectedSize(productData.available_sizes[0]);
        }
      }
    }

    fetchProduct();

    const subscription = supabase
      .channel(`product_${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "products",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log("Product updated:", payload);
          const updatedProduct = payload.new as unknown as Product;
          setProduct(updatedProduct);
          if (updatedProduct.main_image_url !== mainImage) {
            setMainImage(updatedProduct.main_image_url);
          }
          if (!updatedProduct.available_sizes.includes(selectedSize)) {
            setSelectedSize(updatedProduct.available_sizes[0]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [id, supabase]);

  const handleImageClick = (image: string) => {
    setMainImage(image);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  async function addToCart() {
    if (!product) return;

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("Adding to cart for user:", user.id, "product:", product.id);

      const { data, error } = await supabase
        .from("user_products")
        .upsert(
          {
            user_id: user.id,
            product_id: product.id,
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

      toast({
        title: "Success",
        description: `Item added to cart successfully. Selected size: ${selectedSize}`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      let errorMessage = "Failed to add item to cart. Please try again.";

      if (error instanceof Error) {
        errorMessage += ` Error: ${error.message}`;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-5 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb">
        <Breadcrumb className="py-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/shoes">Shoes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.retailer_name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      <div className="flex flex-col lg:flex-row pt-3 w-full gap-8">
        <div className="w-full lg:w-1/2">
          <div className="rounded-2xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[592px] overflow-hidden">
            <Image
              src={mainImage}
              alt={product.name}
              width={1000}
              height={600}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-3">
            <div
              className="cursor-pointer h-24 sm:h-32 w-full overflow-hidden rounded-2xl"
              onClick={() => handleImageClick(product.main_image_url)}
            >
              <Image
                src={product.main_image_url}
                alt={`${product.name} main view`}
                width={300}
                height={96}
                loading="lazy"
                className="object-cover w-full h-full"
              />
            </div>

            {product.additional_image_urls.map((image, index) => (
              <div
                key={index}
                className="cursor-pointer h-24 sm:h-32 w-full overflow-hidden rounded-2xl"
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  width={300}
                  height={96}
                  loading="lazy"
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-3 mt-6 lg:mt-0 pb-20">
          <div className="border rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-semibold">
                {product.name}
              </h1>
            </div>
            <div className="text-muted-foreground flex items-center">
              <span>By {product.retailer_name}</span>
              {product.is_verified && (
                <sup>
                  <VerifiedIcon
                    className="fill-blue-500 text-black size-3.5 ml-1"
                    aria-label="Verified Retailer"
                  />
                </sup>
              )}
            </div>

            <div className="w-full pt-4 sm:pt-5">
              <h2 className="font-semibold mb-1">Price:</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  <span className="text-2xl sm:text-3xl font-semibold">
                    ₹{formatPrice(product.price)}
                  </span>
                  <span>/only</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                including all taxes
              </p>
            </div>

            <div className="w-full pt-4 sm:pt-5">
              <h2 className="font-semibold mb-1">Product Details:</h2>
              <p className="text-muted-foreground text-sm sm:text-[0.95rem] text-justify">
                {product.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="border rounded-2xl p-4 sm:p-5 w-full">
              <div className="flex flex-col gap-2 w-full">
                <h2>Size</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {product.available_sizes.map((size) => (
                    <Button
                      key={size}
                      className={`border rounded-lg text-center py-2 sm:py-3 font-medium cursor-pointer ${
                        selectedSize === size
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      <span className="text-xs sm:text-sm">{size}</span>
                    </Button>
                  ))}
                </div>
                {selectedSize && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Selected size: {selectedSize}
                  </p>
                )}
              </div>
            </div>
            <div className="border rounded-2xl p-4 sm:p-5 w-full">
              <h2 className="font-bold mb-2">Shipping Information:</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-muted-foreground text-xs sm:text-sm">
                  Free standard shipping on orders over $100.
                </li>
                <li className="text-muted-foreground text-xs sm:text-sm">
                  Express shipping available for an additional $15.
                </li>
                <li className="text-muted-foreground text-xs sm:text-sm">
                  Estimated delivery date: Aug 18 - Aug 20.
                </li>
              </ul>
            </div>
          </div>
          <div className="border rounded-2xl p-4 sm:p-5 w-full pb-10">
            <div className="flex items-center">
              <TruckIcon
                className="size-4 sm:size-5 mr-2 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="text-muted-foreground text-xs sm:text-sm">
                30-day money-back guarantee. Returns accepted within 30 days of
                delivery in original condition.
              </p>
            </div>
          </div>

          <div className="flex items-center flex-col sm:flex-row gap-2 w-full flex-none mt-4">
            <Button
              className="w-full text-sm sm:text-base rounded-xl h-10 sm:h-12"
              onClick={addToCart}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                <>
                  <ShoppingCartIcon className="mr-2 size-4 sm:size-5" />
                  Add to cart
                </>
              )}
            </Button>
            <Button
              className="w-full text-sm sm:text-base rounded-xl h-10 sm:h-12"
              variant="secondary"
              aria-label="Add to Wishlist"
            >
              <HeartIcon className="size-4 sm:size-5 mr-2" />
              Add to wishlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
