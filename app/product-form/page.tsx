"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { X } from "lucide-react";

export default function ProductForm() {
  const supabase = createClient();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [retailerName, setRetailerName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productMainImageUrl, setProductMainImageUrl] = useState("");
  const [productAdditionalImageUrls, setProductAdditionalImageUrls] = useState<
    string[]
  >([]);
  const [productAvailableSizes, setProductAvailableSizes] = useState<string[]>(
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.from("products").insert([
      {
        name: productName,
        description: productDescription,
        retailer_name: retailerName,
        price: productPrice,
        main_image_url: productMainImageUrl,
        additional_image_urls: productAdditionalImageUrls,
        available_sizes: productAvailableSizes,
      },
    ]);

    if (error) {
      console.error("Error inserting product:", error);
    } else {
      console.log("Product inserted successfully:", data);
      // Reset the form or show a success message
    }
  };

  const handleAddImageUrl = () => {
    setProductAdditionalImageUrls([...productAdditionalImageUrls, ""]);
  };

  const handleRemoveImageUrl = (index: number) => {
    const updatedUrls = [...productAdditionalImageUrls];
    updatedUrls.splice(index, 1);
    setProductAdditionalImageUrls(updatedUrls);
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const updatedUrls = [...productAdditionalImageUrls];
    updatedUrls[index] = value;
    setProductAdditionalImageUrls(updatedUrls);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-[750px] w-full mx-auto border p-10 rounded-xl mt-10"
    >
      <div>
        <Label htmlFor="productName">Product Name</Label>
        <Input
          id="productName"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="productDescription">Product Description</Label>
        <Textarea
          id="productDescription"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="retailerName">Retailer Name</Label>
        <Input
          id="retailerName"
          type="text"
          value={retailerName}
          onChange={(e) => setRetailerName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="productPrice">Product Price</Label>
        <Input
          id="productPrice"
          type="number"
          step="0.01"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="productMainImageUrl">Product Main Image URL</Label>
        <Input
          id="productMainImageUrl"
          type="text"
          value={productMainImageUrl}
          onChange={(e) => setProductMainImageUrl(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col">
        <Label>Product Additional Image URLs</Label>
        {productAdditionalImageUrls.map((url, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <Input
              type="text"
              value={url}
              onChange={(e) => handleImageUrlChange(index, e.target.value)}
              required
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleRemoveImageUrl(index)}
            >
              <X size={20} />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          className="mt-4"
          onClick={handleAddImageUrl}
        >
          Add Image
        </Button>
      </div>

      <div>
        <Label htmlFor="productAvailableSizes">
          Product Available Sizes (comma-separated)
        </Label>
        <Input
          id="productAvailableSizes"
          type="text"
          value={productAvailableSizes.join(",")}
          onChange={(e) => setProductAvailableSizes(e.target.value.split(","))}
        />
      </div>

      <Button type="submit">Add Product</Button>
    </form>
  );
}
