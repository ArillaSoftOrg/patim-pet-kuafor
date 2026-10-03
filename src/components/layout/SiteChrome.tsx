"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LiveWhatsAppButton } from "@/components/content/LiveWhatsAppButton";
import { business } from "@/data/business";

interface SiteChromeProps {
  header: ReactNode;
  footer: ReactNode;
  businessJsonLd: ReactNode;
  children: ReactNode;
}

// Decides whether the public Header/Footer wrap the page, based on route.
// header/footer/businessJsonLd/children are all rendered by the (Server
// Component) root layout and passed in as already-built ReactNode — this
// component only ever toggles their visibility, so no public page content
// becomes a Client Component by association. businessJsonLd is scoped to
// the public branch only — no need for it on /admin, which is noindex
// anyway. The floating WhatsApp button lives here (not in Hero, which only
// renders on the homepage) so it's present on every public page; same
// admin exclusion as header/footer since admin isn't customer-facing.
export function SiteChrome({ header, footer, businessJsonLd, children }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
  }

  return (
    <>
      {businessJsonLd}
      {header}
      <main className="flex flex-1 flex-col">{children}</main>
      {footer}
      <LiveWhatsAppButton defaultBusiness={business} />
    </>
  );
}
