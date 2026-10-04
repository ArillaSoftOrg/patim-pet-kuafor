"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/Button";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { primaryNav, primaryCta } from "@/data/navigation";
import { business } from "@/data/business";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { navHref, navLabel } from "@/lib/i18n/navLabels";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";

export function Header() {
  const { locale, dictionary } = useLocale();

  return (
    // Mobile/tablet only: sticky (not fixed) so the header stays pinned to
    // the top while scrolling without being pulled out of document flow —
    // no compensating top padding needed elsewhere, so there's no layout
    // jump when it engages. `lg:static` resets this back to the original,
    // unchanged desktop behavior (header scrolls away with the page). Still
    // a valid positioning root for MobileNavigation's dropdown panel below
    // (`sticky`, like the `relative` it replaces, establishes a containing
    // block for absolutely-positioned descendants) — and its own z-40, on a
    // positioned element, guarantees it (and that panel) paint above the
    // normal-flow <main> content beneath it, same principle as
    // LiveWhatsAppButton's z-50 fixed button elsewhere in the tree.
    // pt-[env(safe-area-inset-top)] is a no-op today (no viewport-fit=cover
    // is set anywhere in the app, so the env() var is always 0) but keeps
    // the header safe-area-aware if that ever changes.
    <header className="sticky top-0 z-40 border-b border-border bg-surface pt-[env(safe-area-inset-top)] lg:static">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          href={buildLocalizedPath(locale, "/")}
          aria-label={business.name}
          className="inline-flex flex-shrink-0 items-center"
        >
          {/* Patim Pet Kuaför has no standalone vector logo file — the real
              brand art only exists as the illustrated storefront signage
              (groomer + dog + cat, the "PATIM PET KUAFÖR" wordmark, and the
              "Faik Kopuz" / @patimpetkuafor signature), all one combined
              design. public/brand/logo-full.jpg is a crop of that real
              signage photo (public/salon/exterior.jpg) — not a separate
              icon or wordmark asset, just this one full lockup, per the
              single-combined-logo direction. This Image carries the Link's
              accessible name since it's the only logo element. */}
          <span className="flex h-11 flex-shrink-0 items-center overflow-hidden rounded-md sm:h-14">
            <Image
              src="/brand/logo-full.jpg"
              alt={business.name}
              width={1010}
              height={380}
              sizes="280px"
              className="h-full w-auto object-contain"
              preload
            />
          </span>
        </Link>

        <nav aria-label={dictionary.common.primaryNavAriaLabel} className="hidden lg:flex lg:items-center lg:gap-5 xl:gap-8">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={navHref(locale, item)}
              className="whitespace-nowrap text-[15px] font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {navLabel(dictionary, item)}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <LanguageSwitcher />
          <Link href={navHref(locale, primaryCta)} className={buttonVariants({ variant: "primary" })}>
            {navLabel(dictionary, primaryCta)}
          </Link>
        </div>

        <MobileNavigation />
      </Container>
    </header>
  );
}
