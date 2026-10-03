"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/Button";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { buildWhatsAppHref } from "@/lib/business/contactLinks";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";
import { getProductTrBySlug } from "@/lib/i18n/content/products.tr";
import { getProductRuBySlug } from "@/lib/i18n/content/products.ru";
import type { Product } from "@/data/products";
import type { Business } from "@/data/business";

// Shared template for every /products/[slug] page, mirroring
// ServiceDetail's PageHeader-then-Section structure so the two catalog
// experiences (services, products) read as one design system.
//
// `product` is always the English/live row — resolved server-side for
// first paint (see app/products/[slug]/page.tsx's resolveProductMetadata;
// notFound()/metadata stay English-based, a deliberate scope boundary
// noted alongside products.tr.ts) and kept live thereafter by
// ProductDetailLive, which already owns the Supabase fetch + is_published
// gating. Turkish swaps in the matching static translation by slug for
// display only, on top of whatever live/default row ProductDetailLive
// hands this component — same admin-edit-bypass tradeoff as
// ServiceGridLive/services.tr.ts, not something this component decides.
export function ProductDetail({ product: englishProduct, business }: { product: Product; business: Business }) {
  const { locale, dictionary } = useLocale();
  const product =
    locale === "tr"
      ? (getProductTrBySlug(englishProduct.slug) ?? englishProduct)
      : locale === "ru"
        ? (getProductRuBySlug(englishProduct.slug) ?? englishProduct)
        : englishProduct;
  const whatsappMessage =
    locale === "tr"
      ? `Merhaba! ${product.name} hakkında bilgi almak istiyorum.`
      : locale === "ru"
        ? `Здравствуйте! Хочу узнать подробнее о товаре «${product.name}».`
        : `Hi! I'd like to ask about ${product.name}.`;
  const whatsappAriaLabel =
    locale === "tr"
      ? `KulaPAWS'a WhatsApp'tan ${product.name} hakkında yazın (yeni sekmede açılır)`
      : locale === "ru"
        ? `Написать KulaPAWS в WhatsApp о товаре «${product.name}» (откроется в новой вкладке)`
        : `Message KulaPAWS on WhatsApp about ${product.name} (opens in a new tab)`;

  return (
    <>
      <PageHeader eyebrow={product.category} title={product.name} description={product.shortDescription}>
        <p className="mt-4">
          <Link
            href={buildLocalizedPath(locale, "/products")}
            className="text-[15px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {dictionary.shared.backToProducts}
          </Link>
        </p>
      </PageHeader>

      <Section tone="surface">
        <Container size="wide" className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
          <PhotoPlaceholder
            src={product.image}
            alt={product.name}
            label={
              locale === "tr"
                ? `${product.name} fotoğrafı yakında`
                : locale === "ru"
                  ? `Фото «${product.name}» появится позже`
                  : `${product.name} photo coming soon`
            }
            aspect="square"
          />
          <div>
            <span className="inline-flex w-fit items-center rounded-full bg-secondary px-3 py-1 text-[13px] font-medium text-secondary-foreground">
              {dictionary.shared.productDetail.brand}: {product.brand}
            </span>
            <p className="mt-5 max-w-[60ch] text-[16px] text-foreground sm:text-[18px]">
              {product.description}
            </p>
            {product.price && (
              <p className="mt-6 text-[24px] font-bold text-foreground">{product.price}</p>
            )}
            <p className="mt-6 max-w-[50ch] text-[15px] text-muted-foreground">
              {dictionary.shared.productCtaDescription}
            </p>
            <div className="mt-4 flex flex-col flex-wrap items-start gap-3 sm:flex-row sm:items-center">
              {business.whatsapp && (
                <a
                  href={buildWhatsAppHref(business.whatsapp, whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "primary", size: "lg", className: "gap-1.5" })}
                  aria-label={whatsappAriaLabel}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-[18px] w-[18px] flex-shrink-0"
                  >
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2Zm0 1.67c2.19 0 4.25.85 5.8 2.4a8.16 8.16 0 0 1 2.4 5.8c0 4.53-3.68 8.21-8.21 8.21a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.53 3.69-8.2 8.24-8.2Zm-4.53 4.3c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42Z" />
                  </svg>
                  {dictionary.shared.whatsapp}
                </a>
              )}
              <Link
                href={buildLocalizedPath(locale, "/contact")}
                className={buttonVariants({ variant: business.whatsapp ? "secondary" : "primary", size: "lg" })}
              >
                {dictionary.shared.contactUs}
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
