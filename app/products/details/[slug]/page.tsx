import { notFound } from "next/navigation";
import { Product } from "@/lib/types";
import Detail from "@/components/products/Detail";
import AlsoLikeSection from "@/components/products/AlsoLikeSection";
import { mockProducts } from "@/lib/mockdata";
import { useProductInfo } from "@/components/actions/hooks/useProducts";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Fetch the specific product based on the slug from the URL
  const slug = (await params).slug;


  return (
    <>
      <Detail slug={slug} />
      <AlsoLikeSection />
    </>
  );
}
