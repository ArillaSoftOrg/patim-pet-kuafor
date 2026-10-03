export interface NavItem {
  label: string;
  href: string;
}

// Mirrors the approved sitemap in README.md §5. Do not add routes here
// that are not part of that sitemap.
export const primaryNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: NavItem[] = [...primaryNav];

// Legal section shown as its own labeled group in the footer (desktop and
// mobile — Footer.tsx renders a single responsive layout for both).
export const legalNav: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "KVKK Notice", href: "/kvkk" },
  { label: "Cookie Policy", href: "/cookies" },
];

// Site-wide booking CTA (header, mobile menu, hero, CTA sections). Points
// at the online booking flow; see src/lib/appointments/links.ts for
// service-specific links.
export const primaryCta: NavItem = {
  label: "Request Appointment",
  href: "/appointment",
};
