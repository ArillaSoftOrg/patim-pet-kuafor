"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ProductGridLive } from "@/components/product/ProductGridLive";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Product } from "@/data/products";

// Page header/empty-state chrome is translated directly from the
// dictionary — products has no admin-editable page_content record (unlike
// servicesPage/homepage), just the fixed dictionary copy. The product list
// itself is now Supabase-backed; see ProductGridLive for the live-fetch +
// Turkish-overlay logic (same division as ServicesIndexContent /
// ServiceGridLive). Needs to be a Client Component (useLocale) since
// src/app/products/page.tsx itself is a Server Component with no locale
// param.
export function ProductsIndexContent({ defaultProducts }: { defaultProducts: Product[] }) {
  const { dictionary } = useLocale();

  return (
    <>
      <PageHeader
        title={dictionary.shared.productsPage.title}
        description={dictionary.shared.productsPage.description}
      />

      <Section tone="background">
        <Container size="wide">
          <ProductGridLive
            defaultItems={defaultProducts}
            emptyTitle={dictionary.shared.productsEmptyTitle}
            emptyDescription={dictionary.shared.productsEmptyDescription}
            showCategoryFilter
          />
        </Container>
      </Section>
    </>
  );
}
