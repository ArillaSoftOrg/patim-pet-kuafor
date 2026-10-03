import type { Metadata } from "next";
import { ProductsIndexContent } from "@/components/content/ProductsIndexContent";
import { getProductsServer } from "@/lib/content/getProductsServer";

// Real products have now shipped (README.md §23 "Products") — indexable,
// per the manual-flip note this replaces.
export const metadata: Metadata = {
  title: "Products",
  description: "Discover KulaPAWS products — a curated selection for your pet.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  // Server-resolved (see getProductsServer.ts) so the real, published
  // products are in the initial HTML instead of only appearing once
  // ProductGridLive's own client-side fetch resolves. ProductGridLive
  // still re-fetches after mount via useLiveContent — this only changes
  // what it starts from.
  const publishedProducts = await getProductsServer();

  return <ProductsIndexContent defaultProducts={publishedProducts} />;
}
