import { notFound } from "next/navigation";
import { Product } from "@/lib/types";
import Detail from "@/components/products/Detail";
import AlsoLikeSection from "@/components/products/AlsoLikeSection";
import { mockProducts } from "@/lib/mockdata";

function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((product) => product.link === slug);
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Fetch the specific product based on the slug from the URL
  const slug = await params.slug;
  const product = getProductBySlug(slug);

  // If no product is found for the given slug, show a 404 page.
  if (!product) {
    notFound();
  }

  return (
    <>
      <Detail product={product} />
      <AlsoLikeSection />
    </>
  );
}
