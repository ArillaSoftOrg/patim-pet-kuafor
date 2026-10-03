"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { footerNav, legalNav } from "@/data/navigation";
import { business } from "@/data/business";
import { LiveLogo } from "@/components/content/LiveLogo";
import { LiveBusinessName } from "@/components/content/LiveBusinessName";
import { LiveFooterContact } from "@/components/content/LiveFooterContact";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { navHref, navLabel } from "@/lib/i18n/navLabels";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";

export function Footer() {
  const { locale, dictionary } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      {/* Mobile is a left-aligned, brand → nav → contact stack (each
          section's own gap-y handles its internal rhythm; gap-7 here is
          the space between sections). sm+ switches to the existing
          3-column row and is untouched. */}
      <Container className="flex flex-col items-start gap-7 py-7 sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:py-8">
        <Link href={buildLocalizedPath(locale, "/")} className="inline-flex w-fit items-center gap-2">
          <LiveLogo defaultBusiness={business} size={32} />
          <span className="text-[16px] font-semibold text-foreground">
            <LiveBusinessName defaultBusiness={business} />
          </span>
        </Link>

        <nav
          aria-label={dictionary.common.footerNavAriaLabel}
          className="flex flex-col gap-2 sm:gap-1.5"
        >
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={navHref(locale, item)}
              className="text-[15px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {navLabel(dictionary, item)}
            </Link>
          ))}
        </nav>

        {/* Separate, labeled group for the legal pages (Privacy, KVKK
            Notice, Cookie Policy) — kept apart from the main site nav
            above so it reads as its own category, same on mobile (stacked)
            and desktop (its own column). */}
        <nav aria-label={dictionary.common.footerLegalAriaLabel} className="flex flex-col gap-2 sm:gap-1.5">
          <p className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
            {dictionary.common.footerLegalHeading}
          </p>
          {legalNav.map((item) => (
            <Link
              key={item.href}
              href={navHref(locale, item)}
              className="text-[15px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {navLabel(dictionary, item)}
            </Link>
          ))}
        </nav>

        {/* sm:pr-20 keeps these text links clear of the fixed WhatsApp
            button (h-14, bottom/right-5–6) so it never sits over a real
            link here, at any viewport width or scroll position. Mobile is
            already left-aligned and stacked above the copyright row, so it
            doesn't need the same clearance. */}
        <div className="sm:pr-20">
          <LiveFooterContact defaultBusiness={business} />
        </div>
      </Container>

      {/* pb-24 on mobile keeps the copyright line clear of the fixed
          WhatsApp button (h-14, bottom-5) once the page is scrolled all
          the way down — sm:pb-3 restores the tight desktop spacing, where
          the 3-column layout above already reserves its own clearance
          (see LiveFooterContact's sm:pr-20 wrapper in this file). */}
      <Container className="border-t border-border py-3 pb-24 text-[14px] text-muted-foreground sm:pb-3">
        © {year} <LiveBusinessName defaultBusiness={business} />. {dictionary.common.allRightsReserved}
      </Container>
    </footer>
  );
}
