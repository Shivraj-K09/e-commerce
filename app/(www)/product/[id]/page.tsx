import { ProductInfo } from "@/components/product-info";

export default function Product({ params }: { params: { id: string } }) {
  return <ProductInfo />;
}
