import { notFound } from "next/navigation";
import { isPrefixedLocale, PREFIXED_LOCALES } from "@/lib/i18n/config";

// Only tr/ru live under this segment — English has no prefix and is
// served by the unprefixed routes in app/ directly (see those files;
// app/[locale]/* re-exports them rather than duplicating their content).
// generateStaticParams here covers the whole subtree, so every nested
// page/[slug] combination is still statically generated per locale.
export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Guards against /en/* (English is unprefixed — that path shouldn't
  // resolve at all) and any other unsupported segment value.
  if (!isPrefixedLocale(locale)) {
    notFound();
  }

  return children;
}
